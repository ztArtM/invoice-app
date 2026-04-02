import { describe, expect, it } from 'vitest'
import { parseTallyFormRef } from './tallyFeedback'

describe('parseTallyFormRef', () => {
  it('extracts id from /r/ share URL', () => {
    expect(parseTallyFormRef('https://tally.so/r/mBzN1K')).toBe('mBzN1K')
  })

  it('extracts id from /embed/ URL', () => {
    expect(parseTallyFormRef('https://tally.so/embed/wxyzAB')).toBe('wxyzAB')
  })

  it('accepts bare form id', () => {
    expect(parseTallyFormRef('abc123XYZ')).toBe('abc123XYZ')
  })

  it('returns null for empty or unusable input', () => {
    expect(parseTallyFormRef('')).toBeNull()
    expect(parseTallyFormRef(undefined)).toBeNull()
    expect(parseTallyFormRef('   ')).toBeNull()
  })
})
