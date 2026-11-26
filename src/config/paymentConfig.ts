export interface PaymentConfig {
  merchantName: string;
  upiId: string;
  qrImagePath: string;
  requiresManualVerification: boolean;
  bankName: string;
  note: string;
}

export const PAYMENT_CONFIG: PaymentConfig = {
  merchantName: 'Deepak Das',
  upiId: '9211437989@ptyes',
  qrImagePath: '/payment-qr.png',
  requiresManualVerification: true,
  bankName: 'Paytm Payments Bank / Yes Bank',
  note: 'Campus Pre-order • 15 MIN. 1 SAMOSA.',
};

/**
 * Generate standard UPI deep-link URI
 * Works on mobile devices to launch GPay, PhonePe, Paytm, BHIM directly
 */
export const generateUpiIntentUrl = (amount: number, transactionRef: string): string => {
  const pa = encodeURIComponent(PAYMENT_CONFIG.upiId);
  const pn = encodeURIComponent(PAYMENT_CONFIG.merchantName);
  const am = amount.toFixed(2);
  const cu = 'INR';
  const tr = encodeURIComponent(transactionRef);
  const tn = encodeURIComponent(`BreakBite Order ${transactionRef}`);

  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=${cu}&tr=${tr}&tn=${tn}`;
};
