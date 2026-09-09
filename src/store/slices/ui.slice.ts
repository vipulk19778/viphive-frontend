import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isSidebarOpen: boolean;
  isLoading: boolean;
}

const initialState: UiState = {
  isSidebarOpen: false,
  isLoading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSidebarOpen, toggleSidebar, setLoading } = uiSlice.actions;

export default uiSlice.reducer;
