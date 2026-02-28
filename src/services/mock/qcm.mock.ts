/**
 * Données mock pour le système QCM
 */

import { CasClinique, Question, Serie } from '../../types';

export const mockCasCliniques: CasClinique[] = [
  {
    id: 'cas_001',
    numero: 1,
    contenu: `Un patient de 65 ans, diabétique depuis 15 ans, consulte aux urgences pour une douleur thoracique rétrosternale constrictive apparue il y a 2 heures, irradiant vers le bras gauche et la mâchoire. Le patient est dyspnéique et présente une sueur froide. L'ECG montre un sus-décalage du segment ST en DII, DIII et aVF.`,
    specialite: 'Cardiologie',
    niveau: 'J1',
    faculte: 'FMT',
    annee: '2024',
    difficulte: 'Moyen',
    tags: ['SCA', 'ECG', 'Urgence'],
    questions: [1, 2, 3],
  },
  {
    id: 'cas_002',
    numero: 2,
    contenu: `Une patiente de 42 ans consulte pour une dyspnée d'effort d'installation progressive depuis 3 mois. Elle rapporte également une toux sèche persistante. L'auscultation pulmonaire retrouve des râles crépitants bilatéraux prédominant aux bases. La radiographie thoracique montre un syndrome interstitiel bilatéral.`,
    specialite: 'Pneumologie',
    niveau: 'J1',
    faculte: 'FMT',
    annee: '2024',
    difficulte: 'Difficile',
    tags: ['Interstitiel', 'Dyspnée'],
    questions: [4, 5, 6],
  },
];

export const mockQuestions: Question[] = [
  {
    id: 1,
    casCliniqueId: 'cas_001',
    numero: 1,
    enonce: 'Quel est le diagnostic le plus probable ?',
    options: [
      { letter: 'A', text: 'Infarctus du myocarde antérieur' },
      { letter: 'B', text: 'Infarctus du myocarde inférieur' },
      { letter: 'C', text: 'Péricardite aiguë' },
      { letter: 'D', text: 'Dissection aortique' },
      { letter: 'E', text: 'Embolie pulmonaire' },
    ],
    typeReponse: 'unique',
    reponseCorrecte: ['B'],
    explication: `Le sus-décalage du segment ST en DII, DIII et aVF est caractéristique d'un infarctus du myocarde inférieur (territoire de l'artère coronaire droite). Les symptômes cliniques (douleur thoracique constrictive avec irradiation, dyspnée, sueurs) sont typiques d'un syndrome coronarien aigu.`,
    specialite: 'Cardiologie',
    tags: ['SCA', 'ECG', 'Diagnostic'],
    difficulte: 'Moyen',
  },
  {
    id: 2,
    casCliniqueId: 'cas_001',
    numero: 2,
    enonce: 'Quelles sont les mesures thérapeutiques immédiates à prendre ? (Plusieurs réponses possibles)',
    options: [
      { letter: 'A', text: 'Aspirine 250-500 mg per os' },
      { letter: 'B', text: 'Clopidogrel 300-600 mg dose de charge' },
      { letter: 'C', text: 'Morphine IV si douleur intense' },
      { letter: 'D', text: 'Thrombolyse IV immédiate' },
      { letter: 'E', text: 'Coronarographie en urgence' },
    ],
    typeReponse: 'multiple',
    reponseCorrecte: ['A', 'B', 'C', 'E'],
    explication: `Dans un SCA ST+, le traitement initial comprend: antiagrégants plaquettaires (Aspirine + Clopidogrel), antalgiques (Morphine si besoin), et revascularisation en urgence. La coronarographie avec angioplastie primaire est préférable à la thrombolyse si accessible dans les délais (< 120 min).`,
    specialite: 'Cardiologie',
    tags: ['SCA', 'Traitement', 'Urgence'],
    difficulte: 'Moyen',
  },
  {
    id: 3,
    casCliniqueId: 'cas_001',
    numero: 3,
    enonce: 'Quelle artère coronaire est le plus probablement occluse ?',
    options: [
      { letter: 'A', text: 'Artère coronaire droite' },
      { letter: 'B', text: 'Artère interventriculaire antérieure' },
      { letter: 'C', text: 'Artère circonflexe' },
      { letter: 'D', text: 'Artère marginale' },
      { letter: 'E', text: 'Tronc commun coronaire gauche' },
    ],
    typeReponse: 'unique',
    reponseCorrecte: ['A'],
    explication: `Le territoire inférieur (DII, DIII, aVF) est principalement vascularisé par l'artère coronaire droite dans 80-90% des cas. L'artère circonflexe peut être responsable dans 10-20% des cas (territoire inférieur gauche).`,
    specialite: 'Cardiologie',
    tags: ['Anatomie', 'ECG'],
    difficulte: 'Facile',
  },
  {
    id: 4,
    casCliniqueId: 'cas_002',
    numero: 1,
    enonce: 'Quelle est l\'hypothèse diagnostique principale ?',
    options: [
      { letter: 'A', text: 'Pneumonie bactérienne' },
      { letter: 'B', text: 'Fibrose pulmonaire idiopathique' },
      { letter: 'C', text: 'Insuffisance cardiaque gauche' },
      { letter: 'D', text: 'Sarcoïdose pulmonaire' },
      { letter: 'E', text: 'Tuberculose pulmonaire' },
    ],
    typeReponse: 'unique',
    reponseCorrecte: ['B'],
    explication: `La triade clinique (dyspnée progressive, toux sèche, râles crépitants bilatéraux) associée à un syndrome interstitiel bilatéral à la radiographie est très évocatrice d'une fibrose pulmonaire idiopathique, surtout chez une patiente d'âge moyen.`,
    specialite: 'Pneumologie',
    tags: ['Interstitiel', 'Diagnostic'],
    difficulte: 'Difficile',
  },
  {
    id: 5,
    casCliniqueId: 'cas_002',
    numero: 2,
    enonce: 'Quels examens complémentaires sont nécessaires pour confirmer le diagnostic ? (Plusieurs réponses)',
    options: [
      { letter: 'A', text: 'TDM thoracique haute résolution' },
      { letter: 'B', text: 'Épreuves fonctionnelles respiratoires' },
      { letter: 'C', text: 'Fibroscopie bronchique avec lavage broncho-alvéolaire' },
      { letter: 'D', text: 'Échographie cardiaque' },
      { letter: 'E', text: 'Sérologie VIH' },
    ],
    typeReponse: 'multiple',
    reponseCorrecte: ['A', 'B', 'C'],
    explication: `Le bilan d'une pneumopathie interstitielle diffuse comprend: TDM thoracique HR (aspect en rayon de miel), EFR (syndrome restrictif), et fibroscopie avec LBA (éliminer autres causes). L'échographie cardiaque peut être utile mais n'est pas spécifique au diagnostic.`,
    specialite: 'Pneumologie',
    tags: ['Examens', 'Interstitiel'],
    difficulte: 'Moyen',
  },
  {
    id: 6,
    casCliniqueId: 'cas_002',
    numero: 3,
    enonce: 'Quel pattern auscultatoire est le plus caractéristique de cette pathologie ?',
    options: [
      { letter: 'A', text: 'Râles sibilants expiratoires' },
      { letter: 'B', text: 'Râles crépitants "velcro" inspiratoires' },
      { letter: 'C', text: 'Ronchus diffus' },
      { letter: 'D', text: 'Frottement pleural' },
      { letter: 'E', text: 'Silence auscultatoire' },
    ],
    typeReponse: 'unique',
    reponseCorrecte: ['B'],
    explication: `Les râles crépitants "velcro" (bruit de déchirement similaire au velcro) perçus en fin d'inspiration aux bases sont pathognomoniques de la fibrose pulmonaire. Ils persistent même après toux contrairement aux crépitants de l'insuffisance cardiaque.`,
    specialite: 'Pneumologie',
    tags: ['Sémiologie', 'Auscultation'],
    difficulte: 'Moyen',
  },
];

