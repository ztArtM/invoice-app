import { describe, expect, it } from 'vitest'
import { isAllowedTallyUrl, parseTallyFormRef } from './tallyFeedback'

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

describe('isAllowedTallyUrl', () => {
  it('allows https tally.so embed URLs', () => {
    expect(isAllowedTallyUrl('https://tally.so/embed/abc')).toBe(true)
  })

  it('rejects non-https and other hosts', () => {
    expect(isAllowedTallyUrl('http://tally.so/embed/x')).toBe(false)
    expect(isAllowedTallyUrl('https://evil.com/embed/x')).toBe(false)
    expect(isAllowedTallyUrl('not a url')).toBe(false)
  })
})
