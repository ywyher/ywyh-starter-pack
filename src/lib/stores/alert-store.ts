import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AlertStore = {
  anonymousAlert: boolean;
  setAnonymousAlert: (anonymousAlert: boolean) => void;
  reset: () => void;
};

export const useAlertStore = create(
  persist<AlertStore>(
    (set) => ({
      anonymousAlert: false,
      setAnonymousAlert: (anonymousAlert) => set({ anonymousAlert }),
      reset: () =>
        set({
          anonymousAlert: false,
        }),
    }),
    {
      name: "alert-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const item = localStorage.getItem(name);
          if (!item) return null;

          const { state, timestamp } = JSON.parse(item);
          const now = Date.now();
          const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

          // Check if data is older than one day
          if (now - timestamp > oneDay) {
            localStorage.removeItem(name);
            return null;
          }

          return JSON.stringify(state);
        },
        setItem: (name, value) => {
          const item = {
            state: JSON.parse(value),
            timestamp: Date.now(),
          };
          localStorage.setItem(name, JSON.stringify(item));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      })),
    },
  ),
);
