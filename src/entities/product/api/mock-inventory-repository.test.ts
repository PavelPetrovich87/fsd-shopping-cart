import { describe, expect, it } from 'vitest'
import { MockInventoryRepository } from './mock-inventory-repository'

describe('MockInventoryRepository', () => {
  const repo = MockInventoryRepository

  describe('initialization', () => {
    it('should initialize without side effects', () => {
      expect(repo).toBeDefined()
    })
  })

  describe('findBySku - known SKUs', () => {
    it('should return ProductVariant for known SKU SHIRT-001', async () => {
      const result = await repo.findBySku('SHIRT-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('SHIRT-001')
      expect(result?.totalOnHand).toBe(150)
    })

    it('should return ProductVariant for known SKU JEANS-001', async () => {
      const result = await repo.findBySku('JEANS-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('JEANS-001')
      expect(result?.totalOnHand).toBe(75)
    })

    it('should return ProductVariant with correct stock values for SHOE-001', async () => {
      const result = await repo.findBySku('SHOE-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('SHOE-001')
      expect(result?.totalOnHand).toBe(40)
    })

    it('should return ProductVariant for WATCH-001', async () => {
      const result = await repo.findBySku('WATCH-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('WATCH-001')
      expect(result?.totalOnHand).toBe(25)
    })

    it('should return ProductVariant for BAG-001', async () => {
      const result = await repo.findBySku('BAG-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('BAG-001')
      expect(result?.totalOnHand).toBe(60)
    })

    it('should return ProductVariant for HAT-001', async () => {
      const result = await repo.findBySku('HAT-001')
      expect(result).not.toBeNull()
      expect(result?.skuId).toBe('HAT-001')
      expect(result?.totalOnHand).toBe(100)
    })

    it('should be case-insensitive for SKU lookup', async () => {
      const upper = await repo.findBySku('SHIRT-001')
      const lower = await repo.findBySku('shirt-001')
      const mixed = await repo.findBySku('Shirt-001')
      expect(upper?.skuId).toBe(lower?.skuId)
      expect(upper?.skuId).toBe(mixed?.skuId)
    })
  })

  describe('findBySku - unknown/malformed SKUs', () => {
    it('should return null for unknown SKU', async () => {
      const result = await repo.findBySku('UNKNOWN-001')
      expect(result).toBeNull()
    })

    it('should return null for empty string', async () => {
      const result = await repo.findBySku('')
      expect(result).toBeNull()
    })

    it('should return null for whitespace-only string', async () => {
      const result = await repo.findBySku('   ')
      expect(result).toBeNull()
    })

    it('should return null for non-existent SKU pattern', async () => {
      const result = await repo.findBySku('XYZ-999')
      expect(result).toBeNull()
    })
  })

  describe('determinism', () => {
    it('should return identical results for repeated lookups of same SKU', async () => {
      const first = await repo.findBySku('SHIRT-001')
      const second = await repo.findBySku('SHIRT-001')
      const third = await repo.findBySku('SHIRT-001')

      expect(first?.skuId).toBe(second?.skuId)
      expect(first?.totalOnHand).toBe(second?.totalOnHand)
      expect(first?.skuId).toBe(third?.skuId)
      expect(first?.totalOnHand).toBe(third?.totalOnHand)
    })

    it('should return identical null results for repeated unknown SKU lookups', async () => {
      const first = await repo.findBySku('UNKNOWN-001')
      const second = await repo.findBySku('UNKNOWN-001')

      expect(first).toBeNull()
      expect(second).toBeNull()
    })
  })
})
