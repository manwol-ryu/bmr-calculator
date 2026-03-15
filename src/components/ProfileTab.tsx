import { useState } from 'react';
import type { Gender, Goal, UserProfile } from '../types';
import { calculateBMR, calculateBaseTdee } from '../data/calc';

interface Props {
  profile: UserProfile | null;
  onSave: (profile: UserProfile, bmr: number, baseTdee: number) => void;
}

const GOALS: { value: Goal; label: string }[] = [
  { value: 'cut', label: '감량' },
  { value: 'maintain', label: '유지' },
  { value: 'bulk', label: '증량' },
];

export default function ProfileTab({ profile, onSave }: Props) {
  const [gender, setGender] = useState<Gender>(profile?.gender ?? 'male');
  const [age, setAge] = useState(profile?.age?.toString() ?? '');
  const [height, setHeight] = useState(profile?.heightCm?.toString() ?? '');
  const [weight, setWeight] = useState(profile?.weightKg?.toString() ?? '');
  const [goal, setGoal] = useState<Goal>(profile?.goal ?? 'maintain');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    const errs: Record<string, string> = {};
    const a = Number(age), h = Number(height), w = Number(weight);
    if (!age || a <= 0 || a > 120 || !Number.isInteger(a)) errs.age = '1~120 사이 정수';
    if (!height || h <= 0 || h > 300) errs.height = '1~300 사이 값';
    if (!weight || w <= 0 || w > 500) errs.weight = '1~500 사이 값';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const p: UserProfile = { gender, age: a, heightCm: h, weightKg: w, goal };
    const bmr = calculateBMR(gender, w, h, a);
    const baseTdee = calculateBaseTdee(bmr);
    onSave(p, Math.round(bmr), baseTdee);
  };

  return (
    <div className="card">
      <div className="form-group">
        <label id="gender-label">성별</label>
        <div className="gender-toggle" role="group" aria-labelledby="gender-label">
          <button type="button" className={gender === 'male' ? 'active' : ''} onClick={() => setGender('male')} aria-pressed={gender === 'male'}>남성</button>
          <button type="button" className={gender === 'female' ? 'active' : ''} onClick={() => setGender('female')} aria-pressed={gender === 'female'}>여성</button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="age">나이 (세)</label>
        <input id="age" type="number" className={errors.age ? 'error' : ''} value={age} onChange={e => setAge(e.target.value)} placeholder="25" min="1" max="120" />
        {errors.age && <div className="error-message" role="alert">{errors.age}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="height">키 (cm)</label>
        <input id="height" type="number" className={errors.height ? 'error' : ''} value={height} onChange={e => setHeight(e.target.value)} placeholder="175" min="1" max="300" />
        {errors.height && <div className="error-message" role="alert">{errors.height}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="weight">체중 (kg)</label>
        <input id="weight" type="number" className={errors.weight ? 'error' : ''} value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" min="1" max="500" />
        {errors.weight && <div className="error-message" role="alert">{errors.weight}</div>}
      </div>

      <div className="form-group">
        <label>목표</label>
        <div className="gender-toggle" role="group">
          {GOALS.map(g => (
            <button key={g.value} type="button" className={goal === g.value ? 'active' : ''} onClick={() => setGoal(g.value)} aria-pressed={goal === g.value}>{g.label}</button>
          ))}
        </div>
      </div>

      <button type="button" className="calculate-btn" onClick={handleSave}>저장하기</button>
    </div>
  );
}
