import React, { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  X,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Order } from '../../types';

interface GroupOrderingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const GroupOrderingModal: React.FC<GroupOrderingModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted,
}) => {
  const {
    currentUser,
    activeGroupOrder,
    createGroupOrder,
    joinGroupOrder,
    checkoutGroupOrder,
    leaveGroupOrder,
    selectedCanteenId,
    selectedPickupSlot,
    breakSchedules,
    cart,
    foodItems,
    addItemsToGroupOrder,
  } = useBreakBite();

  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const targetBreak = breakSchedules[1]; // lunch default

  const handleCreateRoom = () => {
    createGroupOrder(
      selectedCanteenId,
      targetBreak.name,
      selectedPickupSlot || '12:30 PM'
    );
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const ok = joinGroupOrder(inputCode.trim());
    if (!ok) {
      alert(`Room code "${inputCode}" not found. You can start a new room!`);
    }
  };

  const handleCopy = () => {
    if (!activeGroupOrder) return;
    navigator.clipboard?.writeText(activeGroupOrder.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSimulateFriendJoining = () => {
    if (!activeGroupOrder) return;
    // Add simulated friend items
    const randomFood = foodItems[Math.floor(Math.random() * 5)];
    addItemsToGroupOrder(activeGroupOrder.roomCode, [
      { foodItem: randomFood, quantity: 1 },
    ]);
  };

  const handleGroupCheckout = async () => {
    if (!activeGroupOrder) return;
    setIsSubmitting(true);
    try {
      const order = await checkoutGroupOrder(activeGroupOrder.roomCode, 'UPI');
      setIsSubmitting(false);
      onClose();
      if (order) onOrderCompleted(order);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Calculate total items across group
  const totalGroupItems =
    activeGroupOrder?.members.reduce(
      (sum, m) => sum + m.items.reduce((s, i) => s + i.quantity, 0),
      0
    ) || 0;

  const totalGroupCost =
    activeGroupOrder?.members.reduce(
      (sum, m) =>
        sum + m.items.reduce((s, i) => s + i.foodItem.price * i.quantity, 0),
      0
    ) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-floating border border-cream-200 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-charcoal-900">
                Group Break Ordering
              </h2>
              <span className="text-[11px] text-charcoal-500">
                Pool orders with friends • Collect with 1 single token
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!activeGroupOrder ? (
            <div className="space-y-6">
              {/* Option 1: Create room */}
              <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200 text-center space-y-3">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block">
                  Host an Order
                </span>
                <h3 className="text-base font-extrabold text-charcoal-900">
                  Create a Campus Group Room
                </h3>
                <p className="text-xs text-charcoal-600 max-w-xs mx-auto leading-relaxed">
                  Start an order for your class group. Friends can join with a 6-digit code and pick their items.
                </p>
                <button
                  onClick={handleCreateRoom}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Create Group Room
                </button>
              </div>

              {/* Divider */}
              <div className="relative text-center">
                <span className="bg-white px-3 text-[11px] font-bold text-charcoal-400 uppercase tracking-wider relative z-10">
                  Or Join Existing Group
                </span>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t border-cream-200" />
              </div>

              {/* Option 2: Join room */}
              <form onSubmit={handleJoinRoom} className="space-y-3">
                <label className="text-xs font-bold text-charcoal-700 block">
                  Enter 6-Digit Room Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 583921"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="flex-1 text-center font-mono tracking-widest text-lg font-black p-2.5 rounded-xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800"
                  >
                    Join Room
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ACTIVE GROUP ROOM */
            <div className="space-y-5">
              {/* Room Header Code Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900 to-charcoal-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                    Share Room Code With Friends
                  </span>
                  <div className="text-3xl font-black font-mono tracking-widest text-white mt-0.5">
                    {activeGroupOrder.roomCode}
                  </div>
                  <span className="text-[11px] text-cream-200 mt-1 block">
                    Slot: {activeGroupOrder.pickupTime} • {activeGroupOrder.canteenName}
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Members in session */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                    Group Members ({activeGroupOrder.members.length})
                  </span>
                  <button
                    onClick={handleSimulateFriendJoining}
                    className="text-[11px] text-purple-600 hover:text-purple-700 font-bold"
                  >
                    + Simulate Friend Adding Samosa
                  </button>
                </div>

                <div className="space-y-2">
                  {activeGroupOrder.members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={member.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={member.userName}
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-cream-300"
                        />
                        <div>
                          <div className="font-bold text-charcoal-900 flex items-center gap-1.5">
                            {member.userName}
                            {member.userId === activeGroupOrder.hostUserId && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                                Host
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-charcoal-500">
                            {member.items.length === 0
                              ? 'Browsing menu...'
                              : member.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="font-extrabold text-charcoal-900">
                        ₹
                        {member.items.reduce(
                          (s, i) => s + i.foodItem.price * i.quantity,
                          0
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Group Cost Breakdown */}
              <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-charcoal-500 block">Total Group Tray:</span>
                  <span className="text-lg font-black text-charcoal-900">
                    ₹{totalGroupCost}
                  </span>
                  <span className="text-[10px] text-charcoal-500 block">
                    ({totalGroupItems} items combined)
                  </span>
                </div>

                <div className="text-right text-[11px] text-emerald-700 font-bold">
                  ✓ 1 Single Express Token for all friends
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {activeGroupOrder && (
          <div className="p-5 border-t border-cream-200 bg-white flex items-center justify-between gap-3">
            <button
              onClick={leaveGroupOrder}
              className="text-xs font-semibold text-charcoal-500 hover:text-red-500"
            >
              Leave Room
            </button>

            <button
              onClick={handleGroupCheckout}
              disabled={isSubmitting || totalGroupItems === 0}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-2"
            >
              {isSubmitting ? (
                'Processing Group Token...'
              ) : (
                <>
                  <span>Checkout Group (₹{totalGroupCost})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
