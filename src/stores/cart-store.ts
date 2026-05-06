import { create } from "zustand";

interface CartStore {
  cartId: string | null;
  itemCount: number;
  drawerOpen: boolean;
  setCartId: (id: string) => void;
  setItemCount: (count: number) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cartId: null,
  itemCount: 0,
  drawerOpen: false,
  setCartId: (id) => set({ cartId: id }),
  setItemCount: (count) => set({ itemCount: count }),
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
}));
