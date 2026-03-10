import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCourseById, getSeriesByCourseYearFaculty } from '@/supabaseService';

export default function CourseSeriesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any | null>(null);
  const [year, setYear] = useState('2024');
  const [faculty, setFaculty] = useState('FMS');
  const [series, setSeries] = useState<any[]>([]);
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
          <h2 className="text-xl font-semibold">{course?.name || course?.title}</h2>
          <p className="text-muted-foreground">Sélectionnez année et faculté puis chargez les séries disponibles</p>
        </CardContent>
      </Card>

      <div className="flex gap-3 items-center">
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

        <Button onClick={handleLoadSeries}>Charger séries</Button>
      </div>

      <div>
        {loading ? (
          <div>Chargement séries...</div>
        ) : series.length === 0 ? (
          <div className="text-muted-foreground">Aucune série trouvée</div>
        ) : (
          <div className="space-y-3">
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
        )}
      </div>
    </div>
  );
}
