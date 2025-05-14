import { create } from "zustand";
import axios from "axios";
import { useShallow } from "zustand/shallow";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api/auth"
    : "/api/auth";

const axiosAuth = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include credentials (cookies) in requests
});

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: false,

  clearError: () => set({ error: null }),

  signup: async (userData) => {
    const { email, password, name } = userData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      set({ error: "All fields are required!!" });
      throw new Error("All fields are required!!");
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axiosAuth.post(`/signup`, userData);
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response?.data?.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error signing up!!",
      });

      throw error;
    }
  },

  login: async (userData) => {
    const { email, password } = userData;

    if (!email.trim() || !password.trim()) {
      set({ error: "All fields are required!!" });
      throw new Error("All fields are required!!");
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axiosAuth.post("/login", userData);
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response?.data?.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error logging in!!",
      });

      throw error;
    }
  },

  verifyEmail: async (userData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosAuth.post("/verify-email", userData);
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response?.data?.user,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error?.response?.data?.message || "Error verifying email!!",
      });

      throw error;
    }
  },

  forgotPassword: async (userData) => {
    const { email } = userData;

    if (!email.trim()) {
      set({ error: "Email is required!!" });
      throw new Error("Email is required!!");
    }

    set({ isLoading: true, error: null });

    try {
      await axiosAuth.post("/forgot-password", userData);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message ||
          "Error sending reset password link!!",
      });

      throw error;
    }
  },

  resetPassword: async (userData, token) => {
    const { password } = userData;

    if (!password.trim()) {
      set({ error: "Password is required!!" });
      throw new Error("Password is required!!");
    }

    set({ isLoading: true, error: null });

    try {
      await axiosAuth.post(`/reset-password/${token}`, userData);
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error?.response?.data?.message || "Error resetting the password!!",
      });

      throw error;
    }
  },

  logout: async () => {
    set({ error: null, isLoading: true });

    try {
      await axiosAuth.post("/logout");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({
        error: error?.response?.data?.message || "Error logging out!!",
        isLoading: false,
      });

      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axiosAuth.get("/check-auth");
      set({
        isCheckingAuth: false,
        user: response?.data?.user,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        isCheckingAuth: false,
        user: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },
}));

// CUSTOM HOOKS

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthIsVerified = () =>
  useAuthStore((state) => state.user?.isVerified);
export const useAuthIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthIsCheckingAuth = () =>
  useAuthStore((state) => state.isCheckingAuth);

export const useAuthActions = () =>
  useAuthStore(
    useShallow((state) => ({
      clearError: state.clearError,
      signup: state.signup,
      login: state.login,
      verifyEmail: state.verifyEmail,
      forgotPassword: state.forgotPassword,
      resetPassword: state.resetPassword,
      logout: state.logout,
      checkAuth: state.checkAuth,
    }))
  );
