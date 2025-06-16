import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import Button from "../components/Button";
import {
  useAuthActions,
  useAuthError,
  useAuthIsLoading,
  useAuthUser,
} from "../store/authStore";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const user = useAuthUser();
  const error = useAuthError();
  const isLoading = useAuthIsLoading();
  const { verifyEmail, clearError } = useAuthActions();

  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      //Focus on the last non-empty input or the first emppty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Clear error messages when the component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const verificationCode = code.join("");
      try {
        await verifyEmail({ verificationCode, email: user?.email });
        toast.success("Email verified successfully!");
        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    [code, user, verifyEmail, navigate]
  );

  //   Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code, handleSubmit]);

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
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text">
              Verify Your Email
            </h2>

            <p className="text-center text-gray-300 mb-6">
              Enter the 6-digit code sent to your email address
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="6"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-500 font-semibold mt-2">{error}</p>
              )}

              <Button
                applyClass={!isLoading ? "disabled:opacity-50" : null}
                btnType="submit"
                btnText={isLoading ? "Verifying..." : "Verify"}
                disabled={code.some((digit) => digit === "") || isLoading}
              />
            </form>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default EmailVerificationPage;
