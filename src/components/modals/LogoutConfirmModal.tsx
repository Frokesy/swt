import { LogOut, X } from 'lucide-react';
import { account } from '../../lib/appwrite';
import type { SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface LogoutConfirmModalProps {
  setLogoutModal: React.Dispatch<SetStateAction<boolean>>;
}

const LogoutConfirmModal = ({ setLogoutModal }: LogoutConfirmModalProps) => {
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setLogoutModal(false);
      window.location.href = '/auth/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setLogoutModal(false)}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <LogOut className="text-red-500 mx-auto mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
          <p className="text-gray-600 mb-5">
            Are you sure you want to log out?
          </p>

          <div className="flex justify-between gap-3">
            <button
              onClick={() => setLogoutModal(false)}
              className="w-1/2 border border-gray-400 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="w-1/2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LogoutConfirmModal;
