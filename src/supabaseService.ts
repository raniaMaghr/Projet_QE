import { supabase } from './lib/supabase';
import { QCMEntry, SeriesMetadata } from './types/qcm.types';

export interface SupabaseSeries {
  id: string;
  user_id: string;
  objective: string;
  faculty: string;
  year: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseQuestion {
  id: string;
  series_id: string;
  question: string;
  options: string[];
  correct_answers: string[];
  ai_justification: string;
  type: 'QCM' | 'Cas clinique';
  tags: string[];
  sub_course: string | null;
  clinical_case_id: string | null;
  created_at: string;
  updated_at: string;
}

// ===== AUTHENTIFICATION =====

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// ===== SÉRIES DE QCM =====

export async function createSeries(metadata: SeriesMetadata): Promise<string> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('qcm_series')
    .insert({
      user_id: user.id,
      objective: metadata.objective,
      faculty: metadata.faculty,
      year: metadata.year,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

export async function getAllSeries(): Promise<SupabaseSeries[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('qcm_series')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSeriesById(seriesId: string): Promise<SupabaseSeries | null> {
  const { data, error } = await supabase
    .from('qcm_series')
    .select('*')
    .eq('id', seriesId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateSeries(seriesId: string, metadata: Partial<SeriesMetadata>) {
  const { error } = await supabase
    .from('qcm_series')
    .update(metadata)
    .eq('id', seriesId);

  if (error) throw error;
}

export async function deleteSeries(seriesId: string) {
  const { error } = await supabase
    .from('qcm_series')
    .delete()
    .eq('id', seriesId);

  if (error) throw error;
}

// ===== QUESTIONS =====

export async function createQuestions(seriesId: string, questions: QCMEntry[]) {
  const questionsToInsert = questions.map(q => ({
    series_id: seriesId,
    question: q.question,
    options: q.options,
    correct_answers: q.correctAnswers,
    ai_justification: q.aiJustification,
    type: q.type,
    tags: q.tags,
    sub_course: q.subCourse,
    clinical_case_id: q.clinicalCaseId,
  }));

  const { data, error } = await supabase
    .from('qcm_questions')
    .insert(questionsToInsert)
    .select();

  if (error) throw error;
  return data;
}

export async function getQuestionsBySeriesId(seriesId: string): Promise<SupabaseQuestion[]> {
  const { data, error } = await supabase
    .from('qcm_questions')
    .select('*')
    .eq('series_id', seriesId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateQuestion(questionId: string, updates: Partial<QCMEntry>) {
  const updateData: any = {};
  
  if (updates.question !== undefined) updateData.question = updates.question;
  if (updates.options !== undefined) updateData.options = updates.options;
  if (updates.correctAnswers !== undefined) updateData.correct_answers = updates.correctAnswers;
  if (updates.aiJustification !== undefined) updateData.ai_justification = updates.aiJustification;
  if (updates.type !== undefined) updateData.type = updates.type;
  if (updates.tags !== undefined) updateData.tags = updates.tags;
  if (updates.subCourse !== undefined) updateData.sub_course = updates.subCourse;
  if (updates.clinicalCaseId !== undefined) updateData.clinical_case_id = updates.clinicalCaseId;

  const { error } = await supabase
    .from('qcm_questions')
    .update(updateData)
    .eq('id', questionId);

  if (error) throw error;
}

export async function deleteQuestion(questionId: string) {
  const { error } = await supabase
    .from('qcm_questions')
    .delete()
    .eq('id', questionId);

  if (error) throw error;
}

// ===== SOUS-COURS =====

export async function createSubCourse(name: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('sub_courses')
    .insert({
      user_id: user.id,
      name,
    })
    .select()
    .single();

  if (error) {
    // Si le sous-cours existe déjà, on ignore l'erreur
    if (error.code === '23505') { // Unique constraint violation
      return null;
    }
    throw error;
  }
  return data;
}

export async function getAllSubCourses(): Promise<string[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('sub_courses')
    .select('name')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) throw error;
  return data?.map(sc => sc.name) || [];
}

// ===== UTILITAIRES DE CONVERSION =====

export function convertSupabaseQuestionToQCMEntry(sq: SupabaseQuestion): QCMEntry {
  return {
    id: sq.id,
    question: sq.question,
    options: sq.options,
    correctAnswers: sq.correct_answers,
    aiJustification: sq.ai_justification,
    type: sq.type,
    tags: sq.tags,
    subCourse: sq.sub_course,
    clinicalCaseId: sq.clinical_case_id,
    createdAt: sq.created_at,
    updatedAt: sq.updated_at,
  };
}

export function convertSupabaseSeriesToMetadata(series: SupabaseSeries): SeriesMetadata {
  return {
    objective: series.objective,
    faculty: series.faculty,
    year: series.year,
  };
}

// ===== SYNCHRONISATION =====

export async function syncLocalDataToSupabase(
  metadata: SeriesMetadata,
  questions: QCMEntry[]
): Promise<string> {
  try {
    const seriesId = await createSeries(metadata);
    await createQuestions(seriesId, questions);
    return seriesId;
  } catch (error) {
    console.error('Erreur lors de la synchronisation:', error);
    throw error;
  }
}

export async function loadSeriesFromSupabase(seriesId: string): Promise<{
  metadata: SeriesMetadata;
  questions: QCMEntry[];
}> {
  try {
    // 1. Charger la série
    const series = await getSeriesById(seriesId);
    if (!series) throw new Error('Series not found');
    
    // 2. Charger les questions
    const supabaseQuestions = await getQuestionsBySeriesId(seriesId);
    
    return {
      metadata: convertSupabaseSeriesToMetadata(series),
      questions: supabaseQuestions.map(convertSupabaseQuestionToQCMEntry),
    };
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    throw error;
  }
}