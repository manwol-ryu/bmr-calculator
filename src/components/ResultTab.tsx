import type { DailySummary } from '../types';
import { getRecommendations } from '../data/calc';

interface Props {
  summary: DailySummary | null;
}

function ProgressBar({ label, current, target, color, unit }: {
  label: string; current: number; target: number; color: string; unit: string;
}) {
  const pct = target > 0 ? (current / target) * 100 : 0;
  const over = current > target;
  return (
    <div className="progress-group">
      <div className="progress-header">
        <span>{label}</span>
        <span className={over ? 'over' : ''}>{Math.round(current)} / {target} {unit}</span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${Math.min(pct, 100)}%`, background: over ? '#E25555' : color }} />
        {over && (
          <div className="progress-overflow" style={{ width: `${Math.min(pct - 100, 50)}%` }} />
        )}
      </div>
    </div>
  );
}

export default function ResultTab({ summary }: Props) {
  if (!summary) {
    return <div className="card"><p className="empty-state">기본정보를 먼저 입력해주세요.</p></div>;
  }

  const { bmr, baseTdee, exerciseCalories, adjustedTdee, intakeCalories, remainingCalories, intakeCarbs, intakeProtein, intakeFat, targetProtein, targetCarbs, targetFat } = summary;

  const status = remainingCalories > 100 ? 'deficit' : remainingCalories < -100 ? 'surplus' : 'on-track';
  const statusLabel = { deficit: '부족', surplus: '초과', 'on-track': '적정' }[status];
  const statusColor = { deficit: '#F4B740', surplus: '#E25555', 'on-track': '#2FBF71' }[status];

  const recs = getRecommendations(intakeProtein, targetProtein, intakeCarbs, targetCarbs, intakeFat, targetFat);

  return (
    <div>
      <div className="card summary-card">
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">BMR</span>
            <span className="summary-value">{bmr.toLocaleString()}</span>
            <span className="summary-unit">kcal</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">기본 TDEE</span>
            <span className="summary-value">{baseTdee.toLocaleString()}</span>
            <span className="summary-unit">kcal</span>
          </div>
          <div className="summary-item exercise-highlight">
            <span className="summary-label">운동 소모</span>
            <span className="summary-value">+{exerciseCalories}</span>
            <span className="summary-unit">kcal</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">목표 섭취</span>
            <span className="summary-value">{adjustedTdee.toLocaleString()}</span>
            <span className="summary-unit">kcal</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">칼로리 현황</h3>
        <div className="calorie-status">
          <div className="calorie-main">
            <span className="calorie-remaining" style={{ color: statusColor }}>{Math.abs(remainingCalories)}</span>
            <span className="calorie-remaining-label">kcal {statusLabel}</span>
          </div>
          <div className="calorie-breakdown">
            <span>목표 {adjustedTdee} - 섭취 {intakeCalories} = {remainingCalories > 0 ? `${remainingCalories} 남음` : `${Math.abs(remainingCalories)} 초과`}</span>
          </div>
        </div>
        <ProgressBar label="칼로리" current={intakeCalories} target={adjustedTdee} color="#4361ee" unit="kcal" />
      </div>

      <div className="card">
        <h3 className="section-title">영양소 현황</h3>
        <ProgressBar label="탄수화물" current={intakeCarbs} target={targetCarbs} color="#F4B740" unit="g" />
        <ProgressBar label="단백질" current={intakeProtein} target={targetProtein} color="#2FBF71" unit="g" />
        <ProgressBar label="지방" current={intakeFat} target={targetFat} color="#FF7A59" unit="g" />
      </div>

      {recs.length > 0 && (
        <div className="card">
          <h3 className="section-title">추천</h3>
          {recs.map(r => (
            <div key={r.nutrient} className="rec-card">
              <div className="rec-header">{r.nutrient} {r.deficit}{r.unit} 부족</div>
              <div className="rec-items">
                {r.suggestions.map(s => <span key={s} className="rec-chip">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="disclaimer" role="note">
        ⚠️ 본 계산기는 Mifflin-St Jeor 공식과 MET 기반 추정값입니다.
        의료적 판단이나 진단 목적으로 사용할 수 없으며, 정확한 건강 상담은
        의료 전문가와 상의하시기 바랍니다.
      </div>
    </div>
  );
}
