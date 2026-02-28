/**
 * Contexte d'authentification avec Supabase - VERSION PRODUCTION FINALE
 * Combine la robustesse contre le blocage au refresh et l'intégralité du code d'origine.
 */

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { User } from '../types';
import { Faculte, AnneeEtude } from '../types/qcm.types';
import { supabase } from '../lib/supabase';
import {
  mapSupabaseProfileToUser,
  getUserPreferences,
  FACULTY_TO_SUPABASE,
  YEAR_TO_NUMBER,
} from '../types/supabase-mapping';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Suppression globale des AbortError Supabase
// ─────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event?.reason?.name === 'AbortError' ||
      event?.reason?.message?.includes('aborted') ||
      event?.reason?.message?.includes('AbortError')
    ) {
      event.preventDefault();
    }
  });
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  faculty: Faculte;
  year: AnneeEtude;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// ✅ Détection AbortError robuste
// ─────────────────────────────────────────────
const isAbortError = (error: any): boolean => {
  if (!error) return false;
  const msg = error?.message ?? '';
  const details = error?.details ?? '';
  const hint = error?.hint ?? '';
  return (
    error?.name === 'AbortError' ||
    msg.includes('AbortError') ||
    msg.includes('aborted') ||
    details.includes('AbortError') ||
    hint.includes('aborted') ||
    hint.includes('cancellation')
  );
};

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const mountedRef = useRef(true);

  // ─── Chargement du profil avec retry ────────

  const loadProfile = async (supabaseUser: SupabaseUser, retries = 3): Promise<User | null> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`👤 loadProfile() tentative ${attempt}/${retries} — id:`, supabaseUser.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', supabaseUser.id)
          .single();

        if (error) {
          if (isAbortError(error)) {
            if (attempt < retries) {
              await new Promise(r => setTimeout(r, 300 * attempt));
              continue;
            }
            return null;
          }

          if (error.code === 'PGRST116') {
            console.log('👤 loadProfile() — profil inexistant, création...');
            await supabase.from('profiles').insert({ id: supabaseUser.id });
            await new Promise(r => setTimeout(r, 300));
            continue;
          }

          console.error('👤 loadProfile() — erreur:', error.code, error.message);
          return null;
        }

        if (profile) {
          const userData = mapSupabaseProfileToUser(profile, supabaseUser.email!);
          console.log('✅ loadProfile() — succès');
          if (mountedRef.current) setUser(userData);
          return userData;
        }

      } catch (err: any) {
        console.error('👤 loadProfile() — exception:', err?.message);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 300 * attempt));
        }
      }
    }
    return null;
  };

  // ─── Init auth ───────────────────────────────

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      try {
        // 1. Récupération immédiate de la session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        if (initialSession) {
          setSession(initialSession);
          // On lance le chargement du profil mais on ne bloque pas forcément le spinner ici
          // si on veut une réactivité maximale. Cependant, pour la cohérence des données,
          // on attend le premier essai de loadProfile.
          await loadProfile(initialSession.user);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('🔑 onAuthStateChange —', event);
        if (!mountedRef.current) return;

        setSession(currentSession);

        if (currentSession?.user) {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await loadProfile(currentSession.user);
          }
        } else {
          setUser(null);
        }

        if (mountedRef.current) setLoading(false);
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─── Connexion ───────────────────────────────

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) await loadProfile(data.user);
    } finally {
      setLoading(false);
    }
  };

  // ─── Inscription ─────────────────────────────

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (authError) throw authError;
      if (!authData?.user) throw new Error('Erreur lors de la création du compte');

      let profileExists = false;
      let attempts = 0;
      while (!profileExists && attempts < 10) {
        attempts++;
        const { data: checkProfile } = await supabase
          .from('profiles').select('id').eq('id', authData.user.id).maybeSingle();
        if (checkProfile) profileExists = true;
        else await new Promise(r => setTimeout(r, 500));
      }

      if (!profileExists) {
        const { error: insertError } = await supabase
          .from('profiles').insert({ id: authData.user.id });
        if (insertError && insertError.code !== '23505') throw insertError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          faculty: FACULTY_TO_SUPABASE[data.faculty],
          year: YEAR_TO_NUMBER[data.year],
        })
        .eq('id', authData.user.id);
      if (profileError) throw profileError;

      await loadProfile(authData.user);
    } catch (error: any) {
      throw new Error(error.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // ─── Déconnexion ─────────────────────────────

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ─── Mise à jour utilisateur ──────────────────

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    const previousUser = user;
    try {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      const preferences = getUserPreferences(updatedUser);
      const { error } = await supabase
        .from('profiles').update({ preferences }).eq('id', user.id);
      if (error) setUser(previousUser);
    } catch {
      setUser(previousUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      // On est authentifié si on a une session active, même si le profil charge encore
      isAuthenticated: !!session || !!user,
      loading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}
