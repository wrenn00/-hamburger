# 🍔 햄버거 (Hamburger)

> **햄스터(Hamster) + 버거(Burger) = 햄버거**  
> 햄스터를 재료로 넣을 수 있는 3D 버거 커스터마이징 웹앱

🔗 **라이브 데모**: [https://wrenn00.github.io/-hamburger/](https://wrenn00.github.io/-hamburger/)

---

## ✨ 기능

- 🍞 빵, 🥩 패티, 🥬 야채, 🧀 토핑 재료를 자유롭게 조합
- 🐹 **진짜 햄스터**를 재료로 추가 가능 (GLB 3D 모델)
- 재료 클릭 시 spring bounce 애니메이션으로 쌓임
- 3D 햄버거를 드래그로 회전, 스크롤로 줌
- 완성 시 버거 이름 자동 생성 + 점수 계산

## 🛠 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | Vite + React |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| 애니메이션 | @react-spring/three |
| 상태관리 | Zustand |
| 스타일 | Tailwind CSS |

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

## 📦 빌드

```bash
npm run build
npm run preview
```
