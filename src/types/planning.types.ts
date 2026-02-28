/**
 * Types pour le système de planning et calendrier
 */

export type EventType = 'study' | 'practice' | 'review' | 'exam';
export type Priority = 'low' | 'medium' | 'high';
export type PlanningView = 'month' | 'week' | 'agenda';

export interface PlanningEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  duration: string;
  type: EventType;
  course: string;
  priority: Priority;
  completed: boolean;
  description?: string;
  tags?: string[];
}

export interface CalendarDay {
  date: Date;
  events: PlanningEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
