// Vite의 base 설정을 반영한 public/ 에셋 경로 생성
// dev: '/'  →  prod(gh-pages): '/-hamburger/'
const BASE = import.meta.env.BASE_URL // 항상 '/' 로 끝남

export function assetPath(path) {
  // 앞의 '/' 제거 후 BASE와 합침
  return BASE + (path.startsWith('/') ? path.slice(1) : path)
}
