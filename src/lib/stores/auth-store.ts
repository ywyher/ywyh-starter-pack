import type { Dispatch, SetStateAction } from "react";
import { create } from "zustand";

type AuthStore = {
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthDialogOpen: false,
  setIsAuthDialogOpen: (value) =>
    set((state) => ({
      isAuthDialogOpen:
        typeof value === "function" ? value(state.isAuthDialogOpen) : value,
    })),
}));
