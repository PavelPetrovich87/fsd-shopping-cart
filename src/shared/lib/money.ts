export class Money {
  private readonly _cents: number
  private readonly _currency: string

  private constructor(cents: number, currency: string = 'USD') {
    this._cents = cents
    this._currency = currency
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency)
  }

  static fromPrice(dollars: number): Money {
    return new Money(Math.round(dollars * 100))
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add Money with different currencies')
    }
    return new Money(this._cents + other._cents, this._currency)
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract Money with different currencies')
    }
    return new Money(this._cents - other._cents, this._currency)
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this._cents * factor), this._currency)
  }

  equals(other: Money): boolean {
    return this._cents === other._cents && this._currency === other._currency
  }

  get cents(): number {
    return this._cents
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._currency,
    }).format(this._cents / 100)
  }
}
