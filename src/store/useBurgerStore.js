import { create } from 'zustand'
import { INGREDIENTS } from '../data/ingredients'

// store 외부에서도 쓸 수 있도록 export — 컴포넌트에서 useMemo와 함께 사용
export function getBurgerName(stack) {
  if (stack.length === 0) return '빈 접시 🍽️'
  const hamCount = stack.filter((i) => i.def.isHamster).length
  const otherCount = stack.filter((i) => !i.def.isHamster).length
  if (hamCount === 0) return '평범한 버거 🍔'
  if (otherCount <= 1 && hamCount >= 2) return '이건 그냥 햄스터잖아 😅'
  if (hamCount >= 3) return '햄햄햄버거!! 🐹🐹🐹'
  if (hamCount === 2) return '햄햄버거! 🐹🐹🍔'
  return '진짜 햄버거 🐹🍔'
}

export function getScore(stack) {
  const uniqueIds = new Set(stack.map((i) => i.defId)).size
  const hamsterBonus = stack.filter((i) => i.def.isHamster).length * 50
  const variety = Math.min(uniqueIds * 15, 100)
  return { variety, hamster: hamsterBonus, total: variety + hamsterBonus }
}

let uidCounter = 0

export const useBurgerStore = create((set) => ({
  stack: [],

  addIngredient(defId) {
    const def = INGREDIENTS.find((i) => i.id === defId)
    if (!def) return
    set((s) => ({
      stack: [...s.stack, { uid: `${defId}-${++uidCounter}`, defId, def }],
    }))
  },

  removeIngredient(uid) {
    set((s) => ({ stack: s.stack.filter((i) => i.uid !== uid) }))
  },

  reset() {
    set({ stack: [], isCompleting: false, showResult: false })
  },

  isCompleting: false,
  showResult: false,

  startCompletion() {
    set({ isCompleting: true })
  },

  finishCompletion() {
    set({ isCompleting: false, showResult: true })
  },

  closeResult() {
    set({ showResult: false })
  },
  // ↑ getter 프로퍼티 제거: s.score가 매번 새 {} 반환 → Object.is 실패 → 무한 루프
  //   대신 getBurgerName / getScore 를 컴포넌트에서 useMemo로 계산
}))
