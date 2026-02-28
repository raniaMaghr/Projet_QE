/**
 * Données mock pour le planning
 */

import { PlanningEvent } from '../../types';

export const mockPlanningEvents: PlanningEvent[] = (() => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: 1,
      title: '📖 Révision Cardiologie',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      time: '09:00',
      duration: '2h',
      type: 'study',
      course: 'SCA - Syndrome Coronarien Aigu',
      priority: 'high',
      completed: false,
    },
    {
      id: 2,
      title: '✍️ QCM Pneumologie',
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      time: '14:30',
      duration: '1h30',
      type: 'practice',
      course: 'Série 2024 - Sousse',
      priority: 'medium',
      completed: false,
    },
    {
      id: 3,
      title: '🔄 Relecture Néphrologie',
      date: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()),
      time: '10:00',
      duration: '45min',
      type: 'review',
      course: 'IRA - Insuffisance Rénale Aiguë',
      priority: 'high',
      completed: false,
    },
    {
      id: 4,
      title: '🎯 Examen Blanc J1',
      date: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate()),
      time: '08:00',
      duration: '3h',
      type: 'exam',
      course: 'Simulation complète FMT',
      priority: 'high',
      completed: false,
    },
    {
      id: 5,
      title: '📖 Cours Gastro-entérologie',
      date: new Date(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate()),
      time: '09:00',
      duration: '2h',
      type: 'study',
      course: 'MICI - Maladies Inflammatoires Chroniques Intestinales',
      priority: 'medium',
      completed: false,
    },
  ];
})();
