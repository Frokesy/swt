import { X, AlertCircle, CheckCircle, InfoIcon, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertModalProps {
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  isOpen: boolean;
}

const AlertModal = ({
  title,
  message,
  type = 'info',
  onClose,
  isOpen,
}: AlertModalProps) => {
  if (!isOpen) return null;

  const iconMap = {
    success: <CheckCircle className="text-green-500" size={32} />,
    error: <XCircle className="text-red-500" size={32} />,
    warning: <AlertCircle className="text-yellow-500" size={32} />,
    info: <InfoIcon className="text-blue-500" size={32} />,
  };

  const bgMap = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50',
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
        className={`${bgMap[type]} rounded-xl shadow-lg p-6 w-[90%] max-w-sm relative border-l-4 ${
          type === 'success'
            ? 'border-green-500'
            : type === 'error'
              ? 'border-red-500'
              : type === 'warning'
                ? 'border-yellow-500'
                : 'border-blue-500'
        }`}
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-3">{iconMap[type]}</div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 mb-5">{message}</p>

          <button
            onClick={onClose}
            className={`w-full py-2 rounded-lg font-medium text-white transition-colors ${
              type === 'success'
                ? 'bg-green-600 hover:bg-green-700'
                : type === 'error'
                  ? 'bg-red-600 hover:bg-red-700'
                  : type === 'warning'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AlertModal;
