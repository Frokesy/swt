import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Slide, toast } from 'react-toastify';
import { XCircle } from 'lucide-react';

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.info('⚠️ Payment was cancelled.', {
      position: 'top-center',
      autoClose: 2000,
      transition: Slide,
      hideProgressBar: true,
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-gray-700">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto px-6"
      >
        <XCircle size={60} className="text-red-600 mx-auto mb-4" />
        <h1 className="text-3xl font-semibold text-red-600 mb-3">
          Payment Cancelled ❌
        </h1>
        <p className="text-gray-600 mb-6">
          It seems you cancelled the payment process. Don’t worry — your cart is
          still here if you’d like to complete your purchase later.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/cart')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
          >
            Retry Payment
          </button>
          <button
            onClick={() => navigate('/')}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Cancel;
