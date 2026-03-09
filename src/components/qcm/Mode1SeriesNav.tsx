import React, { useEffect, useState } from 'react';
import { getSpecialtiesByLevel, getCoursesBySpecialtyAndLevel, getSeriesByCourseYearFaculty } from '../../supabaseService';
import { Button } from '../ui/button';

type Level = 'J1' | 'J2';

export default function Mode1SeriesNav() {
  const [level, setLevel] = useState<Level>('J1');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [year, setYear] = useState<string>('2024');
  const [faculty, setFaculty] = useState<string>('FMS');
  const [series, setSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpecialties(level);
  }, [level]);

  async function fetchSpecialties(lvl: Level) {
    setLoading(true);
    try {
      const specs = await getSpecialtiesByLevel(lvl);
      setSpecialties(specs);
      setSelectedSpecialty(null);
      setCourses([]);
      setSelectedCourse(null);
      setSeries([]);
    } catch (err) {
      console.error('Erreur getSpecialtiesByLevel', err);
    } finally {
      setLoading(false);
    }
  }

  async function onSelectSpecialty(spec: string) {
    setSelectedSpecialty(spec);
    setLoading(true);
    try {
      const cs = await getCoursesBySpecialtyAndLevel(spec, level);
      setCourses(cs);
      setSelectedCourse(null);
      setSeries([]);
    } catch (err) {
      console.error('Erreur getCoursesBySpecialtyAndLevel', err);
    } finally {
      setLoading(false);
    }
  }

  async function onSelectCourse(course: any) {
    setSelectedCourse(course);
    setSeries([]);
  }

  async function fetchSeriesForCourse() {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const s = await getSeriesByCourseYearFaculty(selectedCourse.name, year, faculty);
      setSeries(s);
    } catch (err) {
      console.error('Erreur getSeriesByCourseYearFaculty', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mode1-series-nav p-4">
      <h2 className="text-lg font-semibold mb-3">Mode 1 — Séries par année / faculté</h2>

      <div className="mb-4 flex gap-2">
        <Button variant={level === 'J1' ? 'default' : 'ghost'} onClick={() => setLevel('J1')}>Jour 1 (J1)</Button>
        <Button variant={level === 'J2' ? 'default' : 'ghost'} onClick={() => setLevel('J2')}>Jour 2 (J2)</Button>
      </div>

      <section className="mb-6">
        <h3 className="font-medium">Spécialités</h3>
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
      </section>

      {selectedSpecialty && (
        <section className="mb-6">
          <h3 className="font-medium">Cours — {selectedSpecialty}</h3>
          {loading && courses.length === 0 ? (
            <div>Chargement...</div>
          ) : (
            <div className="mt-2 space-y-2">
              {courses.map(c => (
                <div key={c.id} className={`p-3 rounded border flex justify-between items-center ${selectedCourse?.id === c.id ? 'bg-muted' : 'bg-white'}`}>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.level} — {c.specialty}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => onSelectCourse(c)}>Sélectionner</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {selectedCourse && (
        <section className="mb-6">
          <h3 className="font-medium">Filtrer séries pour : {selectedCourse.name}</h3>
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

            <Button onClick={fetchSeriesForCourse}>Charger séries</Button>
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
        </section>
      )}
    </div>
  );
}
