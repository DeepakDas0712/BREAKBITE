import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  X,
  AlertCircle,
  Sparkles,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { PaymentMethod, Order } from '../../types';
import { PAYMENT_CONFIG, generateUpiIntentUrl } from '../../config/paymentConfig';

interface CartAndCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScheduler: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CartAndCheckoutModal: React.FC<CartAndCheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenScheduler,
  onOrderCompleted,
}) => {
  const {
    cart,
    cartTotal,
    cartItemCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCanteenId,
    canteens,
    breakSchedules,
    selectedBreakId,
    selectedPickupDate,
    selectedPickupSlot,
    placeOrder,
  } = useBreakBite();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'cart' | 'payment'>('cart');

  if (!isOpen) return null;

  const selectedCanteen =
    canteens.find((c) => c.id === cartCanteenId) || canteens[0];
  const targetBreak =
    breakSchedules.find((b) => b.id === selectedBreakId) || breakSchedules[1];

  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(PAYMENT_CONFIG.upiId);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleSimulateScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Default sample receipt thumbnail
      setScreenshotPreview(PAYMENT_CONFIG.qrImagePath);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (paymentMethod === 'UPI' && !utrNumber.trim()) {
      alert('Please enter your 12-digit UPI Transaction Reference Number (UTR) after completing payment.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOrder = await placeOrder({
        paymentMethod,
        notes: specialNotes,
        utrReference: utrNumber.trim() || undefined,
        screenshotUrl: screenshotPreview || undefined,
      });

      setIsProcessing(false);
      onClose();
      onOrderCompleted(newOrder);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Could not complete order. Please try again.');
    }
  };

  // UPI deep link for mobile users
  const upiDeepLink = generateUpiIntentUrl(cartTotal, `BB-${Date.now().toString().slice(-4)}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden shadow-floating border border-cream-200 flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-charcoal-900">
                {step === 'cart' ? 'Your Campus Tray' : 'Complete Your UPI Payment'}
              </h2>
              <span className="text-[11px] text-charcoal-500">
                {selectedCanteen.name} • {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 text-charcoal-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-charcoal-900">Your tray is empty</h3>
              <p className="text-xs text-charcoal-500 mt-1 max-w-xs mx-auto">
                Explore the campus food menu and select your favorites to pre-order.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold shadow-md hover:bg-brand-600"
              >
                Browse Menu
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Scheduled Pickup Banner with specific Date & Time */}
              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">
                    Scheduled Counter Pickup
                  </span>
                  <div className="text-xs font-extrabold text-charcoal-900 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    <span>
                      {selectedPickupDate} at <strong>{selectedPickupSlot || '12:35 PM'}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] text-charcoal-500 block mt-0.5">
                    Break: {targetBreak.name} ({targetBreak.startTime})
                  </span>
                </div>
                <button
                  onClick={onOpenScheduler}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-white px-3 py-1.5 rounded-lg border border-brand-200 shadow-subtle"
                >
                  Change Slot
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                  Items in Tray
                </span>

                <div className="divide-y divide-cream-100 max-h-60 overflow-y-auto">
                  {cart.map((ci) => (
                    <div key={ci.foodItem.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={ci.foodItem.image}
                          alt={ci.foodItem.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-cream-200"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-charcoal-900 truncate">
                            {ci.foodItem.name}
                          </h4>
                          <span className="text-[11px] text-charcoal-500">
                            ₹{ci.foodItem.price} × {ci.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-cream-100 rounded-lg p-0.5 border border-cream-200">
                          <button
                            onClick={() => updateCartQuantity(ci.foodItem.id, ci.quantity - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-charcoal-700 hover:bg-cream-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2">{ci.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(ci.foodItem.id, ci.quantity + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-charcoal-700 hover:bg-cream-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(ci.foodItem.id)}
                          className="p-1.5 text-charcoal-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="text-[11px] font-bold text-charcoal-600 block mb-1">
                  Preparation Instructions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra chutney, less spicy, well toasted..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Bill Details */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-charcoal-600">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-charcoal-900">₹{cartTotal}</span>
                </div>
                <div className="flex items-center justify-between text-charcoal-600">
                  <span>Campus Packaging</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-charcoal-600">
                  <span>BreakBite Platform Fee</span>
                  <span className="text-emerald-600 font-bold">₹0 (University Pilot)</span>
                </div>
                <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-sm font-extrabold text-charcoal-900">
                  <span>Total Amount</span>
                  <span className="text-base text-brand-600 font-black">₹{cartTotal}</span>
                </div>
              </div>
            </>
          ) : (
            /* STEP 2: DEDICATED UPI PAYMENT SCREEN WITH DEEPAK DAS QR CODE */
            <div className="space-y-5">
              
              {/* Payment Summary Header */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Total Payable Amount
                  </span>
                  <div className="text-2xl font-black text-charcoal-900 mt-0.5">
                    ₹{cartTotal}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block">
                    Pickup Slot
                  </span>
                  <span className="text-xs font-extrabold text-brand-600">
                    {selectedPickupSlot || '12:35 PM'}
                  </span>
                </div>
              </div>

              {/* Payment Method Switcher */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                      : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Scan UPI QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash at Counter')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'Cash at Counter'
                      ? 'bg-brand-500 text-white border-brand-600 shadow-sm'
                      : 'bg-white border-cream-300 text-charcoal-700 hover:bg-cream-100'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span>Cash at Counter</span>
                </button>
              </div>

              {paymentMethod === 'UPI' ? (
                <div className="space-y-4">
                  
                  {/* Shopkeeper UPI QR Display Card */}
                  <div className="bg-white rounded-3xl border border-cream-300 p-5 shadow-subtle text-center space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-extrabold text-charcoal-900">
                        {PAYMENT_CONFIG.merchantName}
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                        ✓ Verified Merchant
                      </span>
                    </div>

                    {/* The User-Provided Paytm UPI QR Image */}
                    <div className="p-2 bg-cream-50 rounded-2xl border border-cream-200 inline-block shadow-inner max-w-[240px]">
                      <img
                        src={PAYMENT_CONFIG.qrImagePath}
                        alt="Paytm UPI QR Code for Deepak Das"
                        className="w-52 h-auto mx-auto rounded-xl object-contain shadow-sm"
                      />
                    </div>

                    {/* VPA / UPI ID Copy Pill */}
                    <div className="flex items-center justify-center gap-2">
                      <code className="text-xs font-mono font-bold text-charcoal-800 bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-200">
                        {PAYMENT_CONFIG.upiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyVpa}
                        className="p-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-charcoal-700 text-xs"
                        title="Copy UPI ID"
                      >
                        {copiedVpa ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Mobile 1-Tap UPI Intent Link */}
                    <a
                      href={upiDeepLink}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in GPay / PhonePe / Paytm</span>
                    </a>
                  </div>

                  {/* Payment Instructions */}
                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 space-y-1.5 text-[11px] text-charcoal-600">
                    <span className="font-bold text-charcoal-900 block">
                      Instructions to Complete Payment:
                    </span>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Open any UPI app (Paytm, GPay, PhonePe, BHIM).</li>
                      <li>Scan the QR code above or pay to <strong>{PAYMENT_CONFIG.upiId}</strong>.</li>
                      <li>Pay exact amount: <strong>₹{cartTotal}</strong>.</li>
                      <li>Enter the 12-digit UPI Reference Number (UTR) below and click <strong>"I Have Paid"</strong>.</li>
                    </ol>
                  </div>

                  {/* UTR Reference Input Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-charcoal-900 flex items-center justify-between">
                      <span>UPI Transaction ID / 12-Digit UTR Number *</span>
                      <span className="text-[10px] text-charcoal-400 font-normal">Required for Verification</span>
                    </label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="e.g. 433299182741"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full text-xs font-mono p-3 rounded-xl border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                      required
                    />
                  </div>

                  {/* Optional Payment Screenshot Upload */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-charcoal-700 block">
                      Attach Payment Screenshot (Optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer px-3.5 py-2 rounded-xl border border-cream-300 hover:bg-cream-100 text-xs font-bold text-charcoal-700 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Screenshot</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleSimulateScreenshotUpload}
                          className="hidden"
                        />
                      </label>
                      {screenshotPreview && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Screenshot Attached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <span>
                      <strong>Verification Gate:</strong> Your order will be placed as <em>Pending Payment Verification</em>. The shopkeeper reviews your UTR before kitchen preparation begins.
                    </span>
                  </div>
                </div>
              ) : (
                /* Cash at Counter View */
                <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200 space-y-3 text-center">
                  <Banknote className="w-10 h-10 text-amber-600 mx-auto" />
                  <h4 className="font-bold text-sm text-charcoal-900">
                    Pay at Counter Upon Pickup
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed max-w-xs mx-auto">
                    Pay <strong>₹{cartTotal} in cash</strong> at the Express Counter when collecting your food at {selectedPickupSlot}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-cream-200 bg-white flex items-center justify-between gap-3">
            {step === 'payment' ? (
              <button
                onClick={() => setStep('cart')}
                disabled={isProcessing}
                className="px-4 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-charcoal-700 hover:bg-cream-100"
              >
                Back to Tray
              </button>
            ) : (
              <button
                onClick={clearCart}
                className="text-xs font-medium text-charcoal-400 hover:text-red-500"
              >
                Clear All
              </button>
            )}

            {step === 'cart' ? (
              <button
                onClick={() => setStep('payment')}
                className="flex-1 max-w-xs ml-auto px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Proceed to Pay (₹{cartTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="flex-1 max-w-xs ml-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Payment...
                  </span>
                ) : (
                  <>
                    <span>I Have Paid (Submit UTR)</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
