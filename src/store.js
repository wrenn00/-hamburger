import { create } from 'zustand'
import { INGREDIENTS } from './data/ingredients'
import { assetPath } from './utils/assetPath'

const PERSONALITIES = {
  golden_ham: {
    idle:     ['재료를 골라봐요~ 🍃', '천천히... 맛있게 만들어요~', '서두를 필요 없어요~ 🌸'],
    add:      ['오~호~ 좋은 선택이에요~', '음... 맛있겠는데요~ 💛', '그거 참 좋아요~'],
    complete: ['완벽해요~... 최고의 버거~ 💛', '정말 맛있겠어요... 천천히 즐겨요~'],
  },
  jungarian_ham: {
    idle:     ['재료를 골라봐! 🍔', '뭐 넣을까? 난 치즈 추천!', '같이 만들자!'],
    add:      ['오! 좋아 좋아!', '그거 맛있을 것 같은데!', '굿초이스!'],
    complete: ['야호! 완성이다! 🎉', '대박 버거 완성!!'],
  },
  pearl_ham: {
    idle:     ['우아한 재료로 고급지게~ 🌸', '최고의 버거를 만들어봐요 ✨', '어떤 재료를 고르실건가요?'],
    add:      ['훌륭한 선택이에요 ✨', '참 잘 어울려요~', '아름다운 조합이네요 🌟'],
    complete: ['완벽한 작품이 탄생했어요 🌟', '이보다 고급스러울 수 없어요~'],
  },
  roborovskii_ham: {
    idle:     ['빨리빨리! 재료골라!! ⚡', '뭐해뭐해! 빨리넣어!!', '고고고! 시간없어!!'],
    add:      ['오케이! 다음! 다음!', '굿굿! 더 넣어!', '빠르다빠르다!'],
    complete: ['완성완성!! 최고최고!! ⚡⚡', '빠른완성! 대박!!! ⚡'],
  },
}

export const useHamsterStore = create((set, get) => ({
  // ── 화면 ──
  screen: 'welcome',

  // ── 햄스터 ──
  selectedHamster: null,
  hamsters: [
    { id: 'golden_ham',      name: '골든 햄스터',    title: '클래식 버거 셰프',     emoji: '👨‍🍳', file: assetPath('/models/golden_ham.glb'),      color: '#FFB347', bgFrom: '#FFF3CD', bgTo: '#FFD580' },
    { id: 'jungarian_ham',   name: '정가리안 햄스터', title: '미니 슬라이더 전문가', emoji: '🍔',  file: assetPath('/models/jungarian_ham.glb'),   color: '#A8D8A8', bgFrom: '#D4EDDA', bgTo: '#82C882' },
    { id: 'pearl_ham',       name: '펄 햄스터',      title: '디저트 버거 마스터',   emoji: '🍰',  file: assetPath('/models/pearl_ham.glb'),       color: '#F4ACB7', bgFrom: '#FCE4EC', bgTo: '#F48FB1' },
    { id: 'roborovskii_ham', name: '로보로브스키',    title: '스피드 패스트푸드',    emoji: '⚡',  file: assetPath('/models/roborovskii_ham.glb'), color: '#B39DDB', bgFrom: '#EDE7F6', bgTo: '#9575CD' },
  ],

  // ── 주방 ──
  ingredients: INGREDIENTS,
  burgerStack: [],        // 쌓인 재료 (순서대로)
  activeCategory: 'bread',
  completed: false,

  // ── 액션 ──
  setSelectedHamster: (id) => set({ selectedHamster: id }),
  goToKitchen: (id) => set({ selectedHamster: id, screen: 'kitchen', burgerStack: [], completed: false }),
  goToWelcome: () => set({ screen: 'welcome', selectedHamster: null, burgerStack: [], completed: false }),

  setActiveCategory: (cat) => set({ activeCategory: cat }),
  addIngredient: (id) => {
    const ing = INGREDIENTS.find((i) => i.id === id)
    if (!ing) return
    set((s) => ({ burgerStack: [...s.burgerStack, { ...ing, uid: Date.now() + Math.random() }] }))
  },
  removeLastIngredient: () => set((s) => ({ burgerStack: s.burgerStack.slice(0, -1) })),
  clearBurger: () => set({ burgerStack: [], completed: false }),
  completeBurger: () => set({ completed: true }),

  getPersonality: () => {
    const id = get().selectedHamster
    return PERSONALITIES[id] || PERSONALITIES.golden_ham
  },
}))
