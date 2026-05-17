import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { account } from '../../lib/appwrite';

interface ForgotPasswordModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const ForgotPasswordModal = ({ onClose, isOpen }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // The redirect URL should point to the reset password page
      const redirectUrl = `${window.location.origin}/auth/reset-password`;
      await account.createRecovery(email, redirectUrl);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email. Please try again.');
    } finally {
      setLoading(false);
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
        className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md relative"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          disabled={loading}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <Mail className="text-green-600 mx-auto mb-3" size={32} />
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            {success ? 'Email Sent!' : 'Forgot Password?'}
          </h3>
          <p className="text-gray-600 mb-6">
            {success
              ? 'Check your email for password reset instructions.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </p>

          {!success && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
                  <Mail size={18} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full outline-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}

              <div className="flex justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="flex-1 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={16} />
                      Send Reset Link
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {success && (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordModal;