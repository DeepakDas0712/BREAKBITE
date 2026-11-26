import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Clock,
  Flame,
  Star,
  Plus,
  Minus,
  Check,
  ShoppingBag,
  Sparkles,
  Store,
  ChevronDown,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { FoodCategory, FoodItem } from '../../types';

interface MenuCatalogProps {
  onOpenCart: () => void;
  onOpenScheduler: () => void;
}

const CATEGORIES: FoodCategory[] = [
  'All',
  'Breakfast',
  'Snacks',
  'South Indian',
  'North Indian',
  'Beverages',
  'Meals',
  'Combos',
];

export const MenuCatalog: React.FC<MenuCatalogProps> = ({ onOpenCart, onOpenScheduler }) => {
  const {
    foodItems,
    canteens,
    selectedCanteenId,
    setSelectedCanteenId,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    cartItemCount,
    cartTotal,
    selectedPickupSlot,
  } = useBreakBite();

  const [activeCategory, setActiveCategory] = useState<FoodCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  const selectedCanteen =
    canteens.find((c) => c.id === selectedCanteenId) || canteens[0];

  // Filter items
  const filteredItems = useMemo(() => {
    return foodItems.filter((item) => {
      // Must match selected canteen
      if (item.canteenId !== selectedCanteenId) return false;

      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }

      // Veg filter
      if (vegOnly && !item.isVeg) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [foodItems, selectedCanteenId, activeCategory, vegOnly, searchQuery]);

  const getItemCartQty = (itemId: string) => {
    const found = cart.find((c) => c.foodItem.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Canteen Selector */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
            Selected Counter
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-charcoal-900">
              {selectedCanteen.name}
            </h1>
            <span className="text-xs font-bold text-charcoal-600 bg-cream-100 px-2.5 py-1 rounded-md">
              {selectedCanteen.counterNumber}
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            {selectedCanteen.location} • Slot: <strong>{selectedPickupSlot || '12:30 PM'}</strong>
          </p>
        </div>

        {/* Canteen Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-charcoal-500 shrink-0">Switch Counter:</label>
          <div className="relative">
            <select
              value={selectedCanteenId}
              onChange={(e) => setSelectedCanteenId(e.target.value)}
              className="appearance-none bg-cream-100 border border-cream-300 text-charcoal-900 text-xs font-bold py-2.5 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
            >
              {canteens.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.rating}★)
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-charcoal-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          <button
            onClick={onOpenScheduler}
            className="px-3 py-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-600 text-xs font-bold hover:bg-brand-100 transition-colors"
          >
            Change Slot
          </button>
        </div>
      </div>

      {/* Search Bar & Dietary Filter Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search samosas, dosas, sandwiches, beverages, combos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-cream-300 rounded-2xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-subtle"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-charcoal-400 hover:text-charcoal-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Veg-only toggle */}
        <div className="flex items-center gap-2 bg-white border border-cream-300 rounded-2xl px-4 py-2 shadow-subtle shrink-0">
          <span className="w-3.5 h-3.5 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          </span>
          <span className="text-xs font-bold text-charcoal-700">Veg Only</span>
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            className="accent-brand-500 rounded cursor-pointer w-4 h-4 ml-1"
          />
        </div>
      </div>

      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-charcoal-900 text-white shadow-subtle scale-102'
                  : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Food Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-cream-200 p-12 text-center max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-cream-100 text-charcoal-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-charcoal-900">No food items found</h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Try adjusting your search query or switch categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setVegOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const qty = getItemCartQty(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Food Image & Badges */}
                  <div className="h-44 relative bg-cream-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Prep time badge */}
                    <div className="absolute top-3 left-3 bg-charcoal-900/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-brand-400" />
                      <span>{item.prepTimeMinutes}m prep</span>
                    </div>

                    {/* Dietary badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md p-1 rounded-md shadow-sm">
                      <span className="w-4 h-4 rounded-sm border border-emerald-600 bg-white flex items-center justify-center p-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      </span>
                    </div>

                    {/* Popularity pill */}
                    {item.isBestSeller && (
                      <div className="absolute bottom-3 left-3 bg-brand-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-sm">
                        Campus Bestseller
                      </div>
                    )}
                  </div>

                  {/* Content details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-extrabold text-base text-charcoal-900 group-hover:text-brand-500 transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-charcoal-700 bg-cream-100 px-1.5 py-0.5 rounded shrink-0">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>{item.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 mt-3 text-[11px] text-charcoal-400">
                      <span>{item.calories} kcal</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                </div>

                {/* Price and Add/Counter Controls */}
                <div className="p-5 pt-0 border-t border-cream-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase block">
                      Price
                    </span>
                    <span className="text-lg font-black text-charcoal-900">
                      ₹{item.price}
                    </span>
                  </div>

                  {!item.isAvailable ? (
                    <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl">
                      Sold Out
                    </span>
                  ) : qty > 0 ? (
                    <div className="flex items-center gap-2 bg-charcoal-900 text-white rounded-xl p-1 shadow-md">
                      <button
                        onClick={() => updateCartQuantity(item.id, qty - 1)}
                        className="w-7 h-7 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 flex items-center justify-center transition-colors text-white"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs px-2">{qty}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, qty + 1)}
                        className="w-7 h-7 rounded-lg bg-brand-500 hover:bg-brand-600 flex items-center justify-center transition-colors text-white"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item, 1)}
                      className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Tray Summary Bar for Mobile / Quick View */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 bg-charcoal-900 text-white rounded-2xl p-4 shadow-floating border border-charcoal-700 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-brand-400 uppercase tracking-wide">
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''} in tray
            </div>
            <div className="text-base font-extrabold text-white">
              Total: ₹{cartTotal}
            </div>
          </div>

          <button
            onClick={onOpenCart}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>Review Tray</span>
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
