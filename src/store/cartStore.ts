import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

// ── 타입 정의 ──────────────────────────────────────
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void; // ← 이 줄 추가!
  totalCount: () => number;
  totalPrice: () => number;
}

// ── 스토어 생성 ────────────────────────────────────
export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],

        // 상품 추가 — 이미 담긴 상품이면 수량만 증가
        addItem: (product) => {
          set((state) => {
            const existing = state.items.find((item) => item.id === product.id);
            if (existing) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                ),
              };
            }
            return { items: [...state.items, { ...product, quantity: 1 }] };
          });
        },

        // 상품 제거
        removeItem: (id) => {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          }));
        },

        // 수량 변경 — 0 이하면 제거
        updateQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeItem(id);
            return;
          }
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          }));
        },

        // 장바구니 전체 비우기 (주문 완료 후 사용)
        clearCart: () => set({ items: [] }),

        // DB에서 가져온 장바구니로 로컬 덮어쓰기 
        setCart: (items) => set({ items }), // ← 이 줄 추가!


        // 총 상품 수 (배지에 표시)
        totalCount: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),

        // 총 금액
        totalPrice: () =>
          get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
      }),
      { name: "cart-storage" }, // localStorage key 이름
    ),
    { name: "CartStore" }, // Redux DevTools에 표시될 이름
  ),
);
