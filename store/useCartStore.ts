import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  image?: string
  specialInstructions?: string
}

interface CartStore {
  items: CartItem[]
  restaurantId: string | null
  addItem: (item: CartItem) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      
      addItem: (item) => {
        const currentItems = get().items
        const existingItem = currentItems.find(i => i.id === item.id)
        
        if (existingItem) {
          set({
            items: currentItems.map(i =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          })
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            restaurantId: item.restaurantId
          })
        }
      },
      
      removeItem: (itemId) => {
        set({ items: get().items.filter(i => i.id !== itemId) })
      },
      
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId)
        } else {
          set({
            items: get().items.map(i =>
              i.id === itemId ? { ...i, quantity } : i
            )
          })
        }
      },
      
      clearCart: () => set({ items: [], restaurantId: null }),
      
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)