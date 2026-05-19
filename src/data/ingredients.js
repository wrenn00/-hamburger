import { assetPath } from '../utils/assetPath'

// ── height = 실제 geometry 높이와 정확히 일치 ─────────────────────────────
// bottom-based: geometry 바닥 y=0, 꼭대기 y=height
// Burger.jsx 스택: baseY += height 로 다음 재료 위치 결정

export const INGREDIENTS = [
  // ── 빵 ──────────────────────────────────────────────────────────────────────
  // Bun.jsx: 실린더(CYLH=0.12) + 반구(R=0.40) → 총 0.52
  {
    id: 'bun_bottom', name: '빵 아래', emoji: '🍞',
    category: 'base', height: 0.52, color: '#D4936A',
    meshType: 'bun_bottom', cardBg: '#FFF3E0', cardBorder: '#FFCC80',
  },
  // Bun.jsx: 실린더(CYLH=0.12) + 큰 반구(R=0.50) → 총 0.62
  {
    id: 'bun_top', name: '빵 위', emoji: '🍞',
    category: 'base', height: 0.62, color: '#C8834A',
    meshType: 'bun_top', cardBg: '#FFF3E0', cardBorder: '#FFCC80',
  },

  // ── 패티 ────────────────────────────────────────────────────────────────────
  // Patty.jsx: cylinder h=0.28
  {
    id: 'beef', name: '비프 패티', emoji: '🥩',
    category: 'patty', height: 0.28, color: '#4A1C00',
    meshType: 'patty', cardBg: '#FCE4EC', cardBorder: '#F48FB1',
  },
  // Patty.jsx: cylinder h=0.22
  {
    id: 'chicken', name: '치킨 패티', emoji: '🍗',
    category: 'patty', height: 0.22, color: '#C49A3A',
    meshType: 'patty_chicken', cardBg: '#FFFDE7', cardBorder: '#FFF176',
  },

  // ── 야채 ────────────────────────────────────────────────────────────────────
  // 각 geometry height = data height (정확히 일치)
  {
    id: 'lettuce', name: '양상추', emoji: '🥬',
    category: 'veggie', height: 0.10, color: '#4CAF50',
    meshType: 'lettuce', cardBg: '#E8F5E9', cardBorder: '#A5D6A7',
  },
  {
    id: 'tomato', name: '토마토', emoji: '🍅',
    category: 'veggie', height: 0.12, color: '#E53935',
    meshType: 'tomato', cardBg: '#FFEBEE', cardBorder: '#EF9A9A',
  },
  // onion: torus tube_r=0.06 → height=0.12, center at y=0.06
  {
    id: 'onion', name: '양파링', emoji: '🧅',
    category: 'veggie', height: 0.12, color: '#F8BBD9',
    meshType: 'onion', cardBg: '#FCE4EC', cardBorder: '#F48FB1',
  },
  {
    id: 'pickle', name: '피클', emoji: '🥒',
    category: 'veggie', height: 0.08, color: '#388E3C',
    meshType: 'pickle', cardBg: '#E8F5E9', cardBorder: '#81C784',
  },

  // ── 토핑 ────────────────────────────────────────────────────────────────────
  {
    id: 'cheese', name: '체다 치즈', emoji: '🧀',
    category: 'topping', height: 0.07, color: '#FFC107',
    meshType: 'cheese', cardBg: '#FFFDE7', cardBorder: '#FFE082',
  },
  {
    id: 'bacon', name: '베이컨', emoji: '🥓',
    category: 'topping', height: 0.10, color: '#EF9A9A',
    meshType: 'bacon', cardBg: '#FCE4EC', cardBorder: '#F48FB1',
  },
  // egg: white cyl(h=0.10) + yolk sphere(r=0.08, center=0.14) → top=0.22
  {
    id: 'egg', name: '계란프라이', emoji: '🍳',
    category: 'topping', height: 0.22, color: '#FFFDE7',
    meshType: 'egg', cardBg: '#FFFDE7', cardBorder: '#FFF176',
  },

  // ── 🌟 햄스터 (HamsterTopping: bbox 정규화 → TARGET_HEIGHT=1.0) ─────────────
  {
    id: 'golden_ham', name: '골든 햄스터', emoji: '🐹',
    category: 'hamster', height: 1.0, color: '#FFB347',
    meshType: 'hamster', modelPath: assetPath('/models/golden_ham.glb'),
    cardBg: '#FFFBEA', cardBorder: '#FFD700', isHamster: true,
  },
  {
    id: 'jungarian_ham', name: '정가리안', emoji: '🐹',
    category: 'hamster', height: 1.0, color: '#A8D8A8',
    meshType: 'hamster', modelPath: assetPath('/models/jungarian_ham.glb'),
    cardBg: '#F0FFF4', cardBorder: '#FFD700', isHamster: true,
  },
  {
    id: 'pearl_ham', name: '펄 햄스터', emoji: '🐹',
    category: 'hamster', height: 1.0, color: '#F4ACB7',
    meshType: 'hamster', modelPath: assetPath('/models/pearl_ham.glb'),
    cardBg: '#FFF5F7', cardBorder: '#FFD700', isHamster: true,
  },
  {
    id: 'roborovskii_ham', name: '로보로브스키', emoji: '🐹',
    category: 'hamster', height: 1.0, color: '#B39DDB',
    meshType: 'hamster', modelPath: assetPath('/models/roborovskii_ham.glb'),
    cardBg: '#F8F0FF', cardBorder: '#FFD700', isHamster: true,
  },
]

export const CATEGORIES = [
  { id: 'base',    label: '빵',        emoji: '🍞' },
  { id: 'patty',   label: '패티',      emoji: '🥩' },
  { id: 'veggie',  label: '야채',      emoji: '🥬' },
  { id: 'topping', label: '토핑',      emoji: '🧀' },
  { id: 'hamster', label: '🌟 햄스터', emoji: '🐹' },
]

export const getById = (id) => INGREDIENTS.find((i) => i.id === id)
