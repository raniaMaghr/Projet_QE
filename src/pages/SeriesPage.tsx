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
import { getSpecialtiesByLevel, getCoursesBySpecialtyAndLevel, getSeriesByCourseYearFaculty, getSeriesOverviewByCourse } from '@/supabaseService';

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
  const [seriesOverview, setSeriesOverview] = useState<{ year: string; faculties: { faculty: string; count: number }[] }[]>([]);
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});

  function toggleYearExpand(year: string) {
    setExpandedYears(prev => ({ ...prev, [year]: !prev[year] }));
  }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger les spécialités pour l'onglet actif (J1/J2) sans exiger
    // que l'utilisateur soit authentifié — les listes sont publiques.
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
    // When user selects a course, load the overview (years → faculties)
    setSelectedCourse(course);
    setSeries([]);
    setSeriesOverview([]);
    await loadSeriesOverviewForCourse(course);
  }

  async function loadSeriesOverviewForCourse(course: any) {
    if (!course) return;
    setLoading(true);
    try {
      const courseName = course.name || course.title || course.shortTitle;
      const rows = await getSeriesOverviewByCourse(courseName);

      // Group rows by year then faculty and count
      const map: Record<string, Record<string, number>> = {};
      (rows || []).forEach((r: any) => {
        const y = r.year || 'Unknown';
        const f = r.faculty || 'N/A';
        map[y] = map[y] || {};
        map[y][f] = (map[y][f] || 0) + 1;
      });

      const years = Object.keys(map).sort((a, b) => (b > a ? 1 : -1));
      const overview = years.map(y => ({
        year: y,
        faculties: Object.keys(map[y]).map(f => ({ faculty: f, count: map[y][f] }))
      }));

      setSeriesOverview(overview);
      // expand all years by default so faculties are visible immediately
      const expandState: Record<string, boolean> = {};
      years.forEach(y => { expandState[y] = true; });
      setExpandedYears(expandState);
    } catch (err) {
      console.error('Erreur loading series overview', err);
    } finally {
      setLoading(false);
    }
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



  return (
    <div className="space-y-6">
      {!selectedSpecialty && (
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
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {!selectedSpecialty && (
          <TabsList className="grid w-full grid-cols-2 h-14">
            <TabsTrigger value="j1" className="text-base">
              Jour 1
            </TabsTrigger>
            <TabsTrigger value="j2" className="text-base">
              Jour 2
            </TabsTrigger>
          </TabsList>
        )}

        {/* -------- J1 -------- */}
        <TabsContent value="j1" className="space-y-4">
          <div>
            {!selectedSpecialty && (
              <div className="mb-4">
                <h3 className="font-medium">Spécialités (Jour 1)</h3>
                {loading && specialties.length === 0 ? (
                  <div>Chargement...</div>
                ) : specialtiesWithCount.length === 0 ? (
                  <div>Aucune spécialité trouvée</div>
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
            )}

            {selectedSpecialty && (
              <div className="mb-4">
                <Card className="shadow-sm rounded-lg">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" onClick={() => { setSelectedSpecialty(null); setCourses([]); setSeries([]); }}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-2xl">{getSpecialtyIcon(selectedSpecialty)}</div>
                      <div>
                        <h4 className="font-semibold">{selectedSpecialty}</h4>
                        <p className="text-sm text-muted-foreground">Sélectionnez un cours pour voir les séries QCM disponibles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3 mt-4">
                  {loading && courses.length === 0 ? (
                    <div>Chargement...</div>
                  ) : courses.length === 0 ? (
                    <div>Aucun cours trouvé pour cette spécialité</div>
                  ) : (
                    courses.map((course, idx) => (
                      <div key={course.id || idx} className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">{(idx + 1)}</div>
                          <div>{course.name || course.title}</div>
                        </div>
                        <div>
                          <Button variant="default" onClick={() => navigate(`/train/series/course/${course.id || course.key}`)}>EXPLORER <ChevronRight className="ml-2" /></Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {selectedCourse && (
              <div className="mb-4">
                <Card className="shadow-sm rounded-lg">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" onClick={() => { setSelectedCourse(null); setSeriesOverview([]); }}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-2xl">{getSpecialtyIcon(selectedSpecialty || '')}</div>
                      <div>
                        <h4 className="font-semibold">{selectedCourse.name || selectedCourse.title} - Séries par Année</h4>
                        <p className="text-sm text-muted-foreground">Facultés contenant des séries, regroupées par année</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6 mt-4">
                  {loading && seriesOverview.length === 0 ? (
                    <div>Chargement...</div>
                  ) : seriesOverview.length === 0 ? (
                    <div>Aucune série disponible pour ce cours</div>
                  ) : (
                    seriesOverview.map(y => (
                      <Card key={y.year} className="p-4">
                        <CardContent>
                          <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-full bg-slate-100 p-2">📅</div>
                            <h5 className="font-medium">Année {y.year}</h5>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                      <div className="grid grid-cols-2 gap-4">
                                        {y.faculties.map(f => (
                                          <div key={f.faculty} className="p-4 border rounded flex items-center justify-between">
                                            <div>
                                              <div className="font-medium">{f.faculty}</div>
                                              <div className="text-sm text-muted-foreground">{f.count} séries disponibles</div>
                                            </div>
                                            <div>
                                              <Button size="sm" onClick={async () => {
                                                setSelectedCourse({ ...selectedCourse, _loadGoal: { year: y.year, faculty: f.faculty } });
                                                const s = await getSeriesByCourseYearFaculty(selectedCourse.name || selectedCourse.title, y.year, f.faculty);
                                                setSeries(s);
                                              }}>Explorer</Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Si on a chargé des séries pour un couple year/faculty, les afficher */}
                {series.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium">Séries</h5>
                    <div className="space-y-2 mt-2">
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
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        {/* -------- J2 -------- */}
        <TabsContent value="j2" className="space-y-4">
          <div>
            {!selectedSpecialty && (
              <div className="mb-4">
                <h3 className="font-medium">Spécialités (Jour 2)</h3>
                {loading && specialties.length === 0 ? (
                  <div>Chargement...</div>
                ) : specialtiesWithCount.length === 0 ? (
                  <div>Aucune spécialité trouvée</div>
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
            )}

            {selectedSpecialty && (
              <div className="mb-4">
                <Card className="shadow-sm rounded-lg">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="icon" onClick={() => { setSelectedSpecialty(null); setCourses([]); setSeries([]); }}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-2xl">{getSpecialtyIcon(selectedSpecialty)}</div>
                      <div>
                        <h4 className="font-semibold">{selectedSpecialty}</h4>
                        <p className="text-sm text-muted-foreground">Sélectionnez un cours pour voir les séries QCM disponibles</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3 mt-4">
                  {loading && courses.length === 0 ? (
                    <div>Chargement...</div>
                  ) : courses.length === 0 ? (
                    <div>Aucun cours trouvé pour cette spécialité</div>
                  ) : (
                    courses.map((course, idx) => (
                      <div key={course.id || idx} className="p-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">{(idx + 1)}</div>
                          <div>{course.name || course.title}</div>
                        </div>
                        <div>
                          <Button variant="default" onClick={() => navigate(`/train/series/course/${course.id || course.key}`)}>EXPLORER <ChevronRight className="ml-2" /></Button>
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
