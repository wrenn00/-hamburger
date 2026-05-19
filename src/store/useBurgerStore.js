import { create } from 'zustand'
import { INGREDIENTS } from '../data/ingredients'

function getBurgerName(stack) {
  if (stack.length === 0) return '빈 접시 🍽️'
  const hamCount = stack.filter((i) => i.def.isHamster).length
  const otherCount = stack.filter((i) => !i.def.isHamster).length
  if (hamCount === 0) return '평범한 버거 🍔'
  if (otherCount <= 1 && hamCount >= 2) return '이건 그냥 햄스터잖아 😅'
  if (hamCount >= 3) return '햄햄햄버거!! 🐹🐹🐹'
  if (hamCount === 2) return '햄햄버거! 🐹🐹🍔'
  return '진짜 햄버거 🐹🍔'
}

function getScore(stack) {
  const uniqueIds = new Set(stack.map((i) => i.defId)).size
  const hamsterBonus = stack.filter((i) => i.def.isHamster).length * 50
  const variety = Math.min(uniqueIds * 15, 100)
  return { variety, hamster: hamsterBonus, total: variety + hamsterBonus }
}

let uidCounter = 0

export const useBurgerStore = create((set, get) => ({
  stack: [],   // [{ uid, defId, def }]

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

  // ── 완성 플로우 ──
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

  // ── 파생 데이터 (getters) ──
  get burgerName() {
    return getBurgerName(get().stack)
  },
  get score() {
    return getScore(get().stack)
  },
  get hamsterCount() {
    return get().stack.filter((i) => i.def.isHamster).length
  },
}))
