# ETF 프론트엔드 테스트 가이드

## 📋 개요

이 디렉토리는 ETF 프론트엔드 React 애플리케이션의 테스트 코드를 포함합니다.

## 🚀 테스트 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 테스트 실행
```bash
# 모든 테스트 실행
npm test

# 또는 직접 실행
npm run test

# UI 모드로 실행 (브라우저에서 결과 확인)
npm run test:ui

# 커버리지와 함께 실행
npm run test:coverage
```

### 3. 특정 테스트 실행
```bash
# 특정 파일의 테스트만 실행
npm test -- Login.test.jsx

# 특정 테스트만 실행
npm test -- -t "로그인 폼이 올바르게 렌더링됩니다"
```

## 📁 테스트 구조

```
src/test/
├── setup.js              # 테스트 환경 설정
├── README.md             # 이 파일
├── Login.test.jsx        # Login 컴포넌트 테스트
├── ChatMessage.test.jsx  # ChatMessage 컴포넌트 테스트
└── api.test.js           # API 서비스 테스트
```

## 🧪 테스트 종류

### 1. 컴포넌트 테스트
- **Login.test.jsx**: 로그인 폼 기능 테스트
- **ChatMessage.test.jsx**: 채팅 메시지 표시 테스트

### 2. 서비스 테스트
- **api.test.js**: API 호출 및 에러 처리 테스트

## 🔧 테스트 설정

### Vitest 설정 (`vitest.config.js`)
- React 플러그인 사용
- jsdom 환경 설정
- 커버리지 설정

### 테스트 환경 설정 (`setup.js`)
- Jest DOM 확장
- 전역 모킹 설정
- fetch, localStorage, sessionStorage 모킹

## 📊 커버리지

테스트 커버리지는 다음 명령으로 확인할 수 있습니다:

```bash
npm run test:coverage
```

결과는 `coverage/` 디렉토리에 생성됩니다.

## 🐛 문제 해결

### 1. 의존성 오류
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. 테스트 환경 오류
```bash
# 캐시 삭제
npm test -- --clearCache
```

### 3. 포트 충돌
```bash
# 다른 포트로 테스트 실행
npm test -- --port 3001
```

## 📝 테스트 작성 가이드

### 새로운 컴포넌트 테스트 추가
1. `src/test/[ComponentName].test.jsx` 파일 생성
2. 필요한 모킹 설정
3. 테스트 케이스 작성
4. 사용자 상호작용 테스트

### 테스트 네이밍
- 파일명: `[ComponentName].test.jsx`
- describe 블록: `[ComponentName] 컴포넌트`
- test 함수: `[기능]_[예상결과]`

### 예시
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../components/MyComponent'

describe('MyComponent 컴포넌트', () => {
  test('버튼 클릭 시 이벤트가 발생합니다', () => {
    const mockOnClick = jest.fn()
    render(<MyComponent onClick={mockOnClick} />)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
```

## 🧪 테스트 유틸리티

### renderWithRouter
Router로 감싸진 컴포넌트를 테스트하기 위한 유틸리티:

```javascript
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}
```

### 모킹 예시
```javascript
// fetch 모킹
window.fetch.mockResolvedValueOnce({
  ok: true,
  json: async () => ({ data: 'test' })
})

// localStorage 모킹
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
})
```

## 🔍 테스트 모범 사례

### 1. 사용자 중심 테스트
- 실제 사용자 행동을 시뮬레이션
- 접근성 고려 (aria-label, role 등)

### 2. 격리된 테스트
- 각 테스트는 독립적으로 실행 가능
- 테스트 간 상태 공유 금지

### 3. 명확한 테스트 이름
- 무엇을 테스트하는지 명확히 표현
- 한국어로 작성하여 이해하기 쉽게

### 4. 적절한 모킹
- 외부 의존성 모킹
- 불필요한 모킹 지양

## 📈 CI/CD 통합

GitHub Actions에서 테스트를 자동으로 실행하려면:

```yaml
# .github/workflows/test.yml
name: Frontend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
``` 