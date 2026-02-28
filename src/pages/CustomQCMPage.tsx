'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Filter, RotateCcw, Play } from 'lucide-react';

/**
 * CustomQCMPage - Page QCM à la Carte
 * 
 * Permet aux utilisateurs de créer des séries personnalisées de QCM
 * avec des filtres avancés (spécialités, sujets, années, facultés, etc.)
 * 
 * Design: Interface épurée avec filtres organisés en sections claires
 * Interactions: Checkboxes, slider, boutons d'action avec feedback visuel
 */

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
}

function Slider({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number[];
  onChange: (val: number[]) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value[0]}
      onChange={(e) => onChange([parseInt(e.target.value)])}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all duration-150"
      style={{
        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((value[0] - min) / (max - min)) * 100}%, #e5e7eb ${((value[0] - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
      }}
    />
  );
}


function StatCard({ value, label, color = 'text-blue-600' }: StatCardProps) {
  return (
    <div className="p-4 bg-muted rounded-lg border border-border">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function CustomQCMPage() {
  // État des filtres
  const [questionCount, setQuestionCount] = useState([20]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);

  // Données de référence
  const statusOptions = [
    {
      id: 'non-fait',
      label: 'Non fait',
      color: 'text-muted-foreground',
    },
    { id: 'fait', label: 'Fait', color: 'text-blue-600' },
    {
      id: 'reussi',
      label: 'Réussi',
      color: 'text-green-600',
    },
    {
      id: 'incomplet',
      label: 'Incomplet',
      color: 'text-yellow-600',
    },
    { id: 'faux', label: 'Faux', color: 'text-red-600' },
  ];

  const specialties = [
    'Cardiologie',
    'Pneumologie',
    'Gastroentérologie',
    'Neurologie',
    'Pédiatrie',
    'Gynécologie',
    'Urologie',
    'Dermatologie',
    'Psychiatrie',
    'Rhumatologie',
    'Endocrinologie',
    'Néphrologie',
  ];

  const subjects = [
    'ACR',
    'ADP',
    'Anémies',
    'Arthrite septique',
    'AVC',
    'BPCO',
    'Bronchiolites du nourrisson',
    'Bronchopneumopathies chroniques obstructives',
    'Brûlures cutanées récentes',
    'Cancer du cavum',
    'Cancer du col de l\'utérus',
    'Cancer du sein',
    'CBP',
    'CCR',
    'Céphalées',
    'Coma',
    'Contraception',
    'Déshydratations aiguës de l\'enfant',
    'Diabète',
    'Diarrhées chroniques',
    'Douleurs thoraciques aiguës',
    'Dyslipidémies',
    'Dysphagies',
    'EDC',
    'EDC Septique',
    'Endocardites infectieuses',
    'Épilepsies',
    'États confusionnels',
    'Fractures ouvertes de la jambe',
    'GEU',
    'Hématuries',
    'Hémorragies digestives',
    'Hépatites virales',
    'HTA',
    'Hydatidoses hépatiques et pulmonaires',
    'Hypercalcémies',
    'Hyperthyroïdies',
    'Hypothyroïdies de l\'enfant et de l\'adulte',
    'Infections des voies aériennes supérieures',
    'Infections respiratoires basses communautaires',
    'Intoxications par le CO, les organophosphorés et les psychotropes',
    'IRA',
    'IRB',
    'ISA',
    'IST',
    'IU',
    'IVAS',
    'Lithiase urinaire',
    'Méningites bactériennes et virales',
    'Métrorragies',
    'MVTE',
    'Œdèmes',
    'Œil rouge',
    'OIA',
    'PEC douleur aigue',
    'Péritonites aiguës',
    'Polytraumatisme',
    'PR',
    'Prééclampsies et Éclampsies',
    'Purpuras',
    'Schizophrénie',
    'SCA',
    'Splénomégalies',
    'Transfusion sanguine',
    'Traumatisme crânien',
    'Troubles acido-basiques',
    'Troubles de l\'hydratation, dyskaliémies',
    'Tumeurs de la prostate',
    'Vaccinations',
  ];

  const years = ['2022', '2023', '2024', '2025'];

  const faculties = [
    { id: 'tunis', label: 'FMT' },
    { id: 'sousse', label: 'FMS' },
    { id: 'monastir', label: 'FMM' },
    { id: 'sfax', label: 'FMSf' },
  ];

  const tags = [
    'Anatomie',
    'Physiologie',
    'Pharmacologie',
    'Clinique',
    'Biologie',
    'Épidémiologie',
  ];

  const questionTypes = ['QCM', 'Cas clinique'];

  // Handlers
  const handleReset = () => {
    setQuestionCount([20]);
    setSelectedStatus([]);
    setSelectedExams([]);
    setSelectedSpecialities([]);
    setSelectedSubjects([]);
    setSelectedYears([]);
    setSelectedFaculties([]);
    setSelectedTags([]);
    setSelectedQuestionTypes([]);
  };

  const toggleSelection = (
    value: string,
    selectedArray: string[],
    setSelectedArray: (values: string[]) => void,
  ) => {
    if (selectedArray.includes(value)) {
      setSelectedArray(
        selectedArray.filter((item) => item !== value),
      );
    } else {
      setSelectedArray([...selectedArray, value]);
    }
  };

  const handleGenerateSeries = () => {
    const config = {
      questionCount: questionCount[0],
      status: selectedStatus,
      exams: selectedExams,
      specialities: selectedSpecialities,
      subjects: selectedSubjects,
      years: selectedYears,
      faculties: selectedFaculties,
      tags: selectedTags,
      questionTypes: selectedQuestionTypes,
    };
    console.log('Generating series with config:', config);
    // TODO: Implémenter l'appel API pour générer la série
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8">
        {/* En-tête */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">
                🎯 QCM à la Carte
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Créez des séries personnalisées avec des filtres avancés
            </p>
          </CardContent>
        </Card>

        {/* Filtres de Sélection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres de Sélection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Nombre de questions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Nombre de questions</h3>
              <div className="px-4">
                <Slider
                  value={questionCount}
                  onChange={setQuestionCount}
                  max={150}
                  min={5}
                  step={1}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span className="font-medium">5</span>
                  <span className="font-bold text-blue-600 text-lg">{questionCount[0]} questions</span>
                  <span className="font-medium">150+</span>
                </div>
              </div>
            </div>

            {/* Statut */}
            <div className="space-y-4">
              <h3 className="font-semibold">Statut</h3>
              <div className="flex flex-wrap gap-4">
                {statusOptions.map((status) => (
                  <div
                    key={status.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={status.id}
                      checked={selectedStatus.includes(
                        status.id,
                      )}
                      onCheckedChange={() =>
                        toggleSelection(
                          status.id,
                          selectedStatus,
                          setSelectedStatus,
                        )
                      }
                    />
                    <label
                      htmlFor={status.id}
                      className={`text-sm ${status.color} cursor-pointer ml-2`}
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Épreuve */}
            <div className="space-y-4">
              <h3 className="font-semibold">Épreuve</h3>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="j1"
                    checked={selectedExams.includes("j1")}
                    onCheckedChange={() =>
                      toggleSelection(
                        "j1",
                        selectedExams,
                        setSelectedExams,
                      )
                    }
                  />
                  <label
                    htmlFor="j1"
                    className="text-sm cursor-pointer ml-2"
                  >
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      J1
                    </Badge>
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="j2"
                    checked={selectedExams.includes("j2")}
                    onCheckedChange={() =>
                      toggleSelection(
                        "j2",
                        selectedExams,
                        setSelectedExams,
                      )
                    }
                  />
                  <label
                    htmlFor="j2"
                    className="text-sm cursor-pointer ml-2"
                  >
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      J2
                    </Badge>
                  </label>
                </div>
              </div>
            </div>

            {/* Spécialité */}
            <div className="space-y-4">
              <h3 className="font-semibold">Spécialité</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {specialties.map((specialty) => (
                  <div
                    key={specialty}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialities.includes(
                        specialty,
                      )}
                      onCheckedChange={() =>
                        toggleSelection(
                          specialty,
                          selectedSpecialities,
                          setSelectedSpecialities,
                        )
                      }
                    />
                    <label
                      htmlFor={`specialty-${specialty}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {specialty}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sujet */}
            <div className="space-y-4">
              <h3 className="font-semibold">Sujet</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`subject-${subject}`}
                      checked={selectedSubjects.includes(
                        subject,
                      )}
                      onCheckedChange={() =>
                        toggleSelection(
                          subject,
                          selectedSubjects,
                          setSelectedSubjects,
                        )
                      }
                    />
                    <label
                      htmlFor={`subject-${subject}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {subject}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Année */}
            <div className="space-y-4">
              <h3 className="font-semibold">Année</h3>
              <div className="flex gap-4">
                {years.map((year) => (
                  <div
                    key={year}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`year-${year}`}
                      checked={selectedYears.includes(year)}
                      onCheckedChange={() =>
                        toggleSelection(
                          year,
                          selectedYears,
                          setSelectedYears,
                        )
                      }
                    />
                    <label
                      htmlFor={`year-${year}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculté */}
            <div className="space-y-4">
              <h3 className="font-semibold">Faculté</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {faculties.map((faculty) => (
                  <div
                    key={faculty.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`faculty-${faculty.id}`}
                      checked={selectedFaculties.includes(
                        faculty.id,
                      )}
                      onCheckedChange={() =>
                        toggleSelection(
                          faculty.id,
                          selectedFaculties,
                          setSelectedFaculties,
                        )
                      }
                    />
                    <label
                      htmlFor={`faculty-${faculty.id}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {faculty.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="font-semibold">Tags</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() =>
                        toggleSelection(
                          tag,
                          selectedTags,
                          setSelectedTags,
                        )
                      }
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Type de Question */}
            <div className="space-y-4">
              <h3 className="font-semibold">
                Type de Question
              </h3>
              <div className="flex gap-4">
                {questionTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedQuestionTypes.includes(
                        type,
                      )}
                      onCheckedChange={() =>
                        toggleSelection(
                          type,
                          selectedQuestionTypes,
                          setSelectedQuestionTypes,
                        )
                      }
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm cursor-pointer ml-2"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Réinitialiser
              </Button>
              <Button 
                onClick={handleGenerateSeries}
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                <Play className="h-4 w-4" />
                Générer Série ({questionCount[0]} questions)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Actuelle et Aperçu Statistique */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Actuelle</CardTitle>
              <p className="text-sm text-muted-foreground">
                Résumé de votre sélection de filtres
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">
                  Questions:
                </span>{" "}
                {questionCount[0]}
              </div>
              {selectedStatus.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Statut:</span>{" "}
                  {selectedStatus.join(", ")}
                </div>
              )}
              {selectedExams.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">
                    Épreuves:
                  </span>{" "}
                  {selectedExams.join(", ").toUpperCase()}
                </div>
              )}
              {selectedSpecialities.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">
                    Spécialités:
                  </span>{" "}
                  {selectedSpecialities
                    .slice(0, 3)
                    .join(", ")}
                  {selectedSpecialities.length > 3 &&
                    ` +${selectedSpecialities.length - 3} autres`}
                </div>
              )}
              {selectedYears.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">Années:</span>{" "}
                  {selectedYears.join(", ")}
                </div>
              )}
              {selectedFaculties.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium">
                    Facultés:
                  </span>{" "}
                  {selectedFaculties.length} sélectionnées
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Aperçu Statistique</CardTitle>
              <p className="text-sm text-muted-foreground">
                Distribution estimée selon vos filtres
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  value="~2,450"
                  label="📚 Questions disponibles"
                />
                <StatCard
                  value="85%"
                  label="🎯 Taux de réussite moyen"
                />
                <StatCard
                  value="~45min"
                  label="⏱️ Durée estimée"
                />
                <StatCard
                  value="Modérée"
                  label="📈 Difficulté"
                  color="text-yellow-600"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
