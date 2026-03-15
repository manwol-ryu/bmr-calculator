import { useState } from 'react';
import type { FoodEntry, MealTime } from '../types';
import { MEAL_LABELS } from '../types';
import { FOODS } from '../data/foods';

interface Props {
  foods: FoodEntry[];
  onAdd: (entry: FoodEntry) => void;
  onRemove: (id: string) => void;
}

const MEAL_ORDER: MealTime[] = ['breakfast', 'lunch', 'dinner', 'snack', 'custom'];

function getMealIcon(meal: MealTime): string {
  return { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍪', custom: '⏰' }[meal];
}

type InputMode = 'search' | 'manual';

export default function FoodTab({ foods, onAdd, onRemove }: Props) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('1');
  const [mealTime, setMealTime] = useState<MealTime>('breakfast');
  const [customTime, setCustomTime] = useState('');
  const [inputMode, setInputMode] = useState<InputMode>('search');

  // Manual entry state
  const [manualName, setManualName] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualFat, setManualFat] = useState('');

  const filtered = search
    ? FOODS.filter(f => f.name.includes(search) || f.category.includes(search))
    : FOODS;

  const handleAdd = () => {
    const food = FOODS.find(f => f.id === selectedId);
    if (!food || !amount || Number(amount) <= 0) return;
    if (mealTime === 'custom' && !customTime) return;

    const multiplier = food.unit === 'serving' ? Number(amount) : Number(amount) / food.baseAmount;
    const entry: FoodEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      name: food.name,
      amount: Number(amount),
      calories: Math.round(food.calories * multiplier),
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      protein: Math.round(food.protein * multiplier * 10) / 10,
      fat: Math.round(food.fat * multiplier * 10) / 10,
      mealTime,
      customTime: mealTime === 'custom' ? customTime : undefined,
    };
    onAdd(entry);
    setSearch('');
    setSelectedId('');
    setAmount('1');
  };

  const handleManualAdd = () => {
    if (!manualName.trim() || !manualCalories || Number(manualCalories) <= 0) return;
    if (mealTime === 'custom' && !customTime) return;

    const entry: FoodEntry = {
      id: Date.now().toString(),
      foodId: 'custom',
      name: manualName.trim(),
      amount: 1,
      calories: Math.round(Number(manualCalories)),
      carbs: manualCarbs ? Math.round(Math.max(0, Number(manualCarbs)) * 10) / 10 : 0,
      protein: manualProtein ? Math.round(Math.max(0, Number(manualProtein)) * 10) / 10 : 0,
      fat: manualFat ? Math.round(Math.max(0, Number(manualFat)) * 10) / 10 : 0,
      mealTime,
      customTime: mealTime === 'custom' ? customTime : undefined,
    };
    onAdd(entry);
    setManualName('');
    setManualCalories('');
    setManualCarbs('');
    setManualProtein('');
    setManualFat('');
  };

  const selectedFood = FOODS.find(f => f.id === selectedId);
  const totalCal = foods.reduce((s, f) => s + f.calories, 0);
  const totalCarbs = foods.reduce((s, f) => s + f.carbs, 0);
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const totalFat = foods.reduce((s, f) => s + f.fat, 0);

  const grouped = MEAL_ORDER
    .map(meal => ({ meal, items: foods.filter(f => f.mealTime === meal) }))
    .filter(g => g.items.length > 0);

  return (
    <div>
      <div className="card">
        <div className="form-group">
          <label>식사 시간</label>
          <div className="meal-toggle">
            {MEAL_ORDER.map(m => (
              <button
                key={m}
                type="button"
                className={`meal-chip ${mealTime === m ? 'active' : ''}`}
                onClick={() => setMealTime(m)}
              >
                <span className="meal-icon">{getMealIcon(m)}</span>
                {MEAL_LABELS[m]}
              </button>
            ))}
          </div>
          {mealTime === 'custom' && (
            <div>
              <input
                type="time"
                className={`time-input${mealTime === 'custom' && !customTime ? ' error' : ''}`}
                value={customTime}
                onChange={e => setCustomTime(e.target.value)}
                required
              />
              {!customTime && <div className="error-message">시간을 입력해주세요</div>}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>입력 방식</label>
          <div className="input-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${inputMode === 'search' ? 'active' : ''}`}
              onClick={() => setInputMode('search')}
            >
              목록에서 선택
            </button>
            <button
              type="button"
              className={`mode-btn ${inputMode === 'manual' ? 'active' : ''}`}
              onClick={() => setInputMode('manual')}
            >
              직접 입력
            </button>
          </div>
        </div>

        {inputMode === 'search' && (
          <>
            <div className="form-group">
              <label htmlFor="food-search">음식 검색</label>
              <input id="food-search" type="text" value={search} onChange={e => { setSearch(e.target.value); setSelectedId(''); }} placeholder="음식 이름 또는 카테고리" />
            </div>

            <div className="food-grid">
              {filtered.slice(0, 12).map(f => (
                <button
                  key={f.id}
                  type="button"
                  className={`food-chip ${selectedId === f.id ? 'active' : ''}`}
                  onClick={() => { setSelectedId(f.id); setAmount(f.unit === 'serving' ? '1' : String(f.baseAmount)); }}
                >
                  {f.name}
                  <span className="food-chip-cal">{f.calories}kcal</span>
                </button>
              ))}
            </div>

            {selectedFood && (
              <div className="food-selected">
                <div className="food-selected-name">{selectedFood.name}</div>
                <div className="food-selected-info">
                  기준: {selectedFood.baseAmount}{selectedFood.unit} | {selectedFood.calories}kcal
                  <span className="macro-mini"> C{selectedFood.carbs} P{selectedFood.protein} F{selectedFood.fat}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="food-amount">수량 ({selectedFood.unit === 'serving' ? '인분' : selectedFood.unit})</label>
                  <input id="food-amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} min="1" step={selectedFood.unit === 'serving' ? '1' : '10'} />
                </div>
                <button type="button" className="calculate-btn food-btn" onClick={handleAdd}>
                  {getMealIcon(mealTime)} {MEAL_LABELS[mealTime]}에 추가
                </button>
              </div>
            )}
          </>
        )}

        {inputMode === 'manual' && (
          <div className="manual-entry">
            <div className="form-group">
              <label htmlFor="manual-name">음식 이름 *</label>
              <input id="manual-name" type="text" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="예: 된장찌개" />
            </div>
            <div className="form-group">
              <label htmlFor="manual-cal">칼로리 (kcal) *</label>
              <input id="manual-cal" type="number" value={manualCalories} onChange={e => setManualCalories(e.target.value)} placeholder="0" min="0" />
            </div>
            <div className="macro-inputs">
              <div className="form-group">
                <label htmlFor="manual-carbs">탄수화물 (g)</label>
                <input id="manual-carbs" type="number" value={manualCarbs} onChange={e => setManualCarbs(e.target.value)} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="manual-protein">단백질 (g)</label>
                <input id="manual-protein" type="number" value={manualProtein} onChange={e => setManualProtein(e.target.value)} placeholder="0" min="0" />
              </div>
              <div className="form-group">
                <label htmlFor="manual-fat">지방 (g)</label>
                <input id="manual-fat" type="number" value={manualFat} onChange={e => setManualFat(e.target.value)} placeholder="0" min="0" />
              </div>
            </div>
            <button
              type="button"
              className="calculate-btn food-btn"
              onClick={handleManualAdd}
              disabled={!manualName.trim() || !manualCalories || Number(manualCalories) <= 0}
            >
              {getMealIcon(mealTime)} {MEAL_LABELS[mealTime]}에 추가
            </button>
          </div>
        )}
      </div>

      {grouped.length > 0 && (
        <div className="card">
          <h3 className="section-title">오늘의 식단</h3>
          {grouped.map(({ meal, items }) => {
            const mealCal = items.reduce((s, f) => s + f.calories, 0);
            return (
              <div key={meal} className="meal-group">
                <div className="meal-group-header">
                  <span>{getMealIcon(meal)} {MEAL_LABELS[meal]}</span>
                  <span className="meal-group-cal">{mealCal} kcal</span>
                </div>
                <div className="entry-list">
                  {items.map(f => (
                    <div key={f.id} className="entry-item">
                      <div className="entry-info">
                        <span className="entry-name">
                          {f.name}
                          {f.customTime && <span className="entry-time">{f.customTime}</span>}
                        </span>
                        <span className="entry-detail">C{f.carbs}g P{f.protein}g F{f.fat}g</span>
                      </div>
                      <span className="entry-cal food-cal">+{f.calories} kcal</span>
                      <button type="button" className="remove-btn" onClick={() => onRemove(f.id)} aria-label={`${f.name} 삭제`}>×</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="entry-total food-total">
            총 섭취: {totalCal} kcal (C{Math.round(totalCarbs)}g P{Math.round(totalProtein)}g F{Math.round(totalFat)}g)
          </div>
        </div>
      )}
    </div>
  );
}
