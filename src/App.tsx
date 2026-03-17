import { useState, useMemo } from 'react';
import type { UserProfile, ExerciseEntry, FoodEntry, DailySummary } from './types';
import { getGoalCalorieAdjustment, getProteinTarget, getFatTarget, getCarbsTarget } from './data/calc';
import ProfileTab from './components/ProfileTab';
import ExerciseTab from './components/ExerciseTab';
import FoodTab from './components/FoodTab';
import ResultTab from './components/ResultTab';

type Tab = 'profile' | 'exercise' | 'food' | 'result';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: '기본정보' },
  { id: 'exercise', label: '운동' },
  { id: 'food', label: '식단' },
  { id: 'result', label: '결과' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [bmr, setBmr] = useState(0);
  const [baseTdee, setBaseTdee] = useState(0);
  const [exercises, setExercises] = useState<ExerciseEntry[]>([]);
  const [foods, setFoods] = useState<FoodEntry[]>([]);

  const handleProfileSave = (p: UserProfile, b: number, t: number) => {
    setProfile(p);
    setBmr(b);
    setBaseTdee(t);
    setTab('exercise');
  };

  const exerciseCalories = exercises.reduce((s, e) => s + e.calories, 0);

  const summary: DailySummary | null = useMemo(() => {
    if (!profile) return null;
    const adjustedTdee = baseTdee + exerciseCalories + getGoalCalorieAdjustment(profile.goal, baseTdee + exerciseCalories);
    const intakeCalories = foods.reduce((s, f) => s + f.calories, 0);
    const intakeCarbs = foods.reduce((s, f) => s + f.carbs, 0);
    const intakeProtein = foods.reduce((s, f) => s + f.protein, 0);
    const intakeFat = foods.reduce((s, f) => s + f.fat, 0);
    const targetProtein = getProteinTarget(profile.weightKg, profile.goal);
    const targetFat = getFatTarget(profile.weightKg);
    const targetCarbs = getCarbsTarget(adjustedTdee, targetProtein, targetFat);
    return {
      bmr, baseTdee, exerciseCalories, adjustedTdee,
      intakeCalories, remainingCalories: adjustedTdee - intakeCalories,
      intakeCarbs, intakeProtein, intakeFat,
      targetProtein, targetCarbs, targetFat,
    };
  }, [profile, bmr, baseTdee, exerciseCalories, foods]);

  return (
    <div className="container">
      <h1>에너지 & 식단 관리</h1>

      <nav className="tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {summary && tab !== 'result' && (
        <div className="mini-summary">
          <span>목표 {summary.adjustedTdee} kcal</span>
          <span>섭취 {summary.intakeCalories} kcal</span>
          <span className={summary.remainingCalories < 0 ? 'over' : ''}>
            남은 {summary.remainingCalories} kcal
          </span>
        </div>
      )}

      <div role="tabpanel">
        {tab === 'profile' && <ProfileTab profile={profile} onSave={handleProfileSave} />}
        {tab === 'exercise' && (
          profile
            ? <ExerciseTab
                weightKg={profile.weightKg}
                exercises={exercises}
                onAdd={e => setExercises(prev => [...prev, e])}
                onRemove={id => setExercises(prev => prev.filter(e => e.id !== id))}
              />
            : <div className="card"><p className="empty-state">기본정보를 먼저 입력해주세요.</p></div>
        )}
        {tab === 'food' && (
          <FoodTab
            foods={foods}
            onAdd={f => setFoods(prev => [...prev, f])}
            onRemove={id => setFoods(prev => prev.filter(f => f.id !== id))}
          />
        )}
        {tab === 'result' && <ResultTab summary={summary} />}
      </div>
    </div>
  );
}
