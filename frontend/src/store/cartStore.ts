import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  variantId: number;
  title: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          // Generate a unique ID based on product details (title + size + color)
          const id = `${newItem.title}-${newItem.size}-${newItem.color}`.replace(/\s+/g, '-').toLowerCase()
          const existingItemIndex = state.items.findIndex(i => i.id === id)
          
          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += newItem.quantity
            return { items: newItems }
          }
          
          // Item doesn't exist, add it
          return { items: [...state.items, { ...newItem, id }] }
        })
      },
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter(i => i.id !== id) 
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      cartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'aura-cart-storage',
    }
  )
)
