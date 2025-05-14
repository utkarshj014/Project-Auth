import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Button from "../components/Button";
import {
  useAuthActions,
  useAuthError,
  useAuthIsLoading,
} from "../store/authStore";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const isLoading = useAuthIsLoading();
  const error = useAuthError();
  const { clearError, resetPassword } = useAuthActions();

  const navigate = useNavigate();
  const { token } = useParams();

  // Clear error messages when the component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!password || !confirmPassword) {
      setLocalError("Both fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({ password }, token);
      setIsPasswordReset(true);
      setTimeout(() => navigate("/login"), 5000);
      toast.success("Your password has been successfully reset!");
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
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Reset Password
            </h2>

            {!isPasswordReset ? (
              <form onSubmit={handleResetPassword}>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* If local ERROR exists then show it, no need to check RESPONSE ERROR but if not then show the RESPONSE ERROR(if there is any) */}
                {localError ? (
                  <p className="text-red-500 font-semibold mt-2">
                    {localError}
                  </p>
                ) : (
                  error && (
                    <p className="text-red-500 font-semibold mt-2">{error}</p>
                  )
                )}

                {/* Password Strength meter */}
                {password && <PasswordStrengthMeter password={password} />}

                <Button
                  applyClass="mt-5 disabled:opacity-50"
                  btnType="submit"
                  btnText={isLoading ? "Resetting..." : "Reset Password"}
                  disabled={isLoading}
                />
              </form>
            ) : (
              <p className="text-gray-300 text-center text-[1.1rem]">
                Redirecting to login page.
              </p>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ResetPasswordPage;
