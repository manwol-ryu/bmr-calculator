import type { FoodDatabaseItem } from '../types';

export const FOODS: FoodDatabaseItem[] = [
  // 밥/면
  { id: 'rice', name: '공기밥', category: '밥/면', baseAmount: 210, unit: 'g', calories: 313, carbs: 68, protein: 5, fat: 1 },
  { id: 'brown-rice', name: '현미밥', category: '밥/면', baseAmount: 210, unit: 'g', calories: 295, carbs: 63, protein: 6, fat: 2 },
  { id: 'sweet-potato', name: '고구마', category: '밥/면', baseAmount: 130, unit: 'g', calories: 115, carbs: 27, protein: 1, fat: 0 },
  { id: 'oatmeal', name: '오트밀', category: '밥/면', baseAmount: 40, unit: 'g', calories: 154, carbs: 27, protein: 5, fat: 3 },
  { id: 'ramyun', name: '라면', category: '밥/면', baseAmount: 1, unit: 'serving', calories: 500, carbs: 75, protein: 10, fat: 17 },

  // 고기/단백질
  { id: 'chicken-breast', name: '닭가슴살', category: '고기/단백질', baseAmount: 100, unit: 'g', calories: 109, carbs: 0, protein: 23, fat: 1 },
  { id: 'egg', name: '계란', category: '고기/단백질', baseAmount: 60, unit: 'g', calories: 87, carbs: 1, protein: 7, fat: 6 },
  { id: 'salmon', name: '연어', category: '고기/단백질', baseAmount: 100, unit: 'g', calories: 208, carbs: 0, protein: 20, fat: 13 },
  { id: 'pork-belly', name: '삼겹살', category: '고기/단백질', baseAmount: 100, unit: 'g', calories: 518, carbs: 0, protein: 10, fat: 53 },
  { id: 'tofu', name: '두부', category: '고기/단백질', baseAmount: 100, unit: 'g', calories: 76, carbs: 2, protein: 8, fat: 4 },
  { id: 'beef-lean', name: '소고기 (안심)', category: '고기/단백질', baseAmount: 100, unit: 'g', calories: 173, carbs: 0, protein: 26, fat: 7 },

  // 유제품
  { id: 'milk', name: '우유', category: '유제품', baseAmount: 200, unit: 'ml', calories: 122, carbs: 10, protein: 6, fat: 6 },
  { id: 'greek-yogurt', name: '그릭요거트', category: '유제품', baseAmount: 100, unit: 'g', calories: 59, carbs: 4, protein: 10, fat: 0 },
  { id: 'protein-shake', name: '프로틴쉐이크', category: '유제품', baseAmount: 1, unit: 'serving', calories: 120, carbs: 3, protein: 24, fat: 1 },

  // 과일
  { id: 'banana', name: '바나나', category: '과일', baseAmount: 120, unit: 'g', calories: 105, carbs: 27, protein: 1, fat: 0 },
  { id: 'apple', name: '사과', category: '과일', baseAmount: 200, unit: 'g', calories: 104, carbs: 28, protein: 1, fat: 0 },

  // 간식/견과
  { id: 'almonds', name: '아몬드', category: '간식', baseAmount: 30, unit: 'g', calories: 174, carbs: 6, protein: 6, fat: 15 },
  { id: 'protein-bar', name: '프로틴바', category: '간식', baseAmount: 1, unit: 'serving', calories: 200, carbs: 22, protein: 20, fat: 7 },

  // 한식 반찬
  { id: 'kimchi-jjigae', name: '김치찌개', category: '한식', baseAmount: 1, unit: 'serving', calories: 200, carbs: 10, protein: 15, fat: 10 },
  { id: 'bibimbap', name: '비빔밥', category: '한식', baseAmount: 1, unit: 'serving', calories: 580, carbs: 82, protein: 22, fat: 16 },
  { id: 'kimchi', name: '김치', category: '한식', baseAmount: 50, unit: 'g', calories: 15, carbs: 3, protein: 1, fat: 0 },

  // 편의점
  { id: 'triangle-kimbap', name: '삼각김밥', category: '편의점', baseAmount: 1, unit: 'serving', calories: 190, carbs: 35, protein: 5, fat: 3 },
  { id: 'cup-ramyun', name: '컵라면', category: '편의점', baseAmount: 1, unit: 'serving', calories: 300, carbs: 42, protein: 7, fat: 12 },

  // 음료
  { id: 'americano', name: '아메리카노', category: '음료', baseAmount: 1, unit: 'serving', calories: 5, carbs: 1, protein: 0, fat: 0 },
  { id: 'latte', name: '카페라떼', category: '음료', baseAmount: 1, unit: 'serving', calories: 135, carbs: 12, protein: 7, fat: 6 },
];
