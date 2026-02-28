/**
 * Données mock pour les utilisateurs
 */

import { User, UserProgress, UserStats } from '../../types';

export const mockUser: User = {
  id: 'user_123',
  email: 'etudiant@fmt.tn',
  fullName: 'Ahmed Ben Ali',
  faculte: 'FMT',
  anneeEtude: 'J1',
  createdAt: new Date('2024-09-01'),
  lastLogin: new Date(),
  pointsTotal: 2450,
  streakDays: 7,
  lastActivityDate: new Date(),
  theme: 'light',
  notificationsEnabled: true,
};

export const mockUserProgress: UserProgress[] = [
  {
    userId: 'user_123',
    specialite: 'Cardiologie',
    questionsAnswered: 145,
    correctAnswers: 123,
    avgTimePerQuestion: 72,
    lastPracticed: new Date(),
    masteryLevel: 0.85,
  },
  {
    userId: 'user_123',
    specialite: 'Pneumologie',
    questionsAnswered: 98,
    correctAnswers: 76,
    avgTimePerQuestion: 68,
    lastPracticed: new Date(Date.now() - 86400000),
    masteryLevel: 0.78,
  },
  {
    userId: 'user_123',
    specialite: 'Néphrologie',
    questionsAnswered: 67,
    correctAnswers: 54,
    avgTimePerQuestion: 75,
    lastPracticed: new Date(Date.now() - 172800000),
    masteryLevel: 0.81,
  },
  {
    userId: 'user_123',
    specialite: 'Gastro-entérologie',
    questionsAnswered: 89,
    correctAnswers: 71,
    avgTimePerQuestion: 70,
    lastPracticed: new Date(Date.now() - 259200000),
    masteryLevel: 0.80,
  },
  {
    userId: 'user_123',
    specialite: 'Neurologie',
    questionsAnswered: 54,
    correctAnswers: 38,
    avgTimePerQuestion: 82,
    lastPracticed: new Date(Date.now() - 432000000),
    masteryLevel: 0.70,
  },
];

export const mockUserStats: UserStats = {
  totalQuestionsAnswered: 453,
  totalCorrectAnswers: 362,
  overallAccuracy: 79.9,
  totalTimeSpent: 542, // minutes
  streakDays: 7,
  rank: 42,
  progressBySpeciality: mockUserProgress.reduce((acc, prog) => {
    acc[prog.specialite] = prog;
    return acc;
  }, {} as Record<string, UserProgress>),
};
