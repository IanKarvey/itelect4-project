import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  // Handed the token and name the API returned. Nothing is invented here.
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

// This file must not import ../api/client. client.ts reads the token out
// of this store on every request, so the two would import each other.
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setSession: (token, userName) => set({ token, userName }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth",
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;

// The token is good for two hours (expiresIn in the backend's login
// route). persist keeps it across a reload, so the app can come back
// holding one the API no longer accepts: the next request answers 401,
// and logging out then in again is the fix.
