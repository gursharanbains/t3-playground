"use client";
import { create } from "zustand";

type Store = {
  authData: null;
  loading: boolean;
  setAuthData: (user: any) => void;
  setLoading: (isLoading: boolean) => void;
  reset: () => void;
};

const useStore = create<Store>((set) => ({
  authData: null,
  loading: false,
  setAuthData: (user) => set((state) => ({ ...state, authData: user })),
  setLoading: (isLoading) =>
    set((state) => ({ ...state, requestLoading: isLoading })),
  reset: () => set({ authData: null, loading: false }),
}));

export default useStore;
