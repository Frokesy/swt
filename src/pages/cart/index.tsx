import { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import { Trash2, Plus, Minus, CheckCircle } from "lucide-react";
import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductType } from "../../components/data/products";

const Carts = () => {
  const [cartItems, setCartItems] = useState<ProductType[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      const items = (await get("cartItems")) || [];
      setCartItems(items);
    };
    loadCart();
  }, []);

  const updateCart = async (newCart: ProductType[]) => {
    setCartItems(newCart);
    await set("cartItems", newCart);
  };

  const handleIncrement = (id: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity ?? 1) + 1 } : item
    );
    updateCart(updated);
  };

  const handleDecrement = (id: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity ?? 1) - 1) }
          : item
      )
      .filter((item) => (item.quantity ?? 1) > 0);
    updateCart(updated);
  };

  const handleRemove = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    updateCart(updated);
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity ?? 1),
    0
  );

  const handleCheckout = async () => {
    await set("cartItems", []);
    setCartItems([]);
    setShowConfirmModal(false);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  };

  return (
    <div>
      <Ad />
      <Header cartCount={cartItems.length} />
      <TopNav />

      <div className="w-[90%] lg:w-[60%] mx-auto my-10 text-[#333]">
        <h2 className="text-[24px] font-semibold text-green-700 mb-6">
          My Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center mt-20">
            Your cart is empty 😕
          </p>
        ) : (
          <>
            <div className="space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100"
                      />
                      <div>
                        <h3 className="font-semibold text-base">{item.name}</h3>
                        <p className="text-green-700 font-semibold text-sm mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-3 py-1.5">
                        <button
                          onClick={() => handleDecrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 mt-10 pt-4 pb-6 px-4 md:px-0 flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.04)]"
            >
              <p className="text-lg font-semibold text-gray-800">
                Total:{" "}
                <span className="text-green-700">${totalPrice.toFixed(2)}</span>
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConfirmModal(true)}
                className="bg-green-700 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-green-800 transition-colors"
              >
                Checkout
              </motion.button>
            </motion.div>
          </>
        )}
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center"
            >
              <CheckCircle className="mx-auto mb-3 text-green-600 w-10 h-10" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Confirm Checkout
              </h2>
              <p className="text-gray-600 mb-4">
                You’re about to confirm {cartItems.length} item
                {cartItems.length > 1 && "s"} totaling{" "}
                <span className="font-semibold text-green-700">
                  ${totalPrice.toFixed(2)}
                </span>
              </p>

              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
          >
            <CheckCircle size={18} className="text-white" />
            <span className="font-medium text-sm sm:text-base">
              Order confirmed successfully!
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carts;
