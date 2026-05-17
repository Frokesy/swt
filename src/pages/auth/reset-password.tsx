import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Eye, EyeClosed, Key } from 'lucide-react';
import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { account } from '../../lib/appwrite';
import Toast from '../../components/defaults/Toast';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get('userId');
  const secret = searchParams.get('secret');

  useEffect(() => {
    if (!userId || !secret) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [userId, secret]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !secret) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await account.updateRecovery(userId, secret, password);

      setTimeout(() => {
        setLoading(false);
        setToast('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
      setTimeout(() => setError(null), 3000);
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <motion.div
        className="w-[90%] md:w-[60%] lg:w-[40%] mx-auto my-16 text-[#333]"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-[26px] font-semibold text-green-700 mb-4 text-center"
        >
          Reset Your Password 🔑
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 mb-10 text-center">
          Enter your new password below.
        </motion.p>

        <motion.form
          onSubmit={handleResetPassword}
          variants={fadeUp}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <div className="flex items-center w-[90%]">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full outline-none"
                  required
                  minLength={8}
                />
              </div>
              <div className="">
                {showPassword ? (
                  <Eye
                    size={18}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <EyeClosed
                    size={18}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <div className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <div className="flex items-center w-[90%]">
                <Key size={18} className="text-gray-500 mr-2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full outline-none"
                  required
                  minLength={8}
                />
              </div>
              <div className="">
                {showConfirmPassword ? (
                  <Eye
                    size={18}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                ) : (
                  <EyeClosed
                    size={18}
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !userId || !secret}
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="animate-pulse">Resetting...</span>
            ) : (
              <>
                <Key size={16} />
                Reset Password
              </>
            )}
          </button>
        </motion.form>
      </motion.div>
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
};

export default ResetPassword;