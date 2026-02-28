// Cette version est l'ancienne interface monolithique
// Conservée pour référence - peut être supprimée si la nouvelle version est stable

import React, { useState, useEffect } from "react";
import { Upload, X, Plus, Trash2, Edit2, Copy, Download, FileJson, FileSpreadsheet } from "lucide-react";

// Type définition pour une entrée QCM
interface QCMEntry {
  id: string;
  question: string;
  options: string[];
  correctAnswers: string[];
  aiJustification: string;
  type: "QCM" | "Cas clinique";
  tags: string[];
  subCourse: string | null;
  clinicalCaseId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Fonction pour générer un ID unique
function generateUniqueId(prefix: string = "qcm"): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${random}`;
}

export default function OldQcmBuilderApp() {
  // ... (tout le code de l'ancienne version reste ici)
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1>Ancienne version - en cours de migration</h1>
      </div>
    </div>
  );
}
