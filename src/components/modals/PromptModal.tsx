import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface PromptModalProps {
  title: string;
  message: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  isRequired?: boolean;
  onConfirm: (value: string) => void | Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
}

const PromptModal = ({
  title,
  message,
  placeholder = 'Enter text...',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isRequired = false,
  onConfirm,
  onCancel,
  isOpen,
  isLoading = false,
}: PromptModalProps) => {
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isRequired && !value.trim()) return;
    await onConfirm(value);
    setValue('');
  };

  const handleCancel = () => {
    setValue('');
    onCancel();
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
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
          <p className="text-gray-600 mb-4">{message}</p>

          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
          />

          {isRequired && !value.trim() && (
            <p className="text-red-500 text-sm mt-2">This field is required.</p>
          )}

          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || (isRequired && !value.trim())}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PromptModal;
