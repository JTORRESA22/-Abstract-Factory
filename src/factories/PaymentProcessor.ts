export interface PaymentProcessor {
    getName(): string;
    calculateTax(amount: number, total: number): number;
  }