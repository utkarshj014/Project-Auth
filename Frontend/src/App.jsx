import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";

import FloatingShape from "./components/FloatingShape";
import {
  SignUpPage,
  LoginPage,
  EmailVerificationPage,
  LandingPage,
  HomePage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages";
import {
  useAuthActions,
  useAuthIsAuthenticated,
  useAuthIsCheckingAuth,
  useAuthIsVerified,
} from "./store/authStore";

function App() {
  const isCheckingAuth = useAuthIsCheckingAuth();
  const isAuthenticated = useAuthIsAuthenticated();
  const isVerified = useAuthIsVerified();
  const { checkAuth } = useAuthActions();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />

      {isCheckingAuth ? (
        <LoaderCircle className="size-10 mx-auto animate-spin text-white" />
      ) : (
        <Routes>
          <Route
            path="/home"
            element={
              isAuthenticated && isVerified ? (
                <HomePage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? <SignUpPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/verify-email"
            element={
              isAuthenticated && !isVerified ? (
                <EmailVerificationPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated || (isAuthenticated && !isVerified) ? (
                <LoginPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/forgot-password"
            element={
              !isAuthenticated ? (
                <ForgotPasswordPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              !isAuthenticated ? (
                <ResetPasswordPage />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Catch all other routes including "/" */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      )}

      <Toaster />
    </div>
  );
}

export default App;
