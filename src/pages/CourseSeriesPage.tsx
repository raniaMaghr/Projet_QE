import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { getCourseById, getSeriesByCourseYearFaculty, getSeriesOverviewByCourse } from '@/supabaseService';

export default function CourseSeriesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any | null>(null);
  const [year, setYear] = useState('2024');
  const [faculty, setFaculty] = useState('FMS');
  const [series, setSeries] = useState<any[]>([]);
  const [seriesOverview, setSeriesOverview] = useState<{ year: string; faculties: { faculty: string; count: number }[] }[]>([]);
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

      {/* Overview: faculties grouped by year — shown immediately */}
      <div className="space-y-6">
        {loading && seriesOverview.length === 0 ? (
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
                    <div key={f.faculty} className="p-4 border rounded flex items-center justify-between">
                      <div>
                        <div className="font-medium">{f.faculty}</div>
                        <div className="text-sm text-muted-foreground">{f.count} séries disponibles</div>
                      </div>
                      <div>
                        <Button size="sm" onClick={async () => {
                          setLoading(true);
                          try {
                            const s = await getSeriesByCourseYearFaculty(course!.name || course!.title, y.year, f.faculty);
                            setSeries(s);
                          } catch (e) {
                            console.error(e);
                            setError('Erreur lors du chargement des séries');
                          } finally {
                            setLoading(false);
                          }
                        }}>Explorer</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* If series loaded for a faculty, show them here */}
        {series.length > 0 && (
          <div>
            <h5 className="font-medium">Séries</h5>
            <div className="space-y-3 mt-2">
              {series.map(s => (
                <div key={s.id} className="p-4 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.objective}</div>
                    <div className="text-sm text-muted-foreground">{s.faculty} — {s.year}</div>
                  </div>
                  <div>
                    <Button onClick={() => navigate(`/series/${s.id}`)}>Explorer</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
