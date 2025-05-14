import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import toast from "react-hot-toast";

import Input from "../components/Input";
import Button from "../components/Button";
import {
  useAuthActions,
  useAuthError,
  useAuthIsLoading,
} from "../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isResetLinkSent, setIsResetLinkSent] = useState(false);

  const error = useAuthError();
  const isLoading = useAuthIsLoading();
  const { clearError, forgotPassword } = useAuthActions();

  // Clear error messages when the component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword({ email });
      setIsResetLinkSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.log(error);
    }
  };

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
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Forgot Password?
            </h2>

            {isResetLinkSent ? (
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>

                <p className="text-gray-300 text-center text-[1.1rem]">
                  You will receive a password reset link shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <p className="text-gray-300 text-center mb-6">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Error message */}
                {error && (
                  <p className="text-red-500 font-semibold -mt-3 mb-4">
                    {error}
                  </p>
                )}

                <Button
                  applyClass="mt-2 disabled:opacity-50"
                  btnType="submit"
                  btnText={
                    isLoading ? (
                      <Loader className="w-6 h-6 mx-auto animate-spin" />
                    ) : (
                      "Get Password Reset Link"
                    )
                  }
                  disabled={isLoading}
                />
              </form>
            )}
          </div>

          <div className="px-8 py-4 bg-gray-900/50 text-center">
            <Link
              to="/login"
              className="text-green-400 flex justify-center items-center gap-1 hover:underline"
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ForgotPassword;
