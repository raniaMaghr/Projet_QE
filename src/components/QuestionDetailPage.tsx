import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QCMEntry, SeriesMetadata } from "../types";
import { ArrowLeft, Save, ChevronLeft, ChevronRight, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../supabaseClient";
import {
  getQuestionsBySeriesId,
  updateQuestion,
  getAllSubCourses,
  createSubCourse,
  getSeriesById,
  convertSupabaseQuestionToQCMEntry,
  convertSupabaseSeriesToMetadata,
} from "../supabaseService";

const TAGS = ["Clinique", "Anatomie", "Biologie", "Physiologie", "Épidémiologie"];

export default function QuestionDetailPage() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QCMEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [metadata, setMetadata] = useState<SeriesMetadata | null>(null);
  const [subCourses, setSubCourses] = useState<string[]>([]);
  const [newSubCourse, setNewSubCourse] = useState("");
  const [showAddSubCourse, setShowAddSubCourse] = useState(false);
  const [addingSubCourse, setAddingSubCourse] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questionId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: qData, error: qError } = await supabase
          .from("qcm_questions")
          .select("*")
          .eq("id", questionId)
          .single();

        if (qError || !qData) {
          toast.error("Question introuvable");
          setLoading(false);
          return;
        }

        const foundSeriesId: string = qData.series_id;

        const series = await getSeriesById(foundSeriesId);
        if (series) setMetadata(convertSupabaseSeriesToMetadata(series));

        const supabaseQuestions = await getQuestionsBySeriesId(foundSeriesId);
        const converted = supabaseQuestions.map(convertSupabaseQuestionToQCMEntry);

        const clickedQ = converted.find(q => q.id === questionId);
        if (!clickedQ) {
          toast.error("Question introuvable dans la série");
          setLoading(false);
          return;
        }

        if (clickedQ.clinicalCaseId) {
          const related = converted.filter(q => q.clinicalCaseId === clickedQ.clinicalCaseId);
          setQuestions(related);
          setCurrentIndex(related.findIndex(q => q.id === questionId));
        } else {
          setQuestions([clickedQ]);
          setCurrentIndex(0);
        }

        const scs = await getAllSubCourses();
        setSubCourses(scs);

      } catch (err) {
        console.error("Erreur chargement:", err);
        toast.error("Impossible de charger la question");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chargement...
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  if (!currentQ || !metadata) {
    return (
      <div className="min-h-screen p-6" style={{background: "linear-gradient(to bottom right, #eef2ff, #fff, #f5f3ff)"}}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Question introuvable</p>
          <button onClick={() => navigate(-1)} className="px-4 py-2 text-white rounded-lg" style={{background: "#4f46e5"}}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  const isClinicalCase = questions.length > 1;
  const optionLetters = currentQ.options.map((_: string, i: number) => String.fromCharCode(65 + i));

  const updateCurrentQuestion = (updates: Partial<QCMEntry>) => {
    setQuestions(prev =>
      prev.map(q => q.id === currentQ.id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q)
    );
    setHasUnsavedChanges(true);
  };

  const toggleCorrectAnswer = (letter: string) => {
    const current = currentQ.correctAnswers || [];
    updateCurrentQuestion({
      correctAnswers: current.includes(letter)
        ? current.filter(a => a !== letter)
        : [...current, letter],
    });
  };

  const toggleTag = (tag: string) => {
    const current = currentQ.tags || [];
    updateCurrentQuestion({
      tags: current.includes(tag)
        ? current.filter(t => t !== tag)
        : [...current, tag],
    });
  };

  // ✅ FIX sauvegarde : séquentiel pour éviter AbortError
  const handleSave = async () => {
    try {
      for (const q of questions) {
        await updateQuestion(q.id, q);
      }
      toast.success("✅ Modifications sauvegardées");
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  // ✅ Ajout sous-cours avec état dédié
  const handleAddSubCourse = async () => {
    const trimmed = newSubCourse.trim();
    if (!trimmed) {
      toast.warning("Veuillez saisir un nom");
      return;
    }
    if (subCourses.includes(trimmed)) {
      toast.warning("Ce sous-cours existe déjà");
      return;
    }
    setAddingSubCourse(true);
    try {
      await createSubCourse(trimmed);
      setSubCourses(prev => [...prev, trimmed]);
      setNewSubCourse("");
      setShowAddSubCourse(false);
      toast.success(`"${trimmed}" ajouté`);
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setAddingSubCourse(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...currentQ.options];
    newOptions[index] = value;
    updateCurrentQuestion({ options: newOptions });
  };

  const addOption = () => {
    if (currentQ.options.length < 10) {
      updateCurrentQuestion({ options: [...currentQ.options, ""] });
    } else {
      toast.warning("Maximum 10 options atteint");
    }
  };

  const removeOption = (index: number) => {
    if (currentQ.options.length <= 2) {
      toast.warning("Minimum 2 options requises");
      return;
    }
    const newOptions = currentQ.options.filter((_: string, i: number) => i !== index);
    const letter = String.fromCharCode(65 + index);
    updateCurrentQuestion({
      options: newOptions,
      correctAnswers: currentQ.correctAnswers.filter(a => a !== letter),
    });
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (hasUnsavedChanges && !window.confirm("Modifications non sauvegardées. Continuer ?")) return;
    const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    setCurrentIndex(newIndex);
    setHasUnsavedChanges(false);
    navigate(`/question/${questions[newIndex].id}`);
  };

  const handleBack = () => {
    if (hasUnsavedChanges && !window.confirm("Modifications non sauvegardées. Quitter sans sauvegarder ?")) return;
    navigate(-1);
  };

  return (
<div className="min-h-screen p-6" style={{background: "linear-gradient(to bottom right, #eef2ff, #fff, #f5f3ff)"}}>      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à la grille
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-full ${isClinicalCase ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                  {isClinicalCase ? `Cas clinique (${questions.length} questions)` : "QCM simple"}
                </div>
                <div className="text-gray-600 text-sm">
                  {metadata.objective} • {metadata.faculty} • {metadata.year}
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors" style={{background: "#16a34a"}}>
                <Save className="w-4 h-4" />
                Sauvegarder
              </button>
            </div>

            {hasUnsavedChanges && (
              <div className="mt-2 text-orange-600 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-500 rounded-full inline-block" />
                Modifications non sauvegardées
              </div>
            )}
          </div>
        </div>

        {/* Navigation cas clinique */}
        {isClinicalCase && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <button onClick={() => navigateQuestion("prev")} disabled={currentIndex === 0} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm mr-2">Question {currentIndex + 1} / {questions.length}</span>
                {questions.map((_: QCMEntry, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (hasUnsavedChanges && !window.confirm("Modifications non sauvegardées. Continuer ?")) return;
                      setCurrentIndex(idx);
                      setHasUnsavedChanges(false);
                      navigate(`/question/${questions[idx].id}`);
                    }}
                    className={`w-10 h-10 rounded-lg transition-all ${idx === currentIndex ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button onClick={() => navigateQuestion("next")} disabled={currentIndex === questions.length - 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Question */}
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-medium">Question</label>
            <textarea
              value={currentQ.question}
              onChange={(e) => updateCurrentQuestion({ question: e.target.value })}
              rows={3}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow"
              placeholder="Saisir la question..."
            />
            <div className="mt-1 text-xs text-gray-500">{currentQ.question.length} caractères</div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-gray-700 font-medium">Propositions</label>
              <span className="text-xs text-gray-500">{currentQ.options.length} option{currentQ.options.length > 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-3">
              {currentQ.options.map((option: string, i: number) => {
                const letter = String.fromCharCode(65 + i);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full flex-shrink-0 font-medium">{letter}</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(i, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
                      placeholder={`Option ${letter}`}
                    />
                    {currentQ.options.length > 2 && (
                      <button onClick={() => removeOption(i)} className="p-2 rounded-lg transition-colors" style={{color: "#dc2626"}}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {currentQ.options.length < 10 && (
              <button onClick={addOption} className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors" style={{color: "#4f46e5"}}>
                <Plus className="w-4 h-4" />
                Ajouter une option
              </button>
            )}
          </div>

          {/* Correct Answers */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700 font-medium">Réponse(s) correcte(s)</label>
            <div className="flex flex-wrap gap-2">
              {optionLetters.map((letter: string, i: number) => (
                <button
                  key={letter}
                  onClick={() => toggleCorrectAnswer(letter)}
                  disabled={!currentQ.options[i]?.trim()}
                  className={`w-12 h-12 rounded-full border-2 transition-all font-medium
                  ${currentQ.correctAnswers.includes(letter) ? "text-white border-transparent shadow-lg scale-110" : "bg-white text-gray-700 border-gray-300"}                    ${!currentQ.options[i]?.trim() ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                  title={currentQ.options[i] || "Option vide"}
                  style={{background: currentQ.correctAnswers.includes(letter) ? "#16a34a" : ""}}
                >
                  {letter}
                </button>
              ))}
            </div>
            {currentQ.correctAnswers.length > 0 ? (
              <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-lg">
                ✓ Réponse(s) sélectionnée(s) : <strong>{currentQ.correctAnswers.join(", ")}</strong>
              </div>
            ) : (
              <div className="mt-3 p-3 bg-orange-50 text-orange-700 rounded-lg text-sm">
                ⚠️ Aucune réponse correcte sélectionnée
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700 font-medium">Tags thématiques</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border transition-all ${currentQ.tags?.includes(tag) ? "text-white border-transparent shadow-md" : "bg-white text-gray-700 border-gray-300"}`}
                  style={{background: currentQ.tags?.includes(tag) ? "#4f46e5" : ""}}                >
                  {tag}
                </button>
              ))}
            </div>
            {currentQ.tags && currentQ.tags.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                {currentQ.tags.length} tag{currentQ.tags.length > 1 ? "s" : ""} sélectionné{currentQ.tags.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* ✅ Sous-cours — section entièrement réécrite */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700 font-medium">Sous-cours</label>

            {/* Ligne : sélecteur + bouton "Nouveau" */}
            <div className="flex gap-2">
              <select
                value={currentQ.subCourse || ""}
                onChange={(e) => updateCurrentQuestion({ subCourse: e.target.value || null })}
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
              >
                <option value="">-- Choisir un sous-cours --</option>
                {subCourses.map((sc: string) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>

              {/* ✅ Bouton toujours visible pour ouvrir le formulaire d'ajout */}
              <button
                onClick={() => { setShowAddSubCourse(v => !v); setNewSubCourse(""); }}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors flex-shrink-0"
                style={{
                  background: showAddSubCourse ? "#f3f4f6" : "#4f46e5",
                  borderColor: showAddSubCourse ? "#d1d5db" : "#4f46e5",
                  color: showAddSubCourse ? "#4b5563" : "white"
                }}
              >
                {showAddSubCourse ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showAddSubCourse ? "Annuler" : "Nouveau"}
              </button>
            </div>

            {/* ✅ Formulaire d'ajout — visible seulement si showAddSubCourse */}
            {showAddSubCourse && (
              <div className="mt-3 p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                <p className="text-sm text-indigo-700 font-medium mb-2">Nouveau sous-cours</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubCourse}
                    onChange={(e) => setNewSubCourse(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubCourse(); } }}
                    placeholder="Ex: Cardiologie, Neurologie..."
                    autoFocus
                    className="flex-1 p-3 border border-indigo-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  />
                  <button
                    onClick={handleAddSubCourse}
                    disabled={addingSubCourse}
                    className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{background: "#4f46e5"}}                  >
                    {addingSubCourse ? "..." : "Ajouter"}
                  </button>
                </div>
              </div>
            )}

            {subCourses.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {subCourses.length} sous-cours disponible{subCourses.length > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Justification */}
          <div className="mb-6">
            <label className="block mb-3 text-gray-700 font-medium">Justification / Explication</label>
            <textarea
              value={currentQ.aiJustification || ""}
              onChange={(e) => updateCurrentQuestion({ aiJustification: e.target.value })}
              rows={4}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-shadow"
              placeholder="Ajouter une justification ou explication pour cette question..."
            />
            <div className="mt-1 text-xs text-gray-500">{(currentQ.aiJustification || "").length} caractères</div>
          </div>

          {/* Stats */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Statut de la question</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-600">Options :</span><span className="ml-2 font-medium">{currentQ.options.length}</span></div>
              <div><span className="text-gray-600">Réponses :</span><span className={`ml-2 font-medium ${currentQ.correctAnswers.length > 0 ? "text-green-600" : "text-orange-600"}`}>{currentQ.correctAnswers.length}</span></div>
              <div><span className="text-gray-600">Tags :</span><span className="ml-2 font-medium">{currentQ.tags?.length || 0}</span></div>
              <div><span className="text-gray-600">Sous-cours :</span><span className="ml-2 font-medium">{currentQ.subCourse ? "✓" : "—"}</span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}