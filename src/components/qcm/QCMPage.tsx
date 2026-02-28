import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock, Flag, CheckCircle, XCircle, AlertCircle, ChevronLeft,
  ChevronRight, Menu, X, BookOpen, Activity, Target, Eye, Highlighter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

// --- TYPES ---
interface Option {
  letter: string;
  text: string;
}

interface Question {
  id: number;
  casCliniqueId: string;
  numero: number;
  enonce: string;
  options: Option[];
  typeReponse: "unique" | "multiple";
  reponseCorrecte: string[];
  explication: string;
  specialite: string;
  tags: string[];
}

interface CasClinique {
  id: string;
  numero: number;
  contenu: string;
  specialite: string;
  questions: number[];
}

interface UserAnswer {
  questionId: number;
  selected: string[];
  isMarked: boolean;
  isValidated: boolean;
  isCorrect?: boolean;
  timeSpent: number;
}

interface Highlight {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  containerType: "cas" | "question" | "option";
  containerId: string;
}

// --- DONNÉES MOCK ---
const mockCasClinique: CasClinique = {
  id: "cas_6",
  numero: 6,
  contenu: `Nouveau-né de sexe masculin, né à terme, issu d'une grossesse non suivie, d'une mère G2P1A1, de groupe sanguin O Rh positif. À la naissance, le nouveau-né est pâle, présente une ascite, un œdème généralisé et une hépatosplénomégalie.

Le bilan réalisé sur sang de cordon montre :
• NFS : leucocytes 18 000/mm³, hémoglobine 6 g/dl, plaquettes 86 000/mm³, réticulocytes : 450 000/mm³
• Groupe sanguin : O Rh négatif
• Test de Coombs direct : +++
• Bilirubine totale : 80 µmol/L
• Bilirubine conjuguée : 3 µmol/L`,
  specialite: "Pédiatrie",
  questions: [76, 77],
};

const mockQuestions: Question[] = [
  {
    id: 76,
    casCliniqueId: "cas_6",
    numero: 76,
    enonce: "Devant ce tableau, vous suspectez ?",
    options: [
      { letter: "A", text: "Une Incompatibilité materno-fœtale érythrocytaire : Rhesus" },
      { letter: "B", text: "Une Incompatibilité materno-fœtale érythrocytaire : sous-groupe" },
      { letter: "C", text: "Une Incompatibilité materno-fœtale érythrocytaire : ABO" },
      { letter: "D", text: "La maladie de Minkowski Chauffard" },
      { letter: "E", text: "Une infection néonatale bactérienne précoce" },
    ],
    typeReponse: "unique",
    reponseCorrecte: ["A"],
    explication: `**Réponse : A - Incompatibilité materno-fœtale érythrocytaire Rhesus**

**Explication :** 
Le tableau clinique est typique d'une maladie hémolytique du nouveau-né sévère (anasarque fœto-placentaire) :
- Mère O Rh+ / Nouveau-né O Rh- avec Coombs direct positif
- Anémie sévère (Hb 6 g/dl) avec hyperbilirubinémie
- Réticulocytose importante (450 000/mm³) témoignant d'une hémolyse
- Hépatosplénomégalie et anasarque

L'incompatibilité ABO (réponse C) est moins probable car :
- Elle donne rarement des formes aussi sévères
- Le groupe du nouveau-né est O comme la mère

La maladie de Minkowski Chauffard (D) ne donne pas d'anasarque fœtale.`,
    specialite: "Pédiatrie",
    tags: ["Hématologie", "Néonatologie", "Immunologie"],
  },
  {
    id: 77,
    casCliniqueId: "cas_6",
    numero: 77,
    enonce: "Quelle est votre conduite à tenir ?",
    options: [
      { letter: "A", text: "Exsanguino-transfusion" },
      { letter: "B", text: "Perfusions d'albumine" },
      { letter: "C", text: "Transfusions de culots globulaires phénotypés" },
      { letter: "D", text: "Photothérapie ordinaire" },
      { letter: "E", text: "Immunoglobulines anti-D chez la mère" },
    ],
    typeReponse: "multiple",
    reponseCorrecte: ["A", "B", "C"],
    explication: `**Réponses : A, B, C**

**Explication :**
Devant une maladie hémolytique sévère avec anasarque :

**A - Exsanguino-transfusion : VRAI**
- Indiquée en urgence devant l'anémie sévère (Hb < 7 g/dl)
- Permet de corriger l'anémie et l'hyperbilirubinémie
- Retire les anticorps maternels circulants

**B - Perfusions d'albumine : VRAI**
- Nécessaire pour traiter l'anasarque et l'hypoalbuminémie
- Expansion volémique initiale

**C - Transfusions de culots globulaires phénotypés : VRAI**
- Peuvent être nécessaires avant ou après l'exsanguino-transfusion
- Utilisation de sang O Rh négatif, phénotypé

**D - Photothérapie ordinaire : FAUX**
- Insuffisante dans les formes sévères
- La photothérapie intensive sera utilisée en complément

**E - Immunoglobulines anti-D chez la mère : FAUX**
- Trop tard, le nouveau-né est déjà né
- La prévention aurait dû être faite pendant la grossesse`,
    specialite: "Pédiatrie",
    tags: ["Urgence", "Néonatologie", "Thérapeutique"],
  },
];

