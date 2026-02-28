// Type définition pour une entrée QCM
export interface QCMEntry {
  id: string;
  question: string;
  options: string[];
  correctAnswers: string[];
  aiJustification: string;
  type: "QCM" | "Cas clinique";
  tags?: string[];
  subCourse: string | null;
  clinicalCaseId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeriesMetadata {
  objective: string;
  faculty: string;
  year: string;
}
