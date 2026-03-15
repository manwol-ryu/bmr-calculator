import type { Gender, Goal } from '../types';

export function calculateBMR(gender: Gender, weightKg: number, heightCm: number, age: number): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

const BASE_ACTIVITY_FACTOR = 1.2; // sedentary baseline

export function calculateBaseTdee(bmr: number): number {
  return Math.round(bmr * BASE_ACTIVITY_FACTOR);
}

export function getGoalCalorieAdjustment(goal: Goal, tdee: number): number {
  switch (goal) {
    case 'cut': return Math.round(tdee * -0.2); // -20%
    case 'bulk': return Math.round(tdee * 0.15); // +15%
    default: return 0;
  }
}

export function getProteinTarget(weightKg: number, goal: Goal): number {
  const multiplier = { cut: 2.0, maintain: 1.6, bulk: 1.8 };
  return Math.round(weightKg * multiplier[goal]);
}

export function getFatTarget(weightKg: number): number {
  return Math.round(weightKg * 0.8); // 0.8g per kg minimum
}

export function getCarbsTarget(totalCalories: number, proteinG: number, fatG: number): number {
  const proteinCal = proteinG * 4;
  const fatCal = fatG * 9;
  const carbsCal = totalCalories - proteinCal - fatCal;
  return Math.max(0, Math.round(carbsCal / 4));
}

export interface Recommendation {
  nutrient: string;
  deficit: number;
  unit: string;
  suggestions: string[];
}

export function getRecommendations(
  intakeProtein: number, targetProtein: number,
  intakeCarbs: number, targetCarbs: number,
  intakeFat: number, targetFat: number,
): Recommendation[] {
  const recs: Recommendation[] = [];

  const proteinDef = targetProtein - intakeProtein;
  if (proteinDef > 5) {
    recs.push({
      nutrient: '단백질',
      deficit: proteinDef,
      unit: 'g',
      suggestions: ['닭가슴살 100g', '계란 2개', '그릭요거트 150g'],
    });
  }

  const carbsDef = targetCarbs - intakeCarbs;
  if (carbsDef > 10) {
    recs.push({
      nutrient: '탄수화물',
      deficit: carbsDef,
      unit: 'g',
      suggestions: ['고구마 1개', '바나나 1개', '현미밥 1공기'],
    });
  }

  const fatDef = targetFat - intakeFat;
  if (fatDef > 5) {
    recs.push({
      nutrient: '지방',
      deficit: fatDef,
      unit: 'g',
      suggestions: ['아몬드 30g', '연어 100g', '아보카도 반개'],
    });
  }

  return recs;
}
