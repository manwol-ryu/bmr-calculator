import { useState } from 'react';
import type { FoodEntry } from '../types';
import { FOODS } from '../data/foods';

interface Props {
  foods: FoodEntry[];
  onAdd: (entry: FoodEntry) => void;
  onRemove: (id: string) => void;
}

export default function FoodTab({ foods, onAdd, onRemove }: Props) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [amount, setAmount] = useState('1');

  const filtered = search
    ? FOODS.filter(f => f.name.includes(search) || f.category.includes(search))
    : FOODS;

  const handleAdd = () => {
    const food = FOODS.find(f => f.id === selectedId);
    if (!food || !amount || Number(amount) <= 0) return;

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
    };
    onAdd(entry);
    setSearch('');
    setSelectedId('');
    setAmount('1');
  };

  const selectedFood = FOODS.find(f => f.id === selectedId);
  const totalCal = foods.reduce((s, f) => s + f.calories, 0);
  const totalCarbs = foods.reduce((s, f) => s + f.carbs, 0);
  const totalProtein = foods.reduce((s, f) => s + f.protein, 0);
  const totalFat = foods.reduce((s, f) => s + f.fat, 0);

  return (
    <div>
      <div className="card">
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
            <button type="button" className="calculate-btn food-btn" onClick={handleAdd}>식단 추가</button>
          </div>
        )}
      </div>

      {foods.length > 0 && (
        <div className="card">
          <h3 className="section-title">오늘의 식단</h3>
          <div className="entry-list">
            {foods.map(f => (
              <div key={f.id} className="entry-item">
                <div className="entry-info">
                  <span className="entry-name">{f.name}</span>
                  <span className="entry-detail">C{f.carbs}g P{f.protein}g F{f.fat}g</span>
                </div>
                <span className="entry-cal food-cal">+{f.calories} kcal</span>
                <button type="button" className="remove-btn" onClick={() => onRemove(f.id)} aria-label={`${f.name} 삭제`}>×</button>
              </div>
            ))}
          </div>
          <div className="entry-total food-total">
            총 섭취: {totalCal} kcal (C{Math.round(totalCarbs)}g P{Math.round(totalProtein)}g F{Math.round(totalFat)}g)
          </div>
        </div>
      )}
    </div>
  );
}
