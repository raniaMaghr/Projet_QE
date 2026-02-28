/**
 * Types pour le système QCM (Questions à Choix Multiples)
 */

export type AnneeEtude = 'J1' | 'J2';
export type Faculte = 'FMT' | 'FMS' | 'FMM' | 'FMSf';
export type AnneeExamen = '2022' | '2023' | '2024' | '2025';
export type Difficulte = 'Facile' | 'Moyen' | 'Difficile';
export type TypeReponse = 'unique' | 'multiple';

export interface Option {
  letter: string;
  text: string;
}

export interface Question {
  id: number;
  casCliniqueId: string;
  numero: number;
  enonce: string;
  options: Option[];
  typeReponse: TypeReponse;
  reponseCorrecte: string[];
  explication: string;
  specialite: string;
  tags: string[];
  difficulte?: Difficulte;
}

export interface CasClinique {
  id: string;
  numero: number;
  contenu: string;
  specialite: string;
  niveau: AnneeEtude;
  faculte: Faculte;
  annee: AnneeExamen;
  difficulte: Difficulte;
  tags: string[];
  questions: number[]; // IDs des questions liées
}

export interface Serie {
  id: string;
  titre: string;
  description?: string;
  specialite?: string;
  niveau?: AnneeEtude;
  faculte?: Faculte;
  annee?: AnneeExamen;
  casCliniqueIds: string[];
  nbQuestions: number;
  dureeEstimee: number; // en minutes
  difficulte?: Difficulte;
}

export interface QCMFilters {
  niveau?: AnneeEtude;
  faculte?: Faculte;
  annee?: AnneeExamen;
  specialite?: string;
  difficulte?: Difficulte;
  tags?: string[];
  status?: string[];
  questionTypes?: string[];
}

export interface UserAnswer {
  questionId: number;
  selected: string[];
  isValidated: boolean;
  isCorrect?: boolean;
  timeSpent: number; // en secondes
  isMarked?: boolean;
}

export interface SessionQCM {
  id: string;
  type: 'entrainement' | 'examen' | 'serie';
  serieId?: string;
  startTime: Date;
  endTime?: Date;
  totalQuestions: number;
  questionsAnswered: number;
  correctAnswers: number;
  scorePercent?: number;
  timeSpent: number; // en secondes
  completed: boolean;
}

export interface Highlight {
  id: string;
  questionId: number;
  highlightedText: string;
  containerType: 'cas' | 'question' | 'option';
  containerId: string;
  color: string;
}

export interface QCMEntry {
  id: string;
  question: string;
  options: string[];
  correctAnswers: string[];
  aiJustification: string;
  type: 'QCM' | 'Cas clinique';
  tags?: string[];
  subCourse?: string | null;
  clinicalCaseId?: string;
  updatedAt?: string;
  createdAt: string;
}

export interface SeriesMetadata {
  objective: string;
  faculty: string;
  year: string;
}