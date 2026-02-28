// src/types/supabase-mapping.ts
import { SupabaseProfile } from '@/lib/supabase'
import { User } from './user.types'
import { Faculte, AnneeEtude } from './qcm.types'

// Plus besoin de mapping puisque les valeurs sont identiques !
const FACULTY_MAP: Record<string, Faculte> = {
  'FMT': 'FMT',
  'FMS': 'FMS',
  'FMM': 'FMM',
  'FMSf': 'FMSf',
}

// Mapping entre l'année numérique et vos types
const YEAR_MAP: Record<number, AnneeEtude> = {
  1: 'J1',
  2: 'J2',
}

// Mapping inverse - identique maintenant
export const FACULTY_TO_SUPABASE: Record<Faculte, Faculte> = {
  'FMT': 'FMT',
  'FMS': 'FMS',
  'FMM': 'FMM',
  'FMSf': 'FMSf',
}

export const YEAR_TO_NUMBER: Record<AnneeEtude, number> = {
  'J1': 1,
  'J2': 2,
}

// Convertir un profil Supabase en User de votre app
export function mapSupabaseProfileToUser(
  profile: SupabaseProfile,
  email: string
): User {
  return {
    id: profile.id,
    email: email,
    fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    faculte: profile.faculty || 'FMT',
    anneeEtude: profile.year ? YEAR_MAP[profile.year] : 'J1',
    createdAt: new Date(profile.created_at),
    lastLogin: new Date(),
    pointsTotal: profile.preferences?.pointsTotal || 0,
    streakDays: profile.preferences?.streakDays || 0,
    lastActivityDate: new Date(),
    theme: profile.preferences?.theme || 'light',
    notificationsEnabled: profile.preferences?.notificationsEnabled ?? true,
    role: profile.role || "student",
  }
}

// Fonction pour extraire les préférences à sauvegarder
export function getUserPreferences(user: User) {
  return {
    pointsTotal: user.pointsTotal,
    streakDays: user.streakDays,
    theme: user.theme,
    notificationsEnabled: user.notificationsEnabled,
  }
}