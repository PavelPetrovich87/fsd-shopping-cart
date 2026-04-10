import { describe, expect, it } from 'vitest'
import { MockCouponRepository } from './mock-coupon-repository'

describe('MockCouponRepository', () => {
  const repo = MockCouponRepository

  describe('initialization', () => {
    it('should initialize without side effects', () => {
      expect(repo).toBeDefined()
    })
  })

  describe('findByCode - known codes', () => {
    it('should return Coupon for known code WELCOME10', () => {
      const result = repo.findByCode('WELCOME10')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('WELCOME10')
      expect(result?.discountMode).toBe('percentage')
      expect(result?.percentageValue).toBe(10)
    })

    it('should return Coupon for known code FLAT20', () => {
      const result = repo.findByCode('FLAT20')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('FLAT20')
      expect(result?.discountMode).toBe('flat')
      expect(result?.discountAmount?.cents).toBe(2000)
    })

    it('should return Coupon for known code SUMMER25', () => {
      const result = repo.findByCode('SUMMER25')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('SUMMER25')
      expect(result?.discountMode).toBe('percentage')
      expect(result?.percentageValue).toBe(25)
    })

    it('should be case-insensitive for code lookup', () => {
      const upper = repo.findByCode('WELCOME10')
      const lower = repo.findByCode('welcome10')
      const mixed = repo.findByCode('Welcome10')
      expect(upper?.code).toBe(lower?.code)
      expect(upper?.code).toBe(mixed?.code)
    })
  })

  describe('findByCode - unknown/malformed codes', () => {
    it('should return null for unknown code', () => {
      const result = repo.findByCode('INVALIDCODE')
      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const result = repo.findByCode('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace-only string', () => {
      const result = repo.findByCode('   ')
      expect(result).toBeNull()
    })

    it('should return null for non-existent code pattern', () => {
      const result = repo.findByCode('XYZ999')
      expect(result).toBeNull()
    })
  })

  describe('determinism', () => {
    it('should return identical results for repeated lookups of same code', () => {
      const first = repo.findByCode('WELCOME10')
      const second = repo.findByCode('WELCOME10')
      const third = repo.findByCode('WELCOME10')

      expect(first?.code).toBe(second?.code)
      expect(first?.discountMode).toBe(second?.discountMode)
      expect(first?.code).toBe(third?.code)
      expect(first?.discountMode).toBe(third?.discountMode)
    })

    it('should return identical null results for repeated unknown code lookups', () => {
      const first = repo.findByCode('INVALIDCODE')
      const second = repo.findByCode('INVALIDCODE')

      expect(first).toBeNull()
      expect(second).toBeNull()
    })
  })
})
