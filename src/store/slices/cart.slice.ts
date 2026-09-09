import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId,
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        return;
      }

      state.items.push(action.payload);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const item = state.items.find(
        (cartItem) => cartItem.productId === action.payload.productId,
      );

      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, updateCartItemQuantity, removeFromCart, clearCart, setCartItems } =
  cartSlice.actions;

export default cartSlice.reducer;
