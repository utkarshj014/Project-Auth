import { Hand } from "lucide-react";
import { motion } from "motion/react";

import LogoutButton from "../components/LogoutButton";
import { useAuthUser } from "../store/authStore";

const HomePage = () => {
  const user = useAuthUser();

  return (
    <>
      {motion && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text flex items-center justify-center gap-2">
              Hello! <Hand className="size-6 text-green-400" />
            </h2>

            <div className="space-y-4 mb-6 text-white">
              <div className="flex justify-between bg-gray-700/40 p-3 rounded-lg">
                <span className="font-semibold text-gray-300">Name:</span>
                <span className="text-right break-all">
                  {user?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex justify-between bg-gray-700/40 p-3 rounded-lg">
                <span className="font-semibold text-gray-300">Email:</span>
                <span className="text-right break-all">
                  {user?.email || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between bg-gray-700/40 p-3 rounded-lg">
                <span className="font-semibold text-gray-300">
                  Account created:
                </span>
                <span className="text-right break-all">
                  {new Intl.DateTimeFormat("en-In", {
                    dateStyle: "medium",
                  }).format(new Date(user?.createdAt)) || "Unknown"}
                </span>
              </div>
            </div>

            <LogoutButton />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default HomePage;
