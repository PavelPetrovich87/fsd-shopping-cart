import { describe, it, expect } from 'vitest'
import { Money } from './money'

describe('Money', () => {
  describe('fromPrice factory', () => {
    it('stores correct cents', () => {
      expect(Money.fromPrice(25).format()).toBe('$25.00')
    })

    it('rounds partial cents', () => {
      expect(Money.fromPrice(10.255).format()).toBe('$10.26')
    })
  })

  describe('arithmetic operations', () => {
    it('adds two Money values', () => {
      const result = Money.fromPrice(10).add(Money.fromPrice(5))
      expect(result.format()).toBe('$15.00')
    })

    it('subtracts two Money values', () => {
      const result = Money.fromPrice(20).subtract(Money.fromPrice(5))
      expect(result.format()).toBe('$15.00')
    })

    it('multiplies Money by factor', () => {
      const result = Money.fromPrice(10).multiply(3)
      expect(result.format()).toBe('$30.00')
    })

    it('throws on different currencies for add', () => {
      const usd = Money.fromPrice(10)
      const eur = Money.fromCents(1000, 'EUR')
      expect(() => usd.add(eur)).toThrow(
        'Cannot add Money with different currencies',
      )
    })
  })

  describe('equals', () => {
    it('returns true for same value', () => {
      expect(Money.fromPrice(10).equals(Money.fromPrice(10))).toBe(true)
    })

    it('returns false for different value', () => {
      expect(Money.fromPrice(10).equals(Money.fromPrice(20))).toBe(false)
    })

    it('returns false for different currency', () => {
      const usd = Money.fromPrice(10)
      const eur = Money.fromCents(1000, 'EUR')
      expect(usd.equals(eur)).toBe(false)
    })
  })

  describe('format', () => {
    it('formats $25 correctly', () => {
      expect(Money.fromPrice(25).format()).toBe('$25.00')
    })

    it('formats $100 correctly', () => {
      expect(Money.fromPrice(100).format()).toBe('$100.00')
    })

    it('formats $0 correctly', () => {
      expect(Money.fromPrice(0).format()).toBe('$0.00')
    })
  })

  describe('immutability', () => {
    it('original instance unchanged after add', () => {
      const original = Money.fromPrice(100)
      original.add(Money.fromPrice(50))
      expect(original.format()).toBe('$100.00')
    })

    it('original instance unchanged after subtract', () => {
      const original = Money.fromPrice(100)
      original.subtract(Money.fromPrice(50))
      expect(original.format()).toBe('$100.00')
    })

    it('original instance unchanged after multiply', () => {
      const original = Money.fromPrice(100)
      original.multiply(2)
      expect(original.format()).toBe('$100.00')
    })
  })
})
