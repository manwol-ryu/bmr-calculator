export type Gender = 'male' | 'female';
export type Goal = 'cut' | 'maintain' | 'bulk';
export type Intensity = 'low' | 'medium' | 'high';
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'custom';

export const MEAL_LABELS: Record<MealTime, string> = {
  breakfast: '아침',
  lunch: '점심',
  dinner: '저녁',
  snack: '간식',
  custom: '기타',
};

export interface UserProfile {
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activityFactor: number;
  goal: Goal;
}

export interface ExerciseDefinition {
  id: string;
  name: string;
  met: number;
}

export interface ExerciseEntry {
  id: string;
  defId: string;
  name: string;
  met: number;
  durationMin: number;
  intensity: Intensity;
  calories: number;
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  category: string;
  baseAmount: number;
  unit: 'g' | 'ml' | 'serving';
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  foodId: string;
  name: string;
  amount: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  mealTime: MealTime;
  customTime?: string;
}

export interface DailySummary {
  bmr: number;
  baseTdee: number;
  exerciseCalories: number;
  adjustedTdee: number;
  intakeCalories: number;
  remainingCalories: number;
  intakeCarbs: number;
  intakeProtein: number;
  intakeFat: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}
