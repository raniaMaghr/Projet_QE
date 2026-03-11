import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle, Book } from 'lucide-react';
import { getCourseById, getSeriesByCourseYearFaculty, getSeriesOverviewByCourse, getQuestionsBySeriesId } from '@/supabaseService';

export default function CourseSeriesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any | null>(null);
  const [year, setYear] = useState('2024');
  const [faculty, setFaculty] = useState('FMS');
  const [series, setSeries] = useState<any[]>([]);
  const [seriesOverview, setSeriesOverview] = useState<{ year: string; faculties: { faculty: string; count: number }[] }[]>([]);
  const [selectedOverviewFilter, setSelectedOverviewFilter] = useState<{ year: string; faculty: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const load = async () => {
      setLoading(true);
      try {
        const c = await getCourseById(courseId);
        if (!c) setError('Cours introuvable');
        setCourse(c);
      } catch (e) {
        console.error(e);
        setError('Erreur lors du chargement du cours');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  useEffect(() => {
    // when course is loaded, fetch overview (years -> faculties)
    if (!course) return;
    const loadOverview = async () => {
      setLoading(true);
      try {
        const rows = await getSeriesOverviewByCourse(course.name || course.title);
        const map: Record<string, Record<string, number>> = {};
        (rows || []).forEach((r: any) => {
          const y = r.year || 'Unknown';
          const f = r.faculty || 'N/A';
          map[y] = map[y] || {};
          map[y][f] = (map[y][f] || 0) + 1;
        });
        const years = Object.keys(map).sort((a, b) => (b > a ? 1 : -1));
        const overview = years.map(y => ({ year: y, faculties: Object.keys(map[y]).map(f => ({ faculty: f, count: map[y][f] })) }));
        setSeriesOverview(overview);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadOverview();
  }, [course]);

  async function handleLoadSeries() {
    if (!course) return;
    setLoading(true);
    try {
      const s = await getSeriesByCourseYearFaculty(course.name || course.title, year, faculty);
      setSeries(s);
    } catch (e) {
      console.error(e);
      setError('Erreur lors du chargement des séries');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !course) return <div className="p-6">Chargement...</div>;
  if (error && !course) return <div className="p-6 text-red-600">{error}</div>;
  const totalQuestions = series.reduce((sum, x) => sum + (x._questionCount || 0), 0);
  const avgQuestions = series.length ? Math.round(totalQuestions / series.length) : 0;

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold">{course?.name || course?.title}</h2>
              <p className="text-muted-foreground">Sélectionnez année et faculté puis chargez les séries disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview or Series list (replace overview when a faculty is selected) */}
      <div className="space-y-6">
        {!selectedOverviewFilter ? (
          // Overview
          loading && seriesOverview.length === 0 ? (
            <div>Chargement...</div>
          ) : seriesOverview.length === 0 ? (
            <div className="text-muted-foreground">Aucune série disponible pour ce cours</div>
          ) : (
            seriesOverview.map(y => (
              <Card key={y.year} className="p-4">
                <CardContent>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="rounded-full bg-slate-100 p-2">📅</div>
                    <h5 className="font-medium">Année {y.year}</h5>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {y.faculties.map(f => (
                      <div
                        key={f.faculty}
                        className="p-4 border rounded flex items-center justify-between cursor-pointer hover:bg-slate-50"
                        role="button"
                        tabIndex={0}
                        onClick={async () => {
                          // set selected filter so we replace overview with series list
                          setSelectedOverviewFilter({ year: y.year, faculty: f.faculty });
                          setLoading(true);
                          setError(null);
                          try {
                            const s = await getSeriesByCourseYearFaculty(course!.name || course!.title, y.year, f.faculty);
                            // fetch question counts for each series
                            const withCounts = await Promise.all(
                              (s || []).map(async (ser: any) => {
                                try {
                                  const qs = await getQuestionsBySeriesId(ser.id);
                                  return { ...ser, _questionCount: qs?.length || 0 };
                                } catch (e) {
                                  return { ...ser, _questionCount: 0 };
                                }
                              })
                            );
                            setSeries(withCounts);
                          } catch (e) {
                            console.error(e);
                            setError('Erreur lors du chargement des séries');
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">{f.faculty}</div>
                          <div className="text-sm text-muted-foreground">{f.count} séries disponibles</div>
                        </div>
                        <div className="text-sm text-muted-foreground">Voir</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )
        ) : (
          // Series list replacing overview
          <div>
            <Card>
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => { setSelectedOverviewFilter(null); setSeries([]); }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <h4 className="font-semibold">{course?.name || course?.title} — {selectedOverviewFilter.year} • {selectedOverviewFilter.faculty}</h4>
                    <div className="text-sm text-muted-foreground">Séries disponibles</div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <div className="mt-4">
                {loading ? (
                  <div>Chargement séries...</div>
                ) : series.length === 0 ? (
                  <div className="text-muted-foreground">Aucune série trouvée pour ce filtre</div>
                ) : (
                  <>
                    {/* Statistics block matching design */}
                    <Card className="p-4 mb-4">
                      <CardContent>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="rounded-full bg-slate-100 p-2">📊</div>
                          <h5 className="font-medium">Statistiques - {course?.name || course?.title}</h5>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-indigo-50 p-6 flex flex-col items-center">
                            <div className="text-3xl font-semibold text-indigo-600">{series.length}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2"><Book className="h-4 w-4 text-indigo-500" /><span>Séries disponibles</span></div>
                          </div>

                          <div className="rounded-lg bg-indigo-50 p-6 flex flex-col items-center">
                            <div className="text-3xl font-semibold text-indigo-600">{avgQuestions}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-2"><HelpCircle className="h-4 w-4 text-red-500" /><span>Questions/série</span></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-3" data-series-list>
                      {series.map(s => (
                        <Card key={s.id} className="shadow-sm rounded-lg">
                          <CardContent className="p-6 cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/series/${s.id}`)}>
                            <div>
                              <div className="font-medium text-lg mb-2">{s.objective}</div>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <HelpCircle className="h-4 w-4 text-red-500" />
                                <span>{s._questionCount ?? 0} questions</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )}
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
