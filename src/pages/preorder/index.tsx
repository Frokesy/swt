import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import Ad from '../../components/defaults/Ad';
import { databases } from '../../lib/appwrite';
const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'preorders';

const PreOrder = () => {
  const [form, setForm] = useState({
    productName: '',
    description: '',
    quantity: '',
    deliveryDate: '',
    name: '',
    email: '',
    phone: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleConfirm = async () => {
    setShowModal(false);

    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
        productName: form.productName,
        description: form.description,
        quantity: Number(form.quantity),
        deliveryDate: form.deliveryDate,
        name: form.name,
        email: form.email,
        phone: form.phone,
      });

      setToast(true);
      setTimeout(() => setToast(false), 2000);

      // Reset form
      setForm({
        productName: '',
        description: '',
        quantity: '',
        deliveryDate: '',
        name: '',
        email: '',
        phone: '',
      });
    } catch (error) {
      console.error('❌ Failed to create preorder:', error);
      alert('Failed to confirm preorder. Please try again.');
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <motion.div
        className="w-[90%] lg:w-[60%] mx-auto my-10 text-[#333]"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-[24px] font-semibold text-green-700 mb-4"
        >
          Preorder a Product
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 mb-10">
          Can’t find what you’re looking for? Fill out this form to request a
          product in advance. We’ll notify you when it becomes available.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-5 border border-gray-100"
          variants={fadeUp}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={form.productName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Product Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600 min-h-[100px]"
              placeholder="Describe the product you want..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Preferred Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                placeholder="+234..."
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition"
          >
            Submit Preorder
          </motion.button>
        </motion.form>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
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
                  onClick={() => setShowModal(false)}
                >
                  <X size={22} />
                </button>

                <h3 className="text-[20px] font-semibold text-green-700 mb-3 text-center">
                  Confirm Your Preorder
                </h3>
                <div className="space-y-2 text-gray-700 mb-6">
                  <p>
                    <strong>Product:</strong> {form.productName}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {form.quantity}
                  </p>
                  <p>
                    <strong>Description:</strong> {form.description || 'N/A'}
                  </p>
                  <p>
                    <strong>Delivery:</strong>{' '}
                    {form.deliveryDate || 'Not specified'}
                  </p>
                  <p>
                    <strong>Name:</strong> {form.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {form.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {form.phone}
                  </p>
                </div>

                <div className="flex justify-between space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-1/2 border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="w-1/2 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
                  >
                    Confirm
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
            >
              <CheckCircle size={18} className="text-white" />
              <span className="font-medium text-sm sm:text-base">
                Preorder confirmed successfully!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PreOrder;
