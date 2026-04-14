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
    it('should return Coupon for known code WELCOME10', async () => {
      const result = await repo.findByCode('WELCOME10')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('WELCOME10')
      expect(result?.discountMode).toBe('percentage')
      expect(result?.percentageValue).toBe(10)
    })

    it('should return Coupon for known code FLAT20', async () => {
      const result = await repo.findByCode('FLAT20')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('FLAT20')
      expect(result?.discountMode).toBe('flat')
      expect(result?.discountAmount?.cents).toBe(2000)
    })

    it('should return Coupon for known code SUMMER25', async () => {
      const result = await repo.findByCode('SUMMER25')
      expect(result).not.toBeNull()
      expect(result?.code).toBe('SUMMER25')
      expect(result?.discountMode).toBe('percentage')
      expect(result?.percentageValue).toBe(25)
    })

    it('should be case-insensitive for code lookup', async () => {
      const upper = await repo.findByCode('WELCOME10')
      const lower = await repo.findByCode('welcome10')
      const mixed = await repo.findByCode('Welcome10')
      expect(upper?.code).toBe(lower?.code)
      expect(upper?.code).toBe(mixed?.code)
    })
  })

  describe('findByCode - unknown/malformed codes', () => {
    it('should return null for unknown code', async () => {
      const result = await repo.findByCode('INVALIDCODE')
      expect(result).toBeNull()
    })

    it('should return null for empty string', async () => {
      const result = await repo.findByCode('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace-only string', async () => {
      const result = await repo.findByCode('   ')
      expect(result).toBeNull()
    })

    it('should return null for non-existent code pattern', async () => {
      const result = await repo.findByCode('XYZ999')
      expect(result).toBeNull()
    })
  })

  describe('determinism', () => {
    it('should return identical results for repeated lookups of same code', async () => {
      const first = await repo.findByCode('WELCOME10')
      const second = await repo.findByCode('WELCOME10')
      const third = await repo.findByCode('WELCOME10')

      expect(first?.code).toBe(second?.code)
      expect(first?.discountMode).toBe(second?.discountMode)
      expect(first?.code).toBe(third?.code)
      expect(first?.discountMode).toBe(third?.discountMode)
    })

    it('should return identical null results for repeated unknown code lookups', async () => {
      const first = await repo.findByCode('INVALIDCODE')
      const second = await repo.findByCode('INVALIDCODE')

      expect(first).toBeNull()
      expect(second).toBeNull()
    })
  })
})
