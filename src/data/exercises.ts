import type { ExerciseDefinition } from '../types';

export const EXERCISES: ExerciseDefinition[] = [
  { id: 'walk', name: '걷기 (빠르게)', met: 4.3 },
  { id: 'run8', name: '러닝 (8km/h)', met: 8.3 },
  { id: 'run10', name: '러닝 (10km/h)', met: 9.8 },
  { id: 'bike', name: '자전거 (보통)', met: 7.5 },
  { id: 'weight-med', name: '웨이트 트레이닝 (보통)', met: 5.0 },
  { id: 'weight-hard', name: '웨이트 트레이닝 (강함)', met: 6.0 },
  { id: 'swim', name: '수영 (자유형)', met: 8.0 },
  { id: 'hiit', name: 'HIIT', met: 10.0 },
  { id: 'yoga', name: '요가', met: 3.0 },
  { id: 'pilates', name: '필라테스', met: 3.5 },
  { id: 'jump-rope', name: '줄넘기', met: 11.0 },
  { id: 'stairs', name: '계단 오르기', met: 8.8 },
];

const INTENSITY_MULTIPLIER = { low: 0.8, medium: 1.0, high: 1.2 } as const;

export function calcExerciseCalories(
  met: number,
  weightKg: number,
  durationMin: number,
  intensity: 'low' | 'medium' | 'high',
): number {
  return Math.round(met * weightKg * (durationMin / 60) * INTENSITY_MULTIPLIER[intensity]);
}
