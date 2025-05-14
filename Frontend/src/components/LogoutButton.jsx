import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../components/Button";
import { useAuthActions, useAuthIsLoading } from "../store/authStore";

const LogoutButton = () => {
  const [isConfirming, setIsConfirming] = useState(false);

  const isLoading = useAuthIsLoading();
  const { logout } = useAuthActions();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Error logging out!!");
    }
  };

  const showLogoutPrompt = () => {
    // Prevent multiple click on the button
    setIsConfirming(true);

    const toastID = toast(
      (t) => (
        <span>
          Are you <b>sure?</b>{" "}
          <button
            className="py-1 px-3 bg-gray-300 rounded-sm cursor-pointer"
            onClick={() => {
              handleLogout();
              toast.dismiss(t.id);
              setIsConfirming(false);
            }}
          >
            Yes
          </button>{" "}
          <button
            className="py-1 px-3 bg-gray-300 rounded-sm cursor-pointer"
            onClick={() => {
              toast.dismiss(t.id);
              setIsConfirming(false);
            }}
          >
            No
          </button>
        </span>
      ),
      {
        duration: 5000,
      }
    );

    // Auto-dismiss the toast after 5 seconds and enable the LOGOUT button again
    setTimeout(() => {
      if (toastID) {
        toast.dismiss(toastID);
        setIsConfirming(false);
      }
    }, 5000);
  };

  return (
    <Button
      applyClass="disabled:opacity-50"
      btnType="button"
      onClick={showLogoutPrompt}
      btnText="Logout"
      disabled={isConfirming || isLoading}
    />
  );
};

export default LogoutButton;
