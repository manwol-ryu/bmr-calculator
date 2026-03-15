import { useState } from 'react';
import type { ExerciseEntry, Intensity } from '../types';
import { EXERCISES, calcExerciseCalories } from '../data/exercises';

interface Props {
  weightKg: number;
  exercises: ExerciseEntry[];
  onAdd: (entry: ExerciseEntry) => void;
  onRemove: (id: string) => void;
}

const INTENSITIES: { value: Intensity; label: string }[] = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
];

export default function ExerciseTab({ weightKg, exercises, onAdd, onRemove }: Props) {
  const [selectedId, setSelectedId] = useState(EXERCISES[0].id);
  const [duration, setDuration] = useState('30');
  const [intensity, setIntensity] = useState<Intensity>('medium');

  const handleAdd = () => {
    const def = EXERCISES.find(e => e.id === selectedId);
    if (!def || !duration || Number(duration) <= 0) return;

    const cal = calcExerciseCalories(def.met, weightKg, Number(duration), intensity);
    const entry: ExerciseEntry = {
      id: Date.now().toString(),
      defId: def.id,
      name: def.name,
      met: def.met,
      durationMin: Number(duration),
      intensity,
      calories: cal,
    };
    onAdd(entry);
  };

  const totalCal = exercises.reduce((s, e) => s + e.calories, 0);

  return (
    <div>
      <div className="card">
        <div className="form-group">
          <label htmlFor="exercise-select">운동 선택</label>
          <select id="exercise-select" className="activity-select" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {EXERCISES.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name} (MET {ex.met})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duration">시간 (분)</label>
          <input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="30" min="1" max="300" />
        </div>

        <div className="form-group">
          <label>강도</label>
          <div className="gender-toggle" role="group">
            {INTENSITIES.map(i => (
              <button key={i.value} type="button" className={intensity === i.value ? 'active intensity-' + i.value : ''} onClick={() => setIntensity(i.value)} aria-pressed={intensity === i.value}>{i.label}</button>
            ))}
          </div>
        </div>

        <button type="button" className="calculate-btn exercise-btn" onClick={handleAdd}>운동 추가</button>
      </div>

      {exercises.length > 0 && (
        <div className="card">
          <h3 className="section-title">오늘의 운동</h3>
          <div className="entry-list">
            {exercises.map(ex => (
              <div key={ex.id} className="entry-item">
                <div className="entry-info">
                  <span className="entry-name">{ex.name}</span>
                  <span className="entry-detail">{ex.durationMin}분 · {ex.intensity === 'low' ? '낮음' : ex.intensity === 'medium' ? '보통' : '높음'}</span>
                </div>
                <span className="entry-cal exercise-cal">-{ex.calories} kcal</span>
                <button type="button" className="remove-btn" onClick={() => onRemove(ex.id)} aria-label={`${ex.name} 삭제`}>×</button>
              </div>
            ))}
          </div>
          <div className="entry-total exercise-total">총 소모: {totalCal} kcal</div>
        </div>
      )}
    </div>
  );
}
