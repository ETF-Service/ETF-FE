#!/usr/bin/env node
/**
 * 프론트엔드 테스트 실행 스크립트
 */
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function runTests() {
  console.log('🧪 ETF 프론트엔드 테스트를 시작합니다...')
  
  try {
    // 테스트 실행
    const result = execSync('npm test -- --run --reporter=verbose', {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: 'pipe'
    })
    
    console.log('📊 테스트 결과:')
    console.log(result)
    console.log('✅ 모든 테스트가 통과했습니다!')
    return true
    
  } catch (error) {
    console.log('❌ 테스트 실행 중 오류 발생:')
    console.log(error.stdout || error.message)
    return false
  }
}

function runCoverage() {
  console.log('📈 코드 커버리지 분석을 시작합니다...')
  
  try {
    const result = execSync('npm run test:coverage', {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: 'pipe'
    })
    
    console.log('📊 커버리지 결과:')
    console.log(result)
    return true
    
  } catch (error) {
    console.log('❌ 커버리지 분석 중 오류 발생:')
    console.log(error.stdout || error.message)
    return false
  }
}

// 명령행 인수 처리
const args = process.argv.slice(2)
const command = args[0] || 'test'

switch (command) {
  case 'test':
    process.exit(runTests() ? 0 : 1)
    break
  case 'coverage':
    process.exit(runCoverage() ? 0 : 1)
    break
  default:
    console.log('사용법: node run_tests.js [test|coverage]')
    process.exit(1)
} 