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
import { ChevronLeft, Heart, Brain, Stethoscope } from "lucide-react";
import { getSpecialtiesByLevel, getCoursesBySpecialtyAndLevel, getSeriesByCourseYearFaculty } from '@/supabaseService';

export function SeriesPage() {
  const [activeTab, setActiveTab] = useState("j1");
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard");

  // --- Mode1 dynamic navigation state ---
  const [specialties, setSpecialties] = useState<string[]>([]);
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
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map(s => (
                    <button
                      key={s}
                      className={`px-3 py-1 rounded border ${selectedSpecialty === s ? 'bg-primary text-white' : 'bg-white'}`}
                      onClick={() => onSelectSpecialty(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedSpecialty && (
              <div className="mb-4">
                <h4 className="font-medium">Cours — {selectedSpecialty}</h4>
                {loading && courses.length === 0 ? (
                  <div>Chargement...</div>
                ) : (
                  <div className="grid gap-4 mt-2">
                    {courses.map((course, idx) => (
                      <Card key={course.id || idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectCourse(course)}>
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{course.name || course.title}</h3>
                            <Badge variant="secondary" className="font-normal">{course.bank_size ?? '—'} cours</Badge>
                          </div>
                          <Button>Choisir</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
          {/* Réutilise la même UI que pour J1 mais activeTab est j2, ce qui déclenche le chargement pour J2 */}
          <div>
            <div className="mb-4">
              <h3 className="font-medium">Spécialités (Jour 2)</h3>
              {loading && specialties.length === 0 ? (
                <div>Chargement...</div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map(s => (
                    <button
                      key={s}
                      className={`px-3 py-1 rounded border ${selectedSpecialty === s ? 'bg-primary text-white' : 'bg-white'}`}
                      onClick={() => onSelectSpecialty(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedSpecialty && (
              <div className="mb-4">
                <h4 className="font-medium">Cours — {selectedSpecialty}</h4>
                {loading && courses.length === 0 ? (
                  <div>Chargement...</div>
                ) : (
                  <div className="grid gap-4 mt-2">
                    {courses.map((course, idx) => (
                      <Card key={course.id || idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onSelectCourse(course)}>
                        <CardContent className="p-6 flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{course.name || course.title}</h3>
                            <Badge variant="secondary" className="font-normal">{course.bank_size ?? '—'} cours</Badge>
                          </div>
                          <Button>Choisir</Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
      </Tabs>
    </div>
  );
}
