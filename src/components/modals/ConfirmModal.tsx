import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
}

const ConfirmModal = ({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isOpen,
  isLoading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

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
          onClick={onCancel}
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          {isDangerous && (
            <AlertTriangle className="text-red-500 mx-auto mb-3" size={32} />
          )}
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-between gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 text-white ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmModal;
