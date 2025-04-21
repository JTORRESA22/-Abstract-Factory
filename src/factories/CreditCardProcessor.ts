import { PaymentProcessor } from "./PaymentProcessor";

export class CreditCardProcessor implements PaymentProcessor {
  getName(): string {
    return "Tarjeta de Crédito";
  }

  calculateTax(amount: number, total: number): number {
    return total - amount;
  }
}

export class DebitCardProcessor implements PaymentProcessor {
  getName(): string {
    return "Tarjeta de Débito";
  }

  calculateTax(amount: number, total: number): number {
    return total - amount;
  }
}


export class PaypalProcessor implements PaymentProcessor {
  getName(): string {
    return "PayPal";
  }

  calculateTax(amount: number, total: number): number {
    return total - amount;
  }
}