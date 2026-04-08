export class Money {
  private readonly cents: number
  private readonly currency: string

  private constructor(cents: number, currency: string = 'USD') {
    this.cents = cents
    this.currency = currency
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency)
  }

  static fromPrice(dollars: number): Money {
    return new Money(Math.round(dollars * 100))
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add Money with different currencies')
    }
    return new Money(this.cents + other.cents, this.currency)
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract Money with different currencies')
    }
    return new Money(this.cents - other.cents, this.currency)
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency)
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.cents / 100)
  }
}
