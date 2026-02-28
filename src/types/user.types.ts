/**
 * Types pour les utilisateurs et leur progression
 */

import { AnneeEtude, Faculte } from './qcm.types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  faculte: Faculte;
  anneeEtude: AnneeEtude;
  createdAt: Date;
  lastLogin?: Date;
  
  // Gamification
  pointsTotal: number;
  streakDays: number;
  lastActivityDate?: Date;
  
  // Préférences
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  role: string;
}

export interface UserProgress {
  userId: string;
  specialite: string;
  questionsAnswered: number;
  correctAnswers: number;
  avgTimePerQuestion: number; // en secondes
  lastPracticed?: Date;
  masteryLevel: number; // 0-1
}

export interface UserActivity {
  id: string;
  userId: string;
  type: 'qcm' | 'course' | 'review' | 'exam';
  date: Date;
  duration: number; // en minutes
  pointsEarned: number;
  description: string;
}

export interface UserStats {
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number; // pourcentage
  totalTimeSpent: number; // en minutes
  streakDays: number;
  rank?: number;
  progressBySpeciality: Record<string, UserProgress>;
}