// --- COMPOSANT PRINCIPAL ---
interface QCMPageProps {
  theme?: string;
  mode?: "entrainement" | "examen" | "serie";
  onExit?: () => void;
}

export default function QCMPage({ theme = "light", mode = "entrainement", onExit }: QCMPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, UserAnswer>>(new Map());
  const [showNavigation, setShowNavigation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [highlightMode, setHighlightMode] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const currentCas = mockCasClinique;
  const currentAnswer = userAnswers.get(currentQuestion.id);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (letter: string) => {
    const answer = userAnswers.get(currentQuestion.id) || {
      questionId: currentQuestion.id,
      selected: [],
      isMarked: false,
      isValidated: false,
      timeSpent: 0,
    };

    let newSelected: string[];
    if (currentQuestion.typeReponse === "unique") {
      newSelected = [letter];
    } else {
      newSelected = answer.selected.includes(letter)
        ? answer.selected.filter((l) => l !== letter)
        : [...answer.selected, letter];
    }

    setUserAnswers(
      new Map(userAnswers.set(currentQuestion.id, { ...answer, selected: newSelected }))
    );
  };

  const handleValidate = () => {
    const answer = userAnswers.get(currentQuestion.id);
    if (!answer || answer.selected.length === 0) return;

    const isCorrect =
      answer.selected.length === currentQuestion.reponseCorrecte.length &&
      answer.selected.every((s) => currentQuestion.reponseCorrecte.includes(s));

    setUserAnswers(
      new Map(
        userAnswers.set(currentQuestion.id, {
          ...answer,
          isValidated: true,
          isCorrect,
        })
      )
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleToggleMark = () => {
    const answer = userAnswers.get(currentQuestion.id) || {
      questionId: currentQuestion.id,
      selected: [],
      isMarked: false,
      isValidated: false,
      timeSpent: 0,
    };

    setUserAnswers(
      new Map(
        userAnswers.set(currentQuestion.id, {
          ...answer,
          isMarked: !answer.isMarked,
        })
      )
    );
  };

  // Gestion du surlignage de texte
  const handleTextSelection = () => {
    if (!highlightMode) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length === 0) return;

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer.parentElement;
    if (!container) return;

    // Créer un nouveau highlight
    const newHighlight: Highlight = {
      id: `highlight-${Date.now()}-${Math.random()}`,
      text: selectedText,
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      containerType: container.dataset.highlightType as any || "cas",
      containerId: container.dataset.highlightId || currentCas.id,
    };

    setHighlights([...highlights, newHighlight]);
    selection.removeAllRanges();
  };

  const removeHighlight = (highlightId: string) => {
    setHighlights(highlights.filter(h => h.id !== highlightId));
  };

  const renderTextWithHighlights = (text: string, containerType: string, containerId: string) => {
    const containerHighlights = highlights.filter(
      h => h.containerType === containerType && h.containerId === containerId
    );

    if (containerHighlights.length === 0) {
      return text;
    }

    // Simple rendering - pour une implémentation complète, il faudrait gérer les overlaps
    let result = text;
    const parts: { text: string; isHighlighted: boolean; id?: string }[] = [];
    let lastIndex = 0;

    // Pour simplifier, on surligne juste les occurrences du texte
    containerHighlights.forEach(highlight => {
      const index = text.indexOf(highlight.text, lastIndex);
      if (index !== -1) {
        if (index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, index), isHighlighted: false });
        }
        parts.push({ text: highlight.text, isHighlighted: true, id: highlight.id });
        lastIndex = index + highlight.text.length;
      }
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isHighlighted: false });
    }

    return (
      <>
        {parts.map((part, index) => 
          part.isHighlighted ? (
            <mark
              key={`${part.id}-${index}`}
              className="highlight"
              onClick={() => part.id && removeHighlight(part.id)}
              title="Cliquez pour supprimer le surlignage"
            >
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </>
    );
  };

  // Fonction pour mettre en évidence les valeurs biologiques
  const highlightBiologicalValues = (text: string) => {
    // Regex pour détecter les valeurs numériques avec unités
    const regex = /(\d+[\s,]*\d*)\s*(g\/dl|mm³|µmol\/L|\/mm³|%)/gi;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part) || /g\/dl|mm³|µmol\/L|\/mm³|%/i.test(part)) {
        return <span key={index} className="font-medium text-primary">{part}</span>;
      }
      return part;
    });
  };

  const getQuestionStatus = (questionId: number) => {
    const answer = userAnswers.get(questionId);
    if (!answer) return "unanswered";
    if (answer.isMarked) return "marked";
    if (answer.isValidated && answer.isCorrect) return "correct";
    if (answer.isValidated && !answer.isCorrect) return "incorrect";
    if (answer.selected.length > 0) return "answered";
    return "unanswered";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-success text-white";
      case "incorrect":
        return "bg-destructive text-white";
      case "answered":
        return "bg-primary text-white";
      case "marked":
        return "bg-accent text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const progressPercent = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-background qcm-professional">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onExit && (
                <Button variant="ghost" size="icon" onClick={onExit} title="Retour">
                  <ChevronLeft size={20} />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setShowNavigation(!showNavigation)}>
                {showNavigation ? <X size={20} /> : <Menu size={20} />}
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="text-primary" size={24} />
                <div>
                  <h1 className="text-sm">QCM - Mode {mode}</h1>
                  <p className="text-xs text-muted-foreground">
                    Question {currentQuestionIndex + 1} / {mockQuestions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                <span className="text-sm">{formatTime(timer)}</span>
              </div>
              <Progress value={progressPercent} className="w-32" />
            </div>

            <Button variant="outline" size="sm" onClick={() => setShowResults(true)}>
              Terminer
            </Button>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden mt-3">
            <Progress value={progressPercent} className="w-full" />
          </div>
        </div>
      </header>

      {/* Barre d'outils de surlignage */}
      <div className="sticky top-[73px] z-40 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center gap-2">
            <Button
              variant={highlightMode ? "default" : "outline"}
              size="sm"
              onClick={() => setHighlightMode(!highlightMode)}
              className="gap-2"
            >
              <Highlighter size={16} />
              {highlightMode ? "Mode surlignage activé" : "Activer le surlignage"}
            </Button>
            {highlights.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHighlights([])}
                className="text-muted-foreground"
              >
                Effacer tout ({highlights.length})
              </Button>
            )}
            {highlightMode && (
              <span className="text-xs text-muted-foreground ml-2">
                Sélectionnez du texte pour le surligner
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-8 space-y-6">
            {/* Cas Clinique */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="text-primary" size={20} />
                        Cas clinique N°{currentCas.numero}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-primary/10">
                      {currentCas.specialite}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div 
                    className="prose prose-sm max-w-none dark:prose-invert qcm-content"
                    onMouseUp={handleTextSelection}
                    data-highlight-type="cas"
                    data-highlight-id={currentCas.id}
                  >
                    {currentCas.contenu.split("\n").map((line, index) => (
                      <p key={index} className="whitespace-pre-wrap leading-relaxed">
                        {highlightBiologicalValues(line)}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Question */}
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-accent/20">
                <CardHeader className="bg-accent/5">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="text-accent" size={20} />
                      Question {currentQuestion.numero}
                      {currentQuestion.typeReponse === "multiple" && (
                        <Badge variant="secondary" className="ml-2">
                          Réponses multiples
                        </Badge>
                      )}
                    </CardTitle>
                    <Button
                      variant={currentAnswer?.isMarked ? "default" : "outline"}
                      size="sm"
                      onClick={handleToggleMark}
                    >
                      <Flag size={16} className="mr-1" />
                      {currentAnswer?.isMarked ? "Marquée" : "Marquer"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div 
                    className="text-lg qcm-content"
                    onMouseUp={handleTextSelection}
                    data-highlight-type="question"
                    data-highlight-id={currentQuestion.id.toString()}
                  >
                    {currentQuestion.enonce}
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = currentAnswer?.selected.includes(option.letter);
                      const isValidated = currentAnswer?.isValidated;
                      const isCorrect = currentQuestion.reponseCorrecte.includes(option.letter);
                      const showCorrection = isValidated && mode === "entrainement";

                      return (
                        <motion.div
                          key={option.letter}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div
                            onClick={() => !isValidated && handleSelectOption(option.letter)}
                            className={`
                              relative p-4 rounded-lg border-2 transition-all cursor-pointer
                              ${isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                              ${showCorrection && isCorrect ? "border-success bg-success/5" : ""}
                              ${showCorrection && !isCorrect && isSelected ? "border-destructive bg-destructive/5" : ""}
                              ${isValidated ? "cursor-not-allowed" : ""}
                            `}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`
                                flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm
                                ${isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground"}
                                ${showCorrection && isCorrect ? "border-success bg-success text-white" : ""}
                                ${showCorrection && !isCorrect && isSelected ? "border-destructive bg-destructive text-white" : ""}
                              `}
                              >
                                {option.letter}
                              </div>
                              <span 
                                className="flex-1 qcm-content"
                                onMouseUp={handleTextSelection}
                                data-highlight-type="option"
                                data-highlight-id={`${currentQuestion.id}-${option.letter}`}
                              >
                                {option.text}
                              </span>
                              {showCorrection && isCorrect && (
                                <CheckCircle className="text-success flex-shrink-0" size={20} />
                              )}
                              {showCorrection && !isCorrect && isSelected && (
                                <XCircle className="text-destructive flex-shrink-0" size={20} />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Explication */}
                  <AnimatePresence>
                    {currentAnswer?.isValidated && mode === "entrainement" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Separator className="my-4" />
                        <div
                          className={`p-4 rounded-lg ${
                            currentAnswer.isCorrect
                              ? "bg-success/10 border border-success/20"
                              : "bg-destructive/10 border border-destructive/20"
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-2">
                            {currentAnswer.isCorrect ? (
                              <CheckCircle className="text-success flex-shrink-0" size={20} />
                            ) : (
                              <XCircle className="text-destructive flex-shrink-0" size={20} />
                            )}
                            <h4 className="font-semibold">
                              {currentAnswer.isCorrect ? "Bonne réponse !" : "Réponse incorrecte"}
                            </h4>
                          </div>
                          <div 
                            className="prose prose-sm max-w-none dark:prose-invert ml-7 qcm-content"
                            onMouseUp={handleTextSelection}
                            data-highlight-type="question"
                            data-highlight-id={`${currentQuestion.id}-explication`}
                          >
                            {currentQuestion.explication.split("\n").map((line, index) => {
                              if (line.startsWith("**") && line.endsWith("**")) {
                                return (
                                  <p key={index} className="font-semibold mt-2">
                                    {line.replace(/\*\*/g, "")}
                                  </p>
                                );
                              }
                              return <p key={index}>{line}</p>;
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    {!currentAnswer?.isValidated && (
                      <Button
                        onClick={handleValidate}
                        disabled={!currentAnswer || currentAnswer.selected.length === 0}
                        className="flex-1"
                      >
                        Valider ma réponse
                      </Button>
                    )}
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleNext}
                        disabled={currentQuestionIndex === mockQuestions.length - 1}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Colonne navigation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-24">
              {/* Navigation rapide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye size={18} />
                    Navigation rapide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {mockQuestions.map((q, index) => {
                      const status = getQuestionStatus(q.id);
                      return (
                        <Button
                          key={q.id}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentQuestionIndex(index)}
                          className={`
                            ${getStatusColor(status)}
                            ${index === currentQuestionIndex ? "ring-2 ring-primary" : ""}
                          `}
                        >
                          {q.numero}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Légende */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-muted" />
                      <span>Non répondu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-primary" />
                      <span>Répondu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-success" />
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-destructive" />
                      <span>Incorrect</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-accent" />
                      <span>Marquée</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Résultats de la session</DialogTitle>
            <DialogDescription>Voici votre performance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {Array.from(userAnswers.values()).filter((a) => a.isCorrect).length} /{" "}
                {mockQuestions.length}
              </div>
              <p className="text-muted-foreground">Questions correctes</p>
            </div>
            <Progress
              value={
                (Array.from(userAnswers.values()).filter((a) => a.isCorrect).length /
                  mockQuestions.length) *
                100
              }
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Continuer
            </Button>
            <Button>Voir les détails</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- FONCTION UTILITAIRE ---
function highlightBiologicalValues(text: string) {
  // Détecte et colore les valeurs biologiques
  const patterns = [
    { regex: /(\d+[\s]*(?:g\/dl|g\/L|mm³|µmol\/L|mmol\/L|\/mm³))/gi, color: "text-primary" },
    { regex: /(leucocytes|hémoglobine|plaquettes|réticulocytes|bilirubine)/gi, color: "font-medium" },
  ];

  let parts: React.ReactNode[] = [text];

  patterns.forEach(({ regex, color }) => {
    const newParts: React.ReactNode[] = [];
    parts.forEach((part) => {
      if (typeof part === "string") {
        const matches = part.split(regex);
        matches.forEach((match, i) => {
          if (regex.test(match)) {
            newParts.push(
              <span key={`${match}-${i}`} className={color}>
                {match}
              </span>
            );
          } else if (match) {
            newParts.push(match);
          }
        });
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });

  return <>{parts}</>;
}