export const mockSeries: Serie[] = [
  {
    id: 'serie_001',
    titre: '2024 - FMT - Cardiologie',
    description: 'Série complète de cardiologie pour J1 - Faculté de Tunis',
    specialite: 'Cardiologie',
    niveau: 'J1',
    faculte: 'FMT',
    annee: '2024',
    casCliniqueIds: ['cas_001'],
    nbQuestions: 3,
    dureeEstimee: 15,
    difficulte: 'Moyen',
  },
  {
    id: 'serie_002',
    titre: '2024 - FMT - Pneumologie',
    description: 'Série pneumologie - Pathologies interstitielles',
    specialite: 'Pneumologie',
    niveau: 'J1',
    faculte: 'FMT',
    annee: '2024',
    casCliniqueIds: ['cas_002'],
    nbQuestions: 3,
    dureeEstimee: 20,
    difficulte: 'Difficile',
  },
  {
    id: 'serie_003',
    titre: '2024 - Toutes spécialités',
    description: 'Mix de cas cliniques variés pour révision générale',
    niveau: 'J1',
    faculte: 'FMT',
    annee: '2024',
    casCliniqueIds: ['cas_001', 'cas_002'],
    nbQuestions: 6,
    dureeEstimee: 35,
    difficulte: 'Moyen',
  },
];

// Fonction helper pour récupérer les questions d'un cas clinique
export function getQuestionsByCasId(casId: string): Question[] {
  return mockQuestions.filter(q => q.casCliniqueId === casId);
}

// Fonction helper pour récupérer un cas clinique avec ses questions
export function getCasCliniqueWithQuestions(casId: string) {
  const cas = mockCasCliniques.find(c => c.id === casId);
  if (!cas) return null;
  
  return {
    ...cas,
    questionsData: getQuestionsByCasId(casId),
  };
}
