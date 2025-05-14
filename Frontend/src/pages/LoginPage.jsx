import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Loader, Lock, Mail } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";
import {
  useAuthActions,
  useAuthError,
  useAuthIsAuthenticated,
  useAuthIsLoading,
  useAuthIsVerified,
} from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isAuthenticated = useAuthIsAuthenticated();
  const isVerified = useAuthIsVerified();
  const error = useAuthError();
  const isLoading = useAuthIsLoading();
  const { login, clearError } = useAuthActions();

  const navigate = useNavigate();

  // Clear error messages when the component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ email, password });
    } catch (error) {
      console.log(error);
    }
  };

  // After login, check if user is verified and navigate accordingly
  /* However this works only in the case when LoginPage is not unmounted i.e.; when {isAu.. = true but isVe.. = false} or if both were true, then we don't even mount LoginPage, we navigate to "/" from App.jsx itself */
  useEffect(() => {
    isAuthenticated
      ? isVerified
        ? navigate("/")
        : navigate("/verify-email")
      : null;
  }, [isAuthenticated, isVerified, navigate]);

  return (
    <>
      {motion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Welcome Back
            </h2>

            <form onSubmit={handleLogin}>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex justify-end items-center -mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}

              <Button
                applyClass="mt-6 disabled:opacity-50"
                btnType="submit"
                btnText={
                  isLoading ? (
                    <Loader className="w-6 h-6 mx-auto animate-spin" />
                  ) : (
                    "Login"
                  )
                }
                disabled={isLoading}
              />
            </form>
          </div>

          <div className="flex justify-center px-8 py-4 bg-gray-900/50">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-400 hover:underline">
                Signup
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default LoginPage;
