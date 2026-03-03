import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

function sanitizeEmail(input: string): string {
  return (input ?? '')
    .normalize('NFKC')
    // Remove ASCII control chars and common invisible Unicode chars
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function createEphemeralClientFromSupabase() {
  const anyClient = supabase as any;
  const url = anyClient?.supabaseUrl;
  const key = anyClient?.supabaseKey;
  if (typeof url !== 'string' || typeof key !== 'string') return null;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

async function withTimeout<T>(promiseLike: PromiseLike<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout (${label}) après ${Math.round(ms / 1000)}s`));
    }, ms);
  });

  const promise = Promise.resolve(promiseLike as any) as Promise<T>;

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

function toErrInfo(err: unknown): { code?: string; message?: string } | null {
  if (!err || typeof err !== 'object') return null;
  const anyErr = err as { code?: unknown; message?: unknown };
  return {
    code: typeof anyErr.code === 'string' ? anyErr.code : undefined,
    message: typeof anyErr.message === 'string' ? anyErr.message : undefined,
  };
}

async function upsertProfile(params: {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  faculty: string;
  year: number | null;
}) {
  const now = new Date().toISOString();
  const payload = {
    id: params.userId,
    email: params.email,
    first_name: params.firstName || null,
    last_name: params.lastName || null,
    faculty: params.faculty || null,
    year: params.year ?? null,
    role: 'student',
    preferences: {},
    updated_at: now,
  };

  const { data, error, status } = await withTimeout(
    supabase.from('profiles').upsert(payload, { onConflict: 'id' }).select('id').maybeSingle(),
    10_000,
    'upsertProfile'
  );

  if (!error && data?.id) return;

  if (status === 401 || status === 403) {
    throw new Error(
      'Accès refusé lors de la création/mise à jour du profil (RLS/permissions). Vérifie les policies RLS de `profiles` pour que le superAdmin puisse `insert` et `update` n’importe quel profil.'
    );
  }

  throw new Error(
    'Profil non créé/accessible (profiles). Détails: ' + JSON.stringify({ status, error: toErrInfo(error) })
  );
}

async function signUpUserPreservingSession(params: {
  email: string;
  password: string;
  metadata: Record<string, unknown>;
}): Promise<string> {
  // Garder la session courante (SuperAdmin) avant de créer un autre utilisateur.
  const { data: sessionData } = await withTimeout(supabase.auth.getSession(), 10_000, 'getSession');
  const currentSession = sessionData?.session ?? null;

  // Créer l'utilisateur dans Supabase Auth
  const ephemeralAuth = createEphemeralClientFromSupabase();
  const authClient = ephemeralAuth?.auth ?? supabase.auth;

  const { data: signUpData, error: signUpError } = await withTimeout(
    authClient.signUp({
      email: params.email,
      password: params.password,
      options: { data: params.metadata },
    }),
    15_000,
    'signUp'
  );

  // Restaurer la session du SuperAdmin si on a utilisé le client principal
  if (!ephemeralAuth && currentSession) {
    try {
      await withTimeout(
        supabase.auth.setSession({
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
        }),
        10_000,
        'restoreSession'
      );
    } catch (restoreError) {
      console.warn('⚠️ Impossible de restaurer la session après signUp:', restoreError);
    }
  }

  if (signUpError) {
    const errAny = signUpError as any;
    const status = errAny?.status ?? errAny?.statusCode;
    console.error('❌ signUpError:', signUpError);

    if (status === 429) {
      throw new Error(
        'Trop de tentatives (429). Attends 5–15 minutes puis réessaie, ou augmente les limites dans Authentication → Rate Limits.'
      );
    }

    if (
      typeof errAny?.message === 'string' &&
      errAny.message.includes('Email address') &&
      errAny.message.includes('is invalid')
    ) {
      throw new Error(
        'Supabase Auth rejette cet email comme “invalid”. En général c\'est une restriction côté projet (allowlist/denylist, anti-abus) ou un blocage temporaire. Vérifie Authentication → Logs pour voir le motif exact.'
      );
    }

    throw new Error(errAny?.message || 'Erreur lors de la création (Supabase Auth)');
  }

  const userId = signUpData?.user?.id;
  if (!userId) throw new Error("Impossible de récupérer l'ID utilisateur");
  return userId;
}

function CreateUserModal({ onClose, onCreated }: Readonly<Props>) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [faculty, setFaculty] = useState('FMT');
  const [year, setYear] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Générer un mot de passe temporaire aléatoire
      const tempPassword = Math.random().toString(36).slice(-10) + 'Aa!';

      // Nettoyage et validation minimale de l'email (évite espaces invisibles)
      const sanitizedEmail = sanitizeEmail(email);
      console.log('📝 Début création utilisateur:', { sanitizedEmail, firstName, lastName });

      // Validation côté client (format basique)
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Email invalide (format incorrect)');
      }

      // DB constraint `profiles_year_check` seems to only allow J1/J2.
      // Clamp to allowed values to avoid CHECK constraint violations.
      const normalizedYear: number | null = year === 1 || year === 2 ? year : null;

      const userId = await signUpUserPreservingSession({
        email: sanitizedEmail,
        password: tempPassword,
        metadata: {
          first_name: firstName || null,
          last_name: lastName || null,
          faculty: faculty || null,
          year: normalizedYear,
          role: 'student',
        },
      });

      console.log('✅ User créé dans auth:', userId);

      await upsertProfile({
        userId,
        email: sanitizedEmail,
        firstName,
        lastName,
        faculty,
        year: normalizedYear,
      });

      console.log('✅ Profil upsert OK');

      onCreated();
    } catch (err: any) {
      console.error('❌ CreateUser error:', err);
      const msg = err?.message || JSON.stringify(err) || 'Erreur lors de la création';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Ajouter un utilisateur</h2>
        {error && <div className="text-destructive mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="create-user-email" className="block text-sm mb-1">Email</label>
            <input id="create-user-email" className="w-full border rounded-xl px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="create-user-first-name" className="block text-sm mb-1">Prénom</label>
              <input id="create-user-first-name" className="w-full border rounded-xl px-3 py-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="create-user-last-name" className="block text-sm mb-1">Nom</label>
              <input id="create-user-last-name" className="w-full border rounded-xl px-3 py-2" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="create-user-faculty" className="block text-sm mb-1">Faculté</label>
              <select id="create-user-faculty" className="w-full border rounded-xl px-3 py-2" value={faculty} onChange={e => setFaculty(e.target.value)}>
                <option>FMT</option>
                <option>FMS</option>
                <option>FMM</option>
                <option>FMSf</option>
              </select>
            </div>
            <div>
              <label htmlFor="create-user-year" className="block text-sm mb-1">Année</label>
              <select
                id="create-user-year"
                className="w-full border rounded-xl px-3 py-2"
                value={year ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'DFG') setYear(null);
                  else setYear(Number(val));
                }}
              >
                <option value={1}>J1</option>
                <option value={2}>J2</option>
                <option value="DFG">DFG</option>
              </select>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-xl">Annuler</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-xl">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { CreateUserModal };
export default CreateUserModal;