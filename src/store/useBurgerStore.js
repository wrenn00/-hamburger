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

  reset() {
    set({ stack: [] })
  },
}))
