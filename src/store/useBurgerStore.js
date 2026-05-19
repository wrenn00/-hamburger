import { create } from 'zustand'
import { INGREDIENTS } from '../data/ingredients'

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

  // 햄스터 GLB 로딩 후 실제 측정 높이로 def.height 업데이트
  // → Burger.jsx 스택 재계산 → 위 재료가 spring으로 새 위치로 이동
  updateStackItemHeight(uid, height) {
    set((s) => ({
      stack: s.stack.map((item) =>
        item.uid === uid
          ? { ...item, def: { ...item.def, height } }
          : item
      ),
    }))
  },

  reset() {
    set({ stack: [] })
  },
}))
