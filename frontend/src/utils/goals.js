import { Beef, Candy, Droplets, Scale } from 'lucide-react'

export const GOAL_META = {
  diet: {
    id: 'diet',
    label: '다이어트',
    description: '칼로리는 낮추고, 영양은 균형있게',
    Icon: Scale,
  },
  high_protein: {
    id: 'high_protein',
    label: '고단백 식단',
    description: '단백질은 높이고, 건강한 근육을 위해',
    Icon: Beef,
  },
  low_sodium: {
    id: 'low_sodium',
    label: '저염식',
    description: '나트륨은 낮추고, 건강한 식습관을 위해',
    Icon: Droplets,
  },
  low_sugar: {
    id: 'low_sugar',
    label: '저당식',
    description: '당류는 낮추고, 가볍고 건강하게',
    Icon: Candy,
  },
}

export function getGoalMeta(goalId) {
  return GOAL_META[goalId] || GOAL_META.diet
}

export const FALLBACK_GOALS = Object.values(GOAL_META)
