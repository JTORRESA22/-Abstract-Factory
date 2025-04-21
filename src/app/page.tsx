'use client';

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaCalculator, FaReceipt, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { ThemeSwitcher } from '@/components/ThemeSwith';

type PaymentType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL';

interface PaymentResult {
  amount: number;
  tax: number;
  total: number;
  paymentType: PaymentType;
}

export default function PaymentApp() {
  const { theme, setTheme } = useTheme();
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | ''>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/payment/types');
        if (!response.ok) {
          throw new Error('Error al cargar métodos de pago');
        }
        const data = await response.json();
        setPaymentTypes(data);
      } catch (err) {
        setError('Error al cargar los métodos de pago');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentType || !amount) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:8080/payment/pay?paymentType=${selectedPaymentType}&amount=${amount}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        throw new Error('Error al calcular el pago');
      }

      const responseText = await response.text();
      const totalAmount = parseFloat(responseText);
      const numericAmount = parseFloat(amount);

      if (isNaN(totalAmount) || isNaN(numericAmount)) {
        throw new Error('Formato de respuesta inválido');
      }

      const tax = totalAmount - numericAmount;

      setPaymentResult({
        amount: numericAmount,
        tax,
        total: totalAmount,
        paymentType: selectedPaymentType,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular el pago');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPaymentResult(null);
    setAmount('');
    setSelectedPaymentType('');
  };

  const getPaymentTypeName = (type: PaymentType) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'Tarjeta de Crédito';
      case 'DEBIT_CARD':
        return 'Tarjeta de Débito';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return type;
    }
  };

  const getTaxPercentage = (amount: number, tax: number) => {
    if (amount <= 0) return '0%';
    return `${((tax / amount) * 100).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-9">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">App de Pagos</h1>
          <ThemeSwitcher />
        </div>

        {!paymentResult ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Calcular Pago</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Método de Pago
                </label>
                <select
                  id="paymentType"
                  value={selectedPaymentType}
                  onChange={(e) => setSelectedPaymentType(e.target.value as PaymentType)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                  disabled={loading}
                >
                  <option value="">Seleccione un método</option>
                  {paymentTypes.map((type) => (
                    <option key={type} value={type}>
                      {getPaymentTypeName(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Monto (USD)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el monto"
                  min="0"
                  step="0.01"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={loading || !selectedPaymentType || !amount}
              >
                {loading ? 'Calculando...' : (<><FaCalculator className="mr-2" />Calcular Pago</>)}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                <FaReceipt className="inline mr-2" />Factura de Pago
              </h2>
            </div>

            <div className="mb-6">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Método de Pago:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {getPaymentTypeName(paymentResult.paymentType)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Monto Original:</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  ${paymentResult.amount.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Impuesto ({getTaxPercentage(paymentResult.amount, paymentResult.tax)}):</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  ${paymentResult.tax.toFixed(2)} USD
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400 font-bold">Total a Pagar:</span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                  ${paymentResult.total.toFixed(2)} USD
                </span>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaArrowLeft className="mr-2" />Realizar otro pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
