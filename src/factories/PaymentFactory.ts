// app/factories/PaymentFactory.ts
import { PaymentProcessor } from "./PaymentProcessor";
import { CreditCardProcessor, DebitCardProcessor, PaypalProcessor } from "./CreditCardProcessor";

export type PaymentType = "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL";

export function PaymentFactory(type: PaymentType): PaymentProcessor {
  switch (type) {
    case "CREDIT_CARD":
      return new CreditCardProcessor();
    case "DEBIT_CARD":
      return new DebitCardProcessor();
    case "PAYPAL":
      return new PaypalProcessor();
    default:
      throw new Error("Tipo de pago no soportado");
  }
}
