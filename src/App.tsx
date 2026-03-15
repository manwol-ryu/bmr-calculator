import { useState } from 'react';

type Gender = 'male' | 'female';

interface FormErrors {
  age?: string;
  height?: string;
  weight?: string;
}

const ACTIVITY_LEVELS = [
  { value: 1.2, label: '비활동적 (운동 거의 안 함)' },
  { value: 1.375, label: '가벼운 활동 (주 1~3회 운동)' },
  { value: 1.55, label: '보통 활동 (주 3~5회 운동)' },
  { value: 1.725, label: '활발한 활동 (주 6~7회 운동)' },
  { value: 1.9, label: '매우 활발 (하루 2회 이상 운동)' },
];

function calculateBMR(gender: Gender, weight: number, height: number, age: number): number {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

function validate(age: string, height: string, weight: string): FormErrors {
  const errors: FormErrors = {};
  const ageNum = Number(age);
  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (!age || ageNum <= 0 || ageNum > 120 || !Number.isInteger(ageNum)) {
    errors.age = '1~120 사이의 정수를 입력하세요';
  }
  if (!height || heightNum <= 0 || heightNum > 300) {
    errors.height = '1~300 사이의 값을 입력하세요';
  }
  if (!weight || weightNum <= 0 || weightNum > 500) {
    errors.weight = '1~500 사이의 값을 입력하세요';
  }

  return errors;
}

export default function App() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState(1.55);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null);

  const handleCalculate = () => {
    const validationErrors = validate(age, height, weight);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setResult(null);
      return;
    }

    const bmr = calculateBMR(gender, Number(weight), Number(height), Number(age));
    const tdee = bmr * activity;
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee) });
  };

  return (
    <div className="container">
      <h1>기초대사량(BMR) 계산기</h1>

      <div className="card">
        <div className="form-group">
          <label id="gender-label">성별</label>
          <div className="gender-toggle" role="group" aria-labelledby="gender-label">
            <button
              type="button"
              className={gender === 'male' ? 'active' : ''}
              onClick={() => setGender('male')}
              aria-pressed={gender === 'male'}
            >
              남성
            </button>
            <button
              type="button"
              className={gender === 'female' ? 'active' : ''}
              onClick={() => setGender('female')}
              aria-pressed={gender === 'female'}
            >
              여성
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="age">나이 (세)</label>
          <input
            id="age"
            type="number"
            className={errors.age ? 'error' : ''}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="25"
            min="1"
            max="120"
            aria-describedby={errors.age ? 'age-error' : undefined}
          />
          {errors.age && <div id="age-error" className="error-message" role="alert">{errors.age}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="height">키 (cm)</label>
          <input
            id="height"
            type="number"
            className={errors.height ? 'error' : ''}
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            min="1"
            max="300"
            aria-describedby={errors.height ? 'height-error' : undefined}
          />
          {errors.height && <div id="height-error" className="error-message" role="alert">{errors.height}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="weight">체중 (kg)</label>
          <input
            id="weight"
            type="number"
            className={errors.weight ? 'error' : ''}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            min="1"
            max="500"
            aria-describedby={errors.weight ? 'weight-error' : undefined}
          />
          {errors.weight && <div id="weight-error" className="error-message" role="alert">{errors.weight}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="activity">활동 수준</label>
          <select
            id="activity"
            className="activity-select"
            value={activity}
            onChange={(e) => setActivity(Number(e.target.value))}
          >
            {ACTIVITY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="calculate-btn"
          onClick={handleCalculate}
        >
          계산하기
        </button>
      </div>

      {result && (
        <div className="card results" role="region" aria-label="계산 결과">
          <h2>계산 결과</h2>
          <div className="result-row">
            <span className="result-label">기초대사량 (BMR)</span>
            <span className="result-value">{result.bmr.toLocaleString()} kcal</span>
          </div>
          <div className="result-row">
            <span className="result-label">총 일일 에너지 소비량 (TDEE)</span>
            <span className="result-value">{result.tdee.toLocaleString()} kcal</span>
          </div>
        </div>
      )}

      <div className="disclaimer" role="note">
        ⚠️ 본 계산기는 Mifflin-St Jeor 공식을 기반으로 한 추정값입니다.
        의료적 판단이나 진단 목적으로 사용할 수 없으며, 정확한 건강 상담은
        의료 전문가와 상의하시기 바랍니다.
      </div>
    </div>
  );
}
