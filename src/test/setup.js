import '@testing-library/jest-dom'

// 전역 모킹 설정
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: {
    observe: () => {},
    unobserve: () => {},
    disconnect: () => {},
  },
})

// fetch 모킹 - vi.fn() 사용
window.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  json: () => Promise.resolve({}),
}))

// localStorage 모킹
const localStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// sessionStorage 모킹
const sessionStorageMock = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
}) 