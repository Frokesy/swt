import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, LogIn } from "lucide-react";
import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import { NavLink } from "react-router-dom";
import { account } from "../../lib/appwrite";
import { useLocation } from "react-router-dom";
import Toast from "../../components/defaults/Toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await account.createEmailPasswordSession(email, password);

      setTimeout(() => {
        setLoading(false);
        setToast(`Logged in successfully!`);
        setTimeout(() => {
          window.location.href = from;
          setToast(null);
        }, 1800);
      }, 800);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      setTimeout(() => setError(null), 1800);
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
          Welcome Back 👋
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 mb-10 text-center">
          Login to continue shopping and manage your orders.
        </motion.p>

        <motion.form
          onSubmit={handleLogin}
          variants={fadeUp}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <Mail size={18} className="text-gray-500 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium"
          >
            {loading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              <>
                <LogIn size={16} />
                Login
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <NavLink
              to="/auth/signup"
              className="text-green-700 font-medium hover:underline"
            >
              Sign up
            </NavLink>
          </p>
        </motion.form>
      </motion.div>
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
};

export default Login;
