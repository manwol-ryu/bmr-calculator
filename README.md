# BMR Calculator - 기초대사량 계산기

Mifflin-St Jeor 공식 기반의 기초대사량(BMR) 및 총 일일 에너지 소비량(TDEE) 계산기.

## 기능

- 성별, 나이, 키, 체중, 활동 수준 기반 BMR/TDEE 계산
- Mifflin-St Jeor 공식 사용
  - 남성: `10W + 6.25H - 5A + 5`
  - 여성: `10W + 6.25H - 5A - 161`
- TDEE = BMR × 활동계수 (1.2 / 1.375 / 1.55 / 1.725 / 1.9)
- 반응형 UI (모바일 지원)
- 입력값 검증 및 에러 표시
- 접근성 지원 (ARIA 속성)
- 의료 고지문 포함

## 스택

- React 19 + TypeScript
- Vite 8

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 정적 호스팅 배포

```bash
npm run build
# dist/ 폴더를 정적 호스팅 서비스에 업로드
```
