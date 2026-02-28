import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from "recharts";
import { 
  Search, Flame, CheckCircle, Clock, TrendingUp, Target, TrendingDown, 
  ListChecks, BarChart3 as BarChart3Icon, ChevronUp, ChevronDown,
  Award, Zap, Calendar, Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer";

// --- DONNÉES MOCK ---

// Hiérarchie J1/J2 selon le système tunisien
const J1_SPECIALITIES = [
  "Cardiologie-CCV",
  "Gynécologie",
  "Psychiatrie",
  "Chirurgie générale",
  "Gastro-entérologie",
  "Neurologie",
  "ORL/Ophtalmologie",
  "Pneumologie"
];

const J2_SPECIALITIES = [
  "Cancérologie",
  "Néphrologie",
  "Infectiologie",
  "Hématologie",
  "Endocrinologie",
  "Rhumatologie"
];

const mockRadarData: { [key: string]: Array<{ tag: string; mastery: number }> } = {
  // Vue J1 - Moyenne des spécialités
  J1: [
    { tag: "Cardiologie-CCV", mastery: 78 },
    { tag: "Gynécologie", mastery: 65 },
    { tag: "Psychiatrie", mastery: 70 },
    { tag: "Chirurgie", mastery: 68 },
    { tag: "Gastro", mastery: 72 },
    { tag: "Neurologie", mastery: 60 },
    { tag: "ORL/Ophtalmo", mastery: 75 },
    { tag: "Pneumologie", mastery: 66 }
  ],
  // Vue J2 - Moyenne des spécialités
  J2: [
    { tag: "Cancérologie", mastery: 72 },
    { tag: "Néphrologie", mastery: 50 },
    { tag: "Infectiologie", mastery: 85 },
    { tag: "Hématologie", mastery: 60 },
    { tag: "Endocrinologie", mastery: 68 },
    { tag: "Rhumatologie", mastery: 55 }
  ],
  // Spécialités J1
  "Cardiologie-CCV": [
    { tag: "Pharmaco", mastery: 75 },
    { tag: "Anatomie", mastery: 80 },
    { tag: "Physiologie", mastery: 70 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 60 }
  ],
  "Gynécologie": [
    { tag: "Obstétrique", mastery: 70 },
    { tag: "Gynéco", mastery: 65 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Imagerie", mastery: 60 }
  ],
  "Psychiatrie": [
    { tag: "Sémiologie", mastery: 75 },
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Thérapies", mastery: 65 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Urgences", mastery: 68 }
  ],
  "Chirurgie générale": [
    { tag: "Techniques", mastery: 65 },
    { tag: "Anatomie", mastery: 72 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Complications", mastery: 60 },
    { tag: "Urgences", mastery: 70 }
  ],
  "Gastro-entérologie": [
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Anatomie", mastery: 75 },
    { tag: "Physiologie", mastery: 72 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Endoscopie", mastery: 65 }
  ],
  "Neurologie": [
    { tag: "Anatomie", mastery: 58 },
    { tag: "Sémiologie", mastery: 62 },
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Clinique", mastery: 65 },
    { tag: "Imagerie", mastery: 55 }
  ],
  "ORL/Ophtalmologie": [
    { tag: "ORL", mastery: 75 },
    { tag: "Ophtalmologie", mastery: 72 },
    { tag: "Anatomie", mastery: 78 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Pharmaco", mastery: 70 }
  ],
  "Pneumologie": [
    { tag: "Pharmaco", mastery: 65 },
    { tag: "Anatomie", mastery: 70 },
    { tag: "Physiologie", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Imagerie", mastery: 62 }
  ],
  // Spécialités J2
  "Cancérologie": [
    { tag: "CBP", mastery: 80 },
    { tag: "CCR", mastery: 65 },
    { tag: "Prostate", mastery: 75 },
    { tag: "Cavum", mastery: 60 },
    { tag: "Sein", mastery: 85 },
    { tag: "Col", mastery: 70 }
  ],
  "Néphrologie": [
    { tag: "IRA", mastery: 50 },
    { tag: "IRC", mastery: 55 },
    { tag: "Néphrotique", mastery: 45 },
    { tag: "HTA", mastery: 60 },
    { tag: "Dialyse", mastery: 40 }
  ],
  "Infectiologie": [
    { tag: "VIH", mastery: 85 },
    { tag: "Tuberculose", mastery: 80 },
    { tag: "Hépatites", mastery: 75 },
    { tag: "Méningites", mastery: 70 },
    { tag: "Sepsis", mastery: 78 }
  ],
  "Hématologie": [
    { tag: "Anémies", mastery: 60 },
    { tag: "Leucémies", mastery: 55 },
    { tag: "Lymphomes", mastery: 50 },
    { tag: "Hémostase", mastery: 65 },
    { tag: "Transfusion", mastery: 58 }
  ],
  "Endocrinologie": [
    { tag: "Pharmaco", mastery: 65 },
    { tag: "Anatomie", mastery: 55 },
    { tag: "Physiologie", mastery: 75 },
    { tag: "Clinique", mastery: 70 },
    { tag: "Biologie", mastery: 68 }
  ],
  "Rhumatologie": [
    { tag: "Anatomie", mastery: 52 },
    { tag: "Sémiologie", mastery: 55 },
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Clinique", mastery: 58 },
    { tag: "Imagerie", mastery: 50 }
  ]
};

const mockCourseRadarData: { [key: string]: Array<{ tag: string; mastery: number }> } = {
  // Cardiologie-CCV
  "SCA": [
    { tag: "Pharmaco", mastery: 85 },
    { tag: "Anatomie", mastery: 75 },
    { tag: "Physiologie", mastery: 80 },
    { tag: "Clinique", mastery: 90 },
    { tag: "Biologie", mastery: 70 }
  ],
  "HTA": [
    { tag: "Pharmaco", mastery: 90 },
    { tag: "Anatomie", mastery: 50 },
    { tag: "Physiologie", mastery: 80 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 75 }
  ],
  "MVTE": [
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Anatomie", mastery: 85 },
    { tag: "Physiologie", mastery: 75 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Biologie", mastery: 65 }
  ],
  "Endocardite": [
    { tag: "Pharmaco", mastery: 88 },
    { tag: "Anatomie", mastery: 60 },
    { tag: "Physiologie", mastery: 70 },
    { tag: "Clinique", mastery: 92 },
    { tag: "Biologie", mastery: 85 }
  ],
  "ECG de base": [
    { tag: "Pharmaco", mastery: 20 },
    { tag: "Anatomie", mastery: 90 },
    { tag: "Physiologie", mastery: 95 },
    { tag: "Clinique", mastery: 85 },
    { tag: "Biologie", mastery: 10 }
  ],
  "Arythmies": [
    { tag: "Pharmaco", mastery: 72 },
    { tag: "Anatomie", mastery: 68 },
    { tag: "Physiologie", mastery: 78 },
    { tag: "Clinique", mastery: 80 },
    { tag: "Biologie", mastery: 65 }
  ],
  // Gynécologie
  "Grossesse": [
    { tag: "Obstétrique", mastery: 75 },
    { tag: "Pharmaco", mastery: 70 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Complications", mastery: 68 },
    { tag: "Imagerie", mastery: 65 }
  ],
  "Accouchement": [
    { tag: "Techniques", mastery: 70 },
    { tag: "Complications", mastery: 65 },
    { tag: "Urgences", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Analgésie", mastery: 60 }
  ],
  "Fibrome": [
    { tag: "Diagnostic", mastery: 65 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Traitement", mastery: 62 },
    { tag: "Imagerie", mastery: 70 },
    { tag: "Chirurgie", mastery: 58 }
  ],
  // Psychiatrie
  "Dépression": [
    { tag: "Sémiologie", mastery: 75 },
    { tag: "Pharmaco", mastery: 72 },
    { tag: "Psychothérapie", mastery: 68 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Urgences", mastery: 70 }
  ],
  "Schizophrénie": [
    { tag: "Sémiologie", mastery: 70 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 65 },
    { tag: "Évolution", mastery: 62 },
    { tag: "Urgences", mastery: 72 }
  ],
  // Gastro-entérologie
  "Cirrhose": [
    { tag: "Étiologies", mastery: 78 },
    { tag: "Complications", mastery: 75 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Biologie", mastery: 80 },
    { tag: "Traitement", mastery: 70 }
  ],
  "MICI": [
    { tag: "Diagnostic", mastery: 70 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Traitement", mastery: 68 },
    { tag: "Complications", mastery: 65 },
    { tag: "Biologie", mastery: 75 }
  ],
  // Neurologie
  "AVC": [
    { tag: "Clinique", mastery: 65 },
    { tag: "Imagerie", mastery: 60 },
    { tag: "Urgences", mastery: 68 },
    { tag: "Traitement", mastery: 62 },
    { tag: "Séquelles", mastery: 58 }
  ],
  "Épilepsie": [
    { tag: "Sémiologie", mastery: 60 },
    { tag: "Pharmaco", mastery: 58 },
    { tag: "Clinique", mastery: 62 },
    { tag: "Classification", mastery: 55 },
    { tag: "Urgences", mastery: 65 }
  ],
  // Pneumologie
  "Asthme": [
    { tag: "Physiopath", mastery: 70 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 72 },
    { tag: "Urgences", mastery: 65 },
    { tag: "Complications", mastery: 62 }
  ],
  "BPCO": [
    { tag: "Physiopath", mastery: 65 },
    { tag: "Pharmaco", mastery: 68 },
    { tag: "Clinique", mastery: 70 },
    { tag: "Exacerbation", mastery: 62 },
    { tag: "Oxygénothérapie", mastery: 60 }
  ],
  // Endocrinologie
  "Diabète type 1": [
    { tag: "Pharmaco", mastery: 75 },
    { tag: "Physiopath", mastery: 70 },
    { tag: "Clinique", mastery: 68 },
    { tag: "Complications", mastery: 72 },
    { tag: "Biologie", mastery: 85 }
  ],
  "Diabète type 2": [
    { tag: "Pharmaco", mastery: 80 },
    { tag: "Physiopath", mastery: 75 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Complications", mastery: 70 },
    { tag: "Biologie", mastery: 82 }
  ],
  "Thyroïde": [
    { tag: "Pharmaco", mastery: 60 },
    { tag: "Anatomie", mastery: 70 },
    { tag: "Physiologie", mastery: 65 },
    { tag: "Clinique", mastery: 75 },
    { tag: "Biologie", mastery: 90 }
  ],
  // Néphrologie
  "IRA": [
    { tag: "Étiologies", mastery: 55 },
    { tag: "Diagnostic", mastery: 50 },
    { tag: "Biologie", mastery: 60 },
    { tag: "Clinique", mastery: 52 },
    { tag: "Traitement", mastery: 48 }
  ],
  "IRC": [
    { tag: "Étiologies", mastery: 60 },
    { tag: "Stades", mastery: 58 },
    { tag: "Biologie", mastery: 65 },
    { tag: "Complications", mastery: 52 },
    { tag: "Dialyse", mastery: 50 }
  ],
  // Cancérologie
  "CBP": [
    { tag: "Épidémio", mastery: 85 },
    { tag: "Diagnostic", mastery: 80 },
    { tag: "Traitement", mastery: 75 },
    { tag: "Complications", mastery: 82 },
    { tag: "Suivi", mastery: 78 }
  ],
  "CCR": [
    { tag: "Épidémio", mastery: 70 },
    { tag: "Diagnostic", mastery: 65 },
    { tag: "Traitement", mastery: 68 },
    { tag: "Complications", mastery: 60 },
    { tag: "Suivi", mastery: 72 }
  ],
  // Infectiologie
  "VIH": [
    { tag: "Pharmaco", mastery: 90 },
    { tag: "Diagnostic", mastery: 85 },
    { tag: "Clinique", mastery: 88 },
    { tag: "Biologie", mastery: 82 },
    { tag: "Prévention", mastery: 95 }
  ],
  "Tuberculose": [
    { tag: "Diagnostic", mastery: 82 },
    { tag: "Pharmaco", mastery: 80 },
    { tag: "Clinique", mastery: 78 },
    { tag: "Complications", mastery: 75 },
    { tag: "Prévention", mastery: 85 }
  ],
  // Hématologie
  "Anémies": [
    { tag: "Classification", mastery: 65 },
    { tag: "Diagnostic", mastery: 60 },
    { tag: "Biologie", mastery: 70 },
    { tag: "Traitement", mastery: 58 },
    { tag: "Étiologies", mastery: 62 }
  ],
  "Leucémies": [
    { tag: "Classification", mastery: 58 },
    { tag: "Diagnostic", mastery: 55 },
    { tag: "Biologie", mastery: 62 },
    { tag: "Traitement", mastery: 52 },
    { tag: "Complications", mastery: 50 }
  ]
};

interface Course {
  name: string;
  speciality: string;
  mastery: number;
  toRedo: number;
  qcmDone: number;
  lastReviewed: string;
}

const mockCourses: Course[] = [
  // J1 - Cardiologie-CCV
  { name: "ECG de base", speciality: "Cardiologie-CCV", mastery: 95, toRedo: 5, qcmDone: 120, lastReviewed: "2025-01-15" },
  { name: "SCA", speciality: "Cardiologie-CCV", mastery: 82, toRedo: 18, qcmDone: 95, lastReviewed: "2025-01-14" },
  { name: "HTA", speciality: "Cardiologie-CCV", mastery: 88, toRedo: 12, qcmDone: 110, lastReviewed: "2025-01-13" },
  { name: "MVTE", speciality: "Cardiologie-CCV", mastery: 75, toRedo: 25, qcmDone: 85, lastReviewed: "2025-01-12" },
  { name: "Endocardite", speciality: "Cardiologie-CCV", mastery: 80, toRedo: 20, qcmDone: 90, lastReviewed: "2025-01-10" },
  { name: "Arythmies", speciality: "Cardiologie-CCV", mastery: 75, toRedo: 25, qcmDone: 95, lastReviewed: "2025-01-12" },
  // J1 - Gynécologie
  { name: "Grossesse", speciality: "Gynécologie", mastery: 70, toRedo: 30, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "Accouchement", speciality: "Gynécologie", mastery: 68, toRedo: 32, qcmDone: 90, lastReviewed: "2025-01-09" },
  { name: "Fibrome", speciality: "Gynécologie", mastery: 65, toRedo: 35, qcmDone: 75, lastReviewed: "2025-01-08" },
  // J1 - Psychiatrie
  { name: "Dépression", speciality: "Psychiatrie", mastery: 72, toRedo: 28, qcmDone: 80, lastReviewed: "2025-01-11" },
  { name: "Schizophrénie", speciality: "Psychiatrie", mastery: 68, toRedo: 32, qcmDone: 70, lastReviewed: "2025-01-07" },
  // J1 - Gastro-entérologie
  { name: "Cirrhose", speciality: "Gastro-entérologie", mastery: 75, toRedo: 25, qcmDone: 95, lastReviewed: "2025-01-12" },
  { name: "MICI", speciality: "Gastro-entérologie", mastery: 70, toRedo: 30, qcmDone: 80, lastReviewed: "2025-01-09" },
  // J1 - Neurologie
  { name: "AVC", speciality: "Neurologie", mastery: 62, toRedo: 38, qcmDone: 75, lastReviewed: "2025-01-08" },
  { name: "Épilepsie", speciality: "Neurologie", mastery: 58, toRedo: 42, qcmDone: 65, lastReviewed: "2025-01-06" },
  // J1 - Pneumologie
  { name: "Asthme", speciality: "Pneumologie", mastery: 68, toRedo: 32, qcmDone: 85, lastReviewed: "2025-01-10" },
  { name: "BPCO", speciality: "Pneumologie", mastery: 65, toRedo: 35, qcmDone: 78, lastReviewed: "2025-01-08" },
  // J2 - Endocrinologie
  { name: "Diabète type 1", speciality: "Endocrinologie", mastery: 70, toRedo: 30, qcmDone: 110, lastReviewed: "2025-01-08" },
  { name: "Diabète type 2", speciality: "Endocrinologie", mastery: 65, toRedo: 35, qcmDone: 90, lastReviewed: "2025-01-14" },
  { name: "Thyroïde", speciality: "Endocrinologie", mastery: 60, toRedo: 40, qcmDone: 75, lastReviewed: "2025-01-05" },
  // J2 - Cancérologie
  { name: "CBP", speciality: "Cancérologie", mastery: 82, toRedo: 18, qcmDone: 130, lastReviewed: "2025-01-13" },
  { name: "CCR", speciality: "Cancérologie", mastery: 78, toRedo: 22, qcmDone: 95, lastReviewed: "2025-01-11" },
  // J2 - Néphrologie
  { name: "IRA", speciality: "Néphrologie", mastery: 50, toRedo: 50, qcmDone: 65, lastReviewed: "2025-01-03" },
  { name: "IRC", speciality: "Néphrologie", mastery: 55, toRedo: 45, qcmDone: 70, lastReviewed: "2025-01-06" },
  // J2 - Infectiologie
  { name: "VIH", speciality: "Infectiologie", mastery: 85, toRedo: 15, qcmDone: 140, lastReviewed: "2025-01-14" },
  { name: "Tuberculose", speciality: "Infectiologie", mastery: 80, toRedo: 20, qcmDone: 125, lastReviewed: "2025-01-12" },
  // J2 - Hématologie
  { name: "Anémies", speciality: "Hématologie", mastery: 60, toRedo: 40, qcmDone: 88, lastReviewed: "2025-01-07" },
  { name: "Leucémies", speciality: "Hématologie", mastery: 55, toRedo: 45, qcmDone: 75, lastReviewed: "2025-01-05" }
];

const weeklyProgressData = [
  { day: "Lun", qcm: 20, time: 2 },
  { day: "Mar", qcm: 25, time: 2.5 },
  { day: "Mer", qcm: 30, time: 3 },
  { day: "Jeu", qcm: 22, time: 2.2 },
  { day: "Ven", qcm: 28, time: 2.8 },
  { day: "Sam", qcm: 35, time: 3.5 },
  { day: "Dim", qcm: 0, time: 0 }
];

const successPercentage = 65;
const qcmStats = {
  completed: 1850,
  totalQcm: 2500,
  seriesCompleted: 120,
  totalSeries: 200,
  bestObjective: "Cardiologie-CCV",
  bestObjectivePercent: 98,
  worstObjective: "Néphrologie",
  worstObjectivePercent: 55
};

// --- Fonctions utilitaires ---

const hexToRgb = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
  const hex = Math.round(x).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');

const getPercentageColor = (percentage: number, theme: string) => {
  if (percentage < 50) {
    return theme === "dark" ? "#ef4444" : "#dc2626";
  } else if (percentage < 75) {
    return theme === "dark" ? "#f97316" : "#ff8f00";
  } else {
    return theme === "dark" ? "#22c55e" : "#059669";
  }
};

const getGradientColor = (index: number, total = 10, theme = "light") => {
  const colors = theme === "dark" 
    ? [
        hexToRgb("#ef4444"),
        hexToRgb("#f97316"),
        hexToRgb("#22c55e")
      ]
    : [
        hexToRgb("#dc2626"),
        hexToRgb("#ff8f00"),
        hexToRgb("#059669")
      ];
  
  const fraction = index / (total - 1);
  
  let r, g, b;
  if (fraction < 0.5) {
    const localFraction = fraction * 2;
    r = Math.round(colors[0].r + (colors[1].r - colors[0].r) * localFraction);
    g = Math.round(colors[0].g + (colors[1].g - colors[0].g) * localFraction);
    b = Math.round(colors[0].b + (colors[1].b - colors[0].b) * localFraction);
  } else {
    const localFraction = (fraction - 0.5) * 2;
    r = Math.round(colors[1].r + (colors[2].r - colors[1].r) * localFraction);
    g = Math.round(colors[1].g + (colors[2].g - colors[1].g) * localFraction);
    b = Math.round(colors[1].b + (colors[2].b - colors[1].b) * localFraction);
  }
  return rgbToHex(r, g, b);
};

const getGradientBgColor = (index: number, total = 10, theme = "light", opacity = 0.15) => {
  const colorHex = getGradientColor(index, total, theme);
  const { r, g, b } = hexToRgb(colorHex);
  
  const bgColor = theme === "dark" ? 30 : 255;
  const r_bg = Math.round(r * opacity + bgColor * (1 - opacity));
  const g_bg = Math.round(g * opacity + bgColor * (1 - opacity));
  const b_bg = Math.round(b * opacity + bgColor * (1 - opacity));
  return rgbToHex(r_bg, g_bg, b_bg);
};

// --- Composant Counter animé ---
const AnimatedCounter = ({ value, suffix = "" }: { value: number | string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;

  useEffect(() => {
    let start = 0;
    const end = numValue;
    if (start === end) return;

    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numValue]);

  return <>{count}{suffix}</>;
};

// --- Composant StatCard amélioré ---
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: { value: number; isUp: boolean };
  color: string;
  onClick?: () => void;
}

const StatCard = ({ icon, label, value, trend, color, onClick }: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.005, y: -1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`relative overflow-hidden cursor-pointer border-2 hover:border-primary/50 transition-all duration-300 ${onClick ? 'hover:shadow-lg' : ''}`}
        onClick={onClick}
      >
        {/* Animated gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/8 to-transparent opacity-80"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        {/* Pulse effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0"
          whileHover={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="p-3 rounded-xl bg-background/80 shadow-sm"
              whileHover={{ rotate: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
            {trend && (
              <Badge variant={trend.isUp ? "default" : "destructive"} className="gap-1">
                {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {trend.value}%
              </Badge>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <h3 className={`${color} text-3xl tracking-tight`}>
              {value.includes('%') ? (
                <>
                  <AnimatedCounter value={parseInt(value)} />%
                </>
              ) : value.match(/^\d+$/) ? (
                <AnimatedCounter value={parseInt(value)} />
              ) : (
                value
              )}
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Composant CircularProgress ---
const CircularProgress = ({ 
  value, 
  size = 120, 
  strokeWidth = 12,
  label,
  theme = "light" 
}: { 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  label?: string;
  theme?: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getPercentageColor(value, theme);

  return (
    <motion.div 
      className="relative inline-flex items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme === "dark" ? "#334155" : "#e2e8f0"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span 
          className="text-3xl"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedCounter value={value} suffix="%" />
        </motion.span>
        {label && (
          <span className="text-xs text-muted-foreground mt-1">{label}</span>
        )}
      </div>
    </motion.div>
  );
};

// --- Composant Donut Chart amélioré ---
const EnhancedDonutChart = ({ data, theme }: { data: any[]; theme: string }) => {
  const COLORS = theme === "dark" 
    ? ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#fb923c", "#f472b6"]
    : ["#4f7cff", "#059669", "#ff8f00", "#dc2626", "#8b5cf6", "#f97316", "#ec4899"];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percentage }) => `${percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: any, name: any, props: any) => [
            `${value} QCM (${props.payload.percentage}%)`,
            name
          ]}
          contentStyle={{ 
            backgroundColor: theme === "dark" ? "#334155" : "#ffffff",
            borderColor: theme === "dark" ? "#475569" : "#e2e8f0",
            borderRadius: "8px"
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// --- Composant Principal ---
interface StatsPageProps {
  theme?: string;
}

export default function StatsPage({ theme = "light" }: StatsPageProps) {
  const [query, setQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filterType, setFilterType] = useState("toRedo");
  const [selectedSpec, setSelectedSpec] = useState("J1");
  const [selectedCourseForRadar, setSelectedCourseForRadar] = useState("all");
  const [comparisonMetric, setComparisonMetric] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [timePeriod, setTimePeriod] = useState("7j");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCourses = mockCourses.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) =>
    filterType === "toRedo" ? b.toRedo - a.toRedo : b.mastery - a.mastery
  );

  const isSpec = ["J1", "J2"].includes(selectedSpec);
  
  // Déterminer les données du radar
  let radarData = [];
  let radarTitle = "";
  
  if (isSpec) {
    // Si c'est J1 ou J2, montrer la vue générale
    radarData = mockRadarData[selectedSpec] || [];
    radarTitle = `Maîtrise - ${selectedSpec}`;
  } else {
    // Si c'est une spécialité
    if (selectedCourseForRadar === "all") {
      // Vue générale de la spécialité
      radarData = mockRadarData[selectedSpec] || [];
      radarTitle = `Maîtrise - ${selectedSpec}`;
    } else {
      // Vue d'un cours spécifique
      radarData = mockCourseRadarData[selectedCourseForRadar] || [];
      radarTitle = `${selectedSpec} - ${selectedCourseForRadar}`;
    }
  }

  // Cours disponibles pour le sous-filtre (seulement si c'est une spécialité, pas J1/J2)
  const coursesForSubFilter = !isSpec ? mockCourses.filter(c => c.speciality === selectedSpec) : [];

  const totalQcm = mockCourses.reduce((sum, c) => sum + c.qcmDone, 0);
  const weeklyQcm = 160;
  const progressPercent = Math.round((totalQcm / 5000) * 100);

  const radialData = [
    { name: "Réussite", value: successPercentage, fill: getPercentageColor(successPercentage, theme) }
  ];

  // Données pour le donut chart - Répartition des QCM de la semaine par spécialité
  const weeklyQcmBySpeciality = [
    { name: "Cardiologie-CCV", value: 45 },
    { name: "Gastro-entérologie", value: 28 },
    { name: "Infectiologie", value: 22 },
    { name: "Pneumologie", value: 18 },
    { name: "Endocrinologie", value: 20 },
    { name: "Néphrologie", value: 15 },
    { name: "Gynécologie", value: 12 }
  ];
  
  const totalWeeklyQcm = weeklyQcmBySpeciality.reduce((sum, item) => sum + item.value, 0);
  const donutData = weeklyQcmBySpeciality.map(item => ({
    ...item,
    percentage: Math.round((item.value / totalWeeklyQcm) * 100)
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const ComparisonDialog = () => {
    if (!comparisonMetric) return null;

    const metricInfo = {
      time: { label: "Temps hebdomadaire", value: "14h 30min", average: "12h 15min", percentile: 72 },
      weeklyQcm: { label: "QCM hebdomadaires", value: weeklyQcm.toString(), average: "145", percentile: 68 },
      totalQcm: { label: "Total QCM", value: totalQcm.toString(), average: "1425", percentile: 75 }
    };

    const info = metricInfo[comparisonMetric as keyof typeof metricInfo];
    if (!info) return null;

    const DialogWrapper = isMobile ? Drawer : Dialog;
    const ContentWrapper = isMobile ? DrawerContent : DialogContent;
    const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
    const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;
    const DescriptionWrapper = isMobile ? DrawerDescription : DialogDescription;

    return (
      <DialogWrapper open={!!comparisonMetric} onOpenChange={() => setComparisonMetric(null)}>
        <ContentWrapper>
          <HeaderWrapper>
            <TitleWrapper>Comparaison avec vos pairs</TitleWrapper>
            <DescriptionWrapper>{info.label}</DescriptionWrapper>
          </HeaderWrapper>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Votre score</p>
                  <p className="text-2xl text-primary">{info.value}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">Moyenne</p>
                  <p className="text-2xl text-muted-foreground">{info.average}</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Votre percentile</span>
                <span className="text-primary">{info.percentile}%</span>
              </div>
              <Progress value={info.percentile} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Vous êtes dans le top {100 - info.percentile}% des étudiants
              </p>
            </div>
          </div>
        </ContentWrapper>
      </DialogWrapper>
    );
  };

  const CourseDetailDialog = () => {
    if (!selectedCourse) return null;

    const DialogWrapper = isMobile ? Drawer : Dialog;
    const ContentWrapper = isMobile ? DrawerContent : DialogContent;
    const HeaderWrapper = isMobile ? DrawerHeader : DialogHeader;
    const TitleWrapper = isMobile ? DrawerTitle : DialogTitle;
    const DescriptionWrapper = isMobile ? DrawerDescription : DialogDescription;

    return (
      <DialogWrapper open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <ContentWrapper>
          <HeaderWrapper>
            <TitleWrapper>{selectedCourse.name}</TitleWrapper>
            <DescriptionWrapper>{selectedCourse.speciality}</DescriptionWrapper>
          </HeaderWrapper>
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <CircularProgress 
                  value={selectedCourse.mastery} 
                  size={100} 
                  strokeWidth={8}
                  theme={theme}
                />
                <p className="text-sm text-muted-foreground mt-2">Maîtrise</p>
              </div>
              <div className="text-center">
                <CircularProgress 
                  value={100 - selectedCourse.toRedo} 
                  size={100} 
                  strokeWidth={8}
                  theme={theme}
                />
                <p className="text-sm text-muted-foreground mt-2">Progression</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">QCM effectués</span>
                <span className="text-sm">{selectedCourse.qcmDone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">À refaire</span>
                <span className="text-sm">{selectedCourse.toRedo}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dernière révision</span>
                <span className="text-sm">{selectedCourse.lastReviewed}</span>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </DialogWrapper>
    );
  };

  return (
    <motion.div 
      className="space-y-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* En-tête */}
      <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-foreground flex items-center gap-2">
            <Activity className="text-primary" />
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground">Suivez vos performances et identifiez vos axes d'amélioration</p>
        </div>
        <motion.div 
          className="relative w-full md:w-64"
          whileHover={{ scale: 1.005 }}
        >
          <Search size={18} className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Rechercher un cours..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </motion.div>
      </motion.div>

      {/* KPIs */}
      <motion.section 
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={<Clock className="text-primary" size={24} />}
          label="Temps hebdomadaire"
          value="14h 30min"
          trend={{ value: 12, isUp: true }}
          color="text-primary"
          onClick={() => setComparisonMetric("time")}
        />
        <StatCard
          icon={<CheckCircle className="text-purple-500" size={24} />}
          label="QCM cette semaine"
          value={weeklyQcm.toString()}
          trend={{ value: 8, isUp: true }}
          color="text-purple-500"
          onClick={() => setComparisonMetric("weeklyQcm")}
        />
        <StatCard
          icon={<BarChart3Icon className="text-accent" size={24} />}
          label="Total QCM faits"
          value={totalQcm.toString()}
          color="text-accent"
          onClick={() => setComparisonMetric("totalQcm")}
        />
        <StatCard
          icon={<TrendingUp className="text-success" size={24} />}
          label="Progression"
          value={`${progressPercent}%`}
          trend={{ value: 5, isUp: true }}
          color="text-success"
        />
      </motion.section>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Évolution hebdomadaire */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden relative border-2 hover:border-primary/50 transition-all duration-300">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 pointer-events-none z-0"
              whileHover={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="text-primary" size={20} />
                Activité hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyProgressData}>
                  <defs>
                    <linearGradient id="colorQcm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={theme === "dark" ? "#60a5fa" : "#4f7cff"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === "dark" ? "#334155" : "#ffffff",
                      borderColor: theme === "dark" ? "#475569" : "#e2e8f0",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="qcm" 
                    stroke={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorQcm)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Répartition des QCM par spécialité (semaine) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.003, y: -1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="overflow-hidden relative border-2 hover:border-success/50 transition-all duration-300">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-success/12 via-accent/6 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-success/0 to-accent/0 pointer-events-none z-0"
              whileHover={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.12) 0%, rgba(255, 143, 0, 0.03) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(5, 150, 105, 0.08) 0%, rgba(255, 143, 0, 0) 70%)',
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CardHeader className="relative">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-success" size={20} />
                  QCM répartis par spécialité
                </CardTitle>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7j">7 jours</SelectItem>
                    <SelectItem value="15j">15 jours</SelectItem>
                    <SelectItem value="30j">30 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-6 relative">
              <EnhancedDonutChart data={donutData} theme={theme} />

            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top 10 Cours */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.003, y: -1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card className="relative border-2 hover:border-accent/50 transition-all duration-300 overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-accent/12 via-primary/6 to-transparent opacity-70 pointer-events-none z-0"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          {/* Pulse effect on hover */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-accent/0 to-primary/0 pointer-events-none z-0"
            whileHover={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.08) 0%, rgba(79, 124, 255, 0) 70%)',
                'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.12) 0%, rgba(79, 124, 255, 0.03) 70%)',
                'radial-gradient(circle at 50% 50%, rgba(255, 143, 0, 0.08) 0%, rgba(79, 124, 255, 0) 70%)',
              ]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Flame className="text-accent" size={20} />
                Top 10 des cours
              </CardTitle>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toRedo">À refaire</SelectItem>
                  <SelectItem value="mastery">Mieux maîtrisés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm text-muted-foreground border-b pb-2 mb-2">
              <span>Cours</span>
              <span>{filterType === "toRedo" ? "À refaire" : "Maîtrise"}</span>
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {sortedCourses.slice(0, 10).map((course, index) => {
                  const isToRedo = filterType === "toRedo";
                  const bgColor = isToRedo ? getGradientBgColor(index, 10, theme, 0.2) : "transparent";
                  const textColor = isToRedo ? getGradientColor(index, 10, theme) : (theme === "dark" ? "#22c55e" : "#059669");
                  const value = isToRedo ? course.toRedo : course.mastery;

                  return (
                    <motion.div
                      key={course.name}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="py-3 px-4 flex justify-between items-center transition-all duration-200 cursor-pointer hover:shadow-md rounded-lg"
                      style={{ backgroundColor: bgColor }}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05, type: "spring" }}
                        >
                          {isToRedo ? (
                            <Flame size={18} style={{ color: textColor }} className="flex-shrink-0" />
                          ) : (
                            <Award size={18} style={{ color: textColor }} className="flex-shrink-0" />
                          )}
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="text-foreground truncate">{course.name}</div>
                          <div className="text-sm text-muted-foreground">{course.speciality}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Progress value={value} className="w-20 h-2" />
                        <span className="text-base min-w-[3rem] text-right" style={{ color: textColor }}>
                          <AnimatedCounter value={value} />%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Statistiques QCM et Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stats QCM - Layout horizontal */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ scale: 1.005, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className="relative border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/12 via-success/6 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            
            {/* Pulse effect on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/0 to-success/0 pointer-events-none z-0"
              whileHover={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.15) 0%, rgba(5, 150, 105, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.20) 0%, rgba(5, 150, 105, 0.05) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(79, 124, 255, 0.15) 0%, rgba(5, 150, 105, 0) 70%)',
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="text-primary" size={20} />
                Statistiques QCM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Précision globale - À gauche */}
                <div className="flex-shrink-0">
                  <CircularProgress 
                    value={successPercentage} 
                    size={180} 
                    strokeWidth={16}
                    label="Précision globale"
                    theme={theme}
                  />
                </div>
                
                {/* 4 KPI - À droite en grille 2x2 */}
                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/30 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="text-primary" size={16} />
                            <span className="text-sm text-muted-foreground">Complétés</span>
                          </div>
                          <p className="text-xl text-primary">
                            <AnimatedCounter value={qcmStats.completed} /> / {qcmStats.totalQcm}
                          </p>
                          <Progress value={(qcmStats.completed / qcmStats.totalQcm) * 100} className="mt-2 h-1" />
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/30 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <ListChecks className="text-success" size={16} />
                            <span className="text-sm text-muted-foreground">Séries</span>
                          </div>
                          <p className="text-xl text-success">
                            <AnimatedCounter value={qcmStats.seriesCompleted} /> / {qcmStats.totalSeries}
                          </p>
                          <Progress value={(qcmStats.seriesCompleted / qcmStats.totalSeries) * 100} className="mt-2 h-1" />
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-success/10 to-transparent border-success/30 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="text-success" size={16} />
                            <span className="text-sm text-muted-foreground">Meilleur</span>
                          </div>
                          <p className="text-sm truncate">{qcmStats.bestObjective}</p>
                          <p className="text-xl text-success">
                            <AnimatedCounter value={qcmStats.bestObjectivePercent} />%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Card className="bg-gradient-to-br from-destructive/10 to-transparent border-destructive/30 relative overflow-hidden">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <CardContent className="p-4 relative">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="text-destructive" size={16} />
                            <span className="text-sm text-muted-foreground">À améliorer</span>
                          </div>
                          <p className="text-sm truncate">{qcmStats.worstObjective}</p>
                          <p className="text-xl text-destructive">
                            <AnimatedCounter value={qcmStats.worstObjectivePercent} />%
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Radar */}
        <motion.div 
          variants={itemVariants}
        >
          <Card className="relative border-2 hover:border-accent/50 transition-all duration-300 overflow-hidden">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-accent/10 via-primary/5 to-transparent opacity-70 pointer-events-none z-0"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 200%' }}
            />
            

            <CardHeader className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="text-accent" size={20} />
                  {radarTitle}
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Select value={selectedSpec} onValueChange={(value) => {
                    setSelectedSpec(value);
                    setSelectedCourseForRadar("all");
                  }}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="J1">J1</SelectItem>
                      <SelectItem value="J2">J2</SelectItem>
                      <SelectItem value="Cardiologie-CCV">Cardiologie-CCV</SelectItem>
                      <SelectItem value="Gynécologie">Gynécologie</SelectItem>
                      <SelectItem value="Psychiatrie">Psychiatrie</SelectItem>
                      <SelectItem value="Chirurgie générale">Chirurgie générale</SelectItem>
                      <SelectItem value="Gastro-entérologie">Gastro-entérologie</SelectItem>
                      <SelectItem value="Neurologie">Neurologie</SelectItem>
                      <SelectItem value="ORL/Ophtalmologie">ORL/Ophtalmologie</SelectItem>
                      <SelectItem value="Pneumologie">Pneumologie</SelectItem>
                      <SelectItem value="Cancérologie">Cancérologie</SelectItem>
                      <SelectItem value="Néphrologie">Néphrologie</SelectItem>
                      <SelectItem value="Infectiologie">Infectiologie</SelectItem>
                      <SelectItem value="Hématologie">Hématologie</SelectItem>
                      <SelectItem value="Endocrinologie">Endocrinologie</SelectItem>
                      <SelectItem value="Rhumatologie">Rhumatologie</SelectItem>
                    </SelectContent>
                  </Select>
                  {!isSpec && coursesForSubFilter.length > 0 && (
                    <Select value={selectedCourseForRadar} onValueChange={setSelectedCourseForRadar}>
                      <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Cours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Vue globale</SelectItem>
                        {coursesForSubFilter.map((c) => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke={theme === "dark" ? "#475569" : "#d1d5db"} />
                    <PolarAngleAxis 
                      dataKey="tag" 
                      tick={{ fill: theme === "dark" ? "#f8fafc" : "#1e293b", fontSize: 12 }} 
                    />
                    <PolarRadiusAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Radar 
                      name="Maîtrise" 
                      dataKey="mastery" 
                      stroke={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                      fill={theme === "dark" ? "#60a5fa" : "#4f7cff"}
                      fillOpacity={0.6} 
                    />
                    <Tooltip formatter={(v) => `${v}%`} contentStyle={{ 
                      backgroundColor: theme === "dark" ? "#334155" : "#ffffff",
                      borderColor: theme === "dark" ? "#475569" : "#e2e8f0",
                      borderRadius: "8px"
                    }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <ComparisonDialog />
      <CourseDetailDialog />
    </motion.div>
  );
}
