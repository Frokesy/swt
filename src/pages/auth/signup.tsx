import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Lock, UserPlus, User } from "lucide-react";
import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import { NavLink } from "react-router-dom";
import { account } from "../../lib/appwrite";
import Toast from "../../components/defaults/Toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setTimeout(() => setError(null), 1800);
      return;
    }

    setLoading(true);

    try {
      await account.create("unique()", email, password, name);

      await account.createEmailPasswordSession(email, password);
      setTimeout(() => {
        setLoading(false);
        setToast(`Signup successful!`);
        setTimeout(() => {
          window.location.href = "/";
          setToast(null);
        }, 1800);
      }, 800);
    } catch (err) {
      setError("Signup failed. Please try again.");
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
          Create an Account 🌿
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 mb-10 text-center">
          Join our store and start shopping your favorites!
        </motion.p>

        <motion.form
          onSubmit={handleSignup}
          variants={fadeUp}
          className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
        >
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <User size={18} className="text-gray-500 mr-2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

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

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-600">
              <Lock size={18} className="text-gray-500 mr-2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span className="animate-pulse">Creating...</span>
            ) : (
              <>
                <UserPlus size={16} />
                Create Account
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <NavLink
              to="/auth/login"
              className="text-green-700 font-medium hover:underline"
            >
              Log in
            </NavLink>
          </p>
        </motion.form>
      </motion.div>

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
};

export default Signup;
