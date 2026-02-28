import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

function CreateUserModal({ onClose, onCreated }: Props) {
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

      console.log('📝 Début création utilisateur:', { email, firstName, lastName });

      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: tempPassword,
      });

      if (signUpError) {
        console.error('❌ signUpError:', signUpError);
        throw signUpError;
      }

      const userId = signUpData?.user?.id;
      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur");
      }

      console.log('✅ User créé dans auth:', userId);

      // 2. Attendre un peu que l'authentification soit complète
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Créer le profil directement avec INSERT
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: firstName || null,
          last_name: lastName || null,
          faculty: faculty || null,
          year: year !== null ? year : null,
          role: 'student',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preferences: {},
        });

      // Si erreur "duplicate key", faire un UPDATE à la place
      if (insertError && insertError.code === '23505') {
        console.log('⚠️ Profil existe déjà (duplicate key), mise à jour...');
        
        const { error: updateError, data: updateData } = await supabase
          .from('profiles')
          .update({
            first_name: firstName || null,
            last_name: lastName || null,
            faculty: faculty || null,
            year: year !== null ? year : null,
            role: 'student',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single();

        if (updateError) {
          console.error('❌ updateError:', updateError);
          throw updateError;
        }
        
        console.log('✅ Profil mis à jour:', updateData);
      } else if (insertError) {
        console.error('❌ insertError:', insertError);
        throw insertError;
      } else {
        console.log('✅ Profil créé avec succès');
      }

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
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded-xl px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <input className="w-full border rounded-xl px-3 py-2" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input className="w-full border rounded-xl px-3 py-2" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm mb-1">Faculté</label>
              <select className="w-full border rounded-xl px-3 py-2" value={faculty} onChange={e => setFaculty(e.target.value)}>
                <option>FMT</option>
                <option>FMS</option>
                <option>FMM</option>
                <option>FMSf</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Année</label>
              <select
                className="w-full border rounded-xl px-3 py-2"
                value={year !== null ? year : ''}
                onChange={e => {
                  const val = e.target.value;
                  if (val === 'DFG') setYear(null);
                  else setYear(Number(val));
                }}
              >
                <option value={1}>J1</option>
                <option value={2}>J2</option>
                <option value={3}>J3</option>
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