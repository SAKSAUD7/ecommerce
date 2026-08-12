import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setTokens: (access, refresh) => set({ 
        accessToken: access, 
        refreshToken: refresh,
        isAuthenticated: true 
      }),
      setUser: (user) => set({ user }),
      logout: () => set({ 
        accessToken: null, 
        refreshToken: null, 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'aura-auth-storage',
    }
  )
)
