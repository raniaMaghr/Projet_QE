import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Heart, Brain, Stethoscope, ChevronRight } from "lucide-react";
import { getSpecialtiesByLevel, getCoursesBySpecialtyAndLevel, getSeriesByCourseYearFaculty } from '@/supabaseService';

function getSpecialtyIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes('cardio') || n.includes('cardiologie')) return '❤️';
  if (n.includes('gyn') || n.includes('obst')) return '👶';
  if (n.includes('psychi') || n.includes('psychiatrie')) return '🧠';
  if (n.includes('chir') || n.includes('chirurgie')) return '🏥';
  if (n.includes('neuro') || n.includes('neurologie')) return '🧠';
  if (n.includes('pediatrie') || n.includes('pédiatrie')) return '👶';
  return '📚';
}

export function SeriesPage() {
  const [activeTab, setActiveTab] = useState("j1");
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard");

  // --- Mode1 dynamic navigation state ---
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [specialtiesWithCount, setSpecialtiesWithCount] = useState<{ name: string; count: number }[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [year, setYear] = useState<string>('2024');
  const [faculty, setFaculty] = useState<string>('FMS');
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When tab changes, reload specialties for the corresponding level
    const level = activeTab === 'j1' ? 'J1' : 'J2';
    loadSpecialties(level);
    // reset selections
    setSelectedSpecialty(null);
    setCourses([]);
    setSelectedCourse(null);
    setSeries([]);
  }, [activeTab]);

  async function loadSpecialties(level: string) {
    setLoading(true);
    try {
      const specs = await getSpecialtiesByLevel(level);
      setSpecialties(specs);
      // charger les counts pour l'affichage (optimisable)
      const counts = await Promise.all(
        specs.map(async (s) => {
          try {
            const cs = await getCoursesBySpecialtyAndLevel(s, level);
            return { name: s, count: cs.length };
          } catch (e) {
            return { name: s, count: 0 };
          }
        })
      );
      setSpecialtiesWithCount(counts);
    } catch (err) {
      console.error('Erreur loading specialties', err);
    } finally {
      setLoading(false);
    }
  }

  async function onSelectSpecialty(spec: string) {
    setSelectedSpecialty(spec);
    setLoading(true);
    try {
      const level = activeTab === 'j1' ? 'J1' : 'J2';
      const cs = await getCoursesBySpecialtyAndLevel(spec, level);
      setCourses(cs);
      setSelectedCourse(null);
      setSeries([]);
    } catch (err) {
      console.error('Erreur loading courses', err);
    } finally {
      setLoading(false);
    }
  }

  async function onSelectCourse(course: any) {
    setSelectedCourse(course);
    setSeries([]);
  }

  async function loadSeriesForSelectedCourse() {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const s = await getSeriesByCourseYearFaculty(selectedCourse.name || selectedCourse.title || selectedCourse.shortTitle, year, faculty);
      setSeries(s);
    } catch (err) {
      console.error('Erreur loading series', err);
    } finally {
      setLoading(false);
    }
  }

  const goToCourse = (day: string, key: string) => {
    navigate(`/train/series/${day}/${key}`);
  };

  // ---------------- J1 ----------------
  const j1Courses = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Cardiologie – Chirurgie cardio-vasculaire",
      shortTitle: "Cardio-CCV",
      progress: "78%",
      chapters: "6 chapitres",
      key: "cardio-ccv",
    },
    {
      icon: "👶",
      title: "Gynécologie – Obstétrique",
      shortTitle: "Gynéco-Obs",
      progress: "65%",
      chapters: "6 chapitres",
      key: "gyneco",
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "Psychiatrie",
      shortTitle: "Psychiatrie",
      progress: "42%",
      chapters: "10 chapitres",
      key: "psychiatrie",
    },
    {
      icon: "🏥",
      title: "Chirurgie générale",
      shortTitle: "Chirurgie",
      progress: "38%",
      chapters: "6 chapitres",
      key: "chirurgie",
    },
    {
      icon: "🫄",
      title: "Gastro-entérologie",
      shortTitle: "Gastro",
      progress: "55%",
      chapters: "5 chapitres",
      key: "gastro",
    },
    {
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      title: "Neurologie",
      shortTitle: "Neurologie",
      progress: "33%",
      chapters: "16 chapitres",
      key: "neurologie",
    },
    {
      icon: "👁️",
      title: "ORL – Ophtalmologie",
      shortTitle: "ORL-Ophta",
      progress: "47%",
      chapters: "11 chapitres",
      key: "orl-ophta",
    },
    {
      icon: <Stethoscope className="h-6 w-6 text-green-500" />,
      title: "Pneumologie",
      shortTitle: "Pneumo",
      progress: "72%",
      chapters: "9 chapitres",
      key: "pneumo",
    },
  ];

  // -------------------------
  // Données J2
  // -------------------------
  const j2Courses = [
    {
      icon: "🧬",
      title: "Endocrinologie",
      shortTitle: "Endocrino",
      progress: "62%",
      chapters: "6 chapitres",
      key: "endocrino",
    },
    {
      icon: "🦠",
      title: "Maladies infectieuses",
      shortTitle: "Infectieux",
      progress: "28%",
      chapters: "17 chapitres",
      key: "infectieux",
    },
    {
      icon: "🫘",
      title: "Néphrologie",
      shortTitle: "Néphro",
      progress: "44%",
      chapters: "10 chapitres",
      key: "nephro",
    },
    {
      icon: "🦴",
      title: "Orthopédie – Rhumatologie",
      shortTitle: "Ortho-Rhumato",
      progress: "36%",
      chapters: "20 chapitres",
      key: "ortho-rhumato",
    },
    {
      icon: "🚨",
      title: "Réanimation",
      shortTitle: "Réanimation",
      progress: "58%",
      chapters: "8 chapitres",
      key: "reanimation",
    },
    {
      icon: "🩸",
      title: "Hématologie",
      shortTitle: "Hémato",
      progress: "41%",
      chapters: "5 chapitres",
      key: "hemato",
    },
    {
      icon: "👶",
      title: "Pédiatrie",
      shortTitle: "Pédiatrie",
      progress: "67%",
      chapters: "22 chapitres",
      key: "pediatrie",
    },
    {
      icon: "🫸",
      title: "Urologie",
      shortTitle: "Urologie",
      progress: "29%",
      chapters: "9 chapitres",
      key: "urologie",
    },
  ];


  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBack}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <h1 className="text-2xl font-semibold">
              📚 QCM Par Séries
            </h1>
          </div>

          <p className="text-muted-foreground">
            Navigation : J1/J2 → Spécialité → Cours → Année → Faculté → Séries
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 h-14">
          <TabsTrigger value="j1" className="text-base">
            Jour 1
          </TabsTrigger>
          <TabsTrigger value="j2" className="text-base">
            Jour 2
          </TabsTrigger>
        </TabsList>

        {/* -------- J1 -------- */}
        <TabsContent value="j1" className="space-y-4">
          <div>
            <div className="mb-4">
              <h3 className="font-medium">Spécialités (Jour 1)</h3>
              {loading && specialties.length === 0 ? (
                <div>Chargement...</div>
              ) : (
                <div className="space-y-4 mt-4">
                  {specialtiesWithCount.map(spec => (
                    <Card key={spec.name} className={`shadow-sm rounded-lg`} onClick={() => onSelectSpecialty(spec.name)}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{getSpecialtyIcon(spec.name)}</div>
                          <div>
                            <h4 className="font-semibold">{spec.name}</h4>
                            <div className="text-sm text-muted-foreground">{spec.count} cours</div>
                          </div>
                        </div>
                        <div>
                          <Button variant="default">EXPLORER</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedSpecialty && (
              <div className="mb-4">
                <h4 className="font-medium">{getSpecialtyIcon(selectedSpecialty)} {selectedSpecialty}</h4>
                <p className="text-muted-foreground">Sélectionnez un cours pour voir les séries QCM disponibles</p>

                <div className="space-y-3 mt-4">
                  {loading && courses.length === 0 ? (
                    <div>Chargement...</div>
                  ) : (
                    courses.map((course, idx) => (
                      <div key={course.id || idx} className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-sm font-semibold text-primary">{(course.id || idx + 1).toString().slice(0,2)}</div>
                          <div>{course.name || course.title}</div>
                        </div>
                        <div>
                          <Button variant="default" onClick={() => onSelectCourse(course)}>EXPLORER <ChevronRight className="ml-2" /></Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedCourse && (
              <div className="mb-4">
                <h4 className="font-medium">Filtrer séries pour: {selectedCourse.name || selectedCourse.title}</h4>
                <div className="flex gap-2 items-center mt-2">
                  <label>Année:</label>
                  <select value={year} onChange={e => setYear(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>

                  <label>Faculté:</label>
                  <select value={faculty} onChange={e => setFaculty(e.target.value)} className="px-2 py-1 border rounded">
                    <option value="FMS">FMS</option>
                    <option value="FMT">FMT</option>
                    <option value="FMM">FMM</option>
                    <option value="FMSf">FMSf</option>
                  </select>

                  <Button onClick={loadSeriesForSelectedCourse}>Charger séries</Button>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <div>Chargement séries...</div>
                  ) : series.length === 0 ? (
                    <div>Aucune série trouvée pour ces filtres</div>
                  ) : (
                    <div className="space-y-2">
                      {series.map(s => (
                        <div key={s.id} className="p-3 border rounded flex justify-between items-center">
                          <div>
                            <div className="font-medium">{s.objective}</div>
                            <div className="text-sm text-muted-foreground">{s.faculty} — {s.year}</div>
                          </div>
                          <div>
                            <Button size="sm" onClick={() => console.log('Start series', s.id)}>Explorer</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* -------- J2 -------- */}
        <TabsContent value="j2" className="space-y-4">
          <div>
            <div className="mb-4">
              <h3 className="font-medium">Spécialités (Jour 2)</h3>
              {loading && specialties.length === 0 ? (
                <div>Chargement...</div>
              ) : (
                <div className="space-y-4 mt-4">
                  {specialtiesWithCount.map(spec => (
                    <Card key={spec.name} className={`shadow-sm rounded-lg`} onClick={() => onSelectSpecialty(spec.name)}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{getSpecialtyIcon(spec.name)}</div>
                          <div>
                            <h4 className="font-semibold">{spec.name}</h4>
                            <div className="text-sm text-muted-foreground">{spec.count} cours</div>
                          </div>
                        </div>
                        <div>
                          <Button variant="default">EXPLORER</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {selectedSpecialty && (
              <div className="mb-4">
                <h4 className="font-medium">{getSpecialtyIcon(selectedSpecialty)} {selectedSpecialty}</h4>
                <p className="text-muted-foreground">Sélectionnez un cours pour voir les séries QCM disponibles</p>

                <div className="space-y-3 mt-4">
                  {loading && courses.length === 0 ? (
                    <div>Chargement...</div>
                  ) : (
                    courses.map((course, idx) => (
                      <div key={course.id || idx} className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center text-sm font-semibold text-primary">{(course.id || idx + 1).toString().slice(0,2)}</div>
                          <div>{course.name || course.title}</div>
                        </div>
                        <div>
                          <Button variant="default" onClick={() => onSelectCourse(course)}>EXPLORER <ChevronRight className="ml-2" /></Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
