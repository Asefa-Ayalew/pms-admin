import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie, getCookie } from "cookies-next";

export interface Auth {
  loading: boolean;
  role: any | null;
}

const validateJson = () => {
  if (getCookie("currentRole")) {
    try {
      const currentRole = getCookie("currentRole") as string | undefined;
      return currentRole ? JSON.parse(currentRole) : null;
    } catch (e) {
      deleteCookie("currentRole");
      return null;
    }
  }
};

const initialState: Auth = {
  loading: false,
  role: validateJson(),
};

export const authSlice = createSlice({
  name: "authLoading",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>): void => {
      state.loading = action.payload;
    },
    setRole: (state, action: PayloadAction<any>): void => {
      state.role = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLoading, setRole } = authSlice.actions;
export default authSlice.reducer;
