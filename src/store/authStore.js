import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";
// authStore.js
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      fetchUser: async () => {
        // Check URL for token first (after OAuth redirect)
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");
        if (urlToken) {
          set({ token: urlToken });
          // Clean token from URL without triggering re-render
          window.history.replaceState({}, "", window.location.pathname);
        }

        const token = urlToken || get().token;
        if (!token) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const res = await api.get("/auth/me");
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error(error);
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
          window.location.href = "/";
        }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, token: null, isAuthenticated: false }),
      updateDailyUsage: (dailyUsage) =>
        set((state) => ({
          user: state.user ? { ...state.user, dailyUsage } : state.user,
        })),
    }),
    {
      name: "echo-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useAuthStore;
