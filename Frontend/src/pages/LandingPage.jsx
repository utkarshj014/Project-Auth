import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Button from "../components/Button";
import LogoutButton from "../components/LogoutButton";
import { useAuthIsAuthenticated } from "../store/authStore";

const LandingPage = () => {
  const isAuthenticated = useAuthIsAuthenticated();

  const navigate = useNavigate();

  return (
    <>
      {motion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8 flex justify-between items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  btnType="button"
                  onClick={() => navigate("/home")}
                  btnText="Home"
                />

                <LogoutButton />
              </>
            ) : (
              <>
                <Button
                  btnType="button"
                  onClick={() => navigate("/signup")}
                  btnText="Signup"
                />
                <Button
                  btnType="button"
                  onClick={() => navigate("/login")}
                  btnText="Login"
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default LandingPage;
