/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Eye, EyeClosed, Loader2 } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(email, password);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-green-700 mb-2">Rehubot</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Admin Login
          </h2>
          <p className="text-gray-600 text-center text-sm mb-6">
            Sign in to manage your store
          </p>

          {error && (
            <motion.div
              variants={fadeUp}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm">{error}</p>
            </motion.div>
          )}

          <motion.form
            onSubmit={handleLogin}
            variants={fadeUp}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rehubot.com"
                  className="w-full outline-none bg-transparent text-gray-800"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
                <div className="flex items-center w-full">
                  <Lock size={18} className="text-gray-400 mr-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full outline-none bg-transparent text-gray-800"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-green-500 cursor-not-allowed'
                  : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </motion.button>
          </motion.form>

          <motion.p
            variants={fadeUp}
            className="text-center text-gray-600 text-sm mt-6"
          >
            Not an admin?{' '}
            <a
              href="/"
              className="text-green-700 font-semibold hover:underline"
            >
              Back to store
            </a>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
