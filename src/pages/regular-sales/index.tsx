import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import { products, type ProductType } from "../../components/data/products";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, CheckCircle } from "lucide-react";
import { Pagination } from "antd";
import { get, set } from "idb-keyval";
import { useNavigate } from "react-router-dom";

const RegularSales = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [liked, setLiked] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  console.log(totalPages);

  const handleLike = (id: number) => {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async (id: number, name: string) => {
    setLoadingId(id);

    try {
      const existingCart = (await get("cartItems")) || [];

      const productToAdd = products.find((p) => p.id === id);
      if (!productToAdd) return;

      const existingItem = existingCart.find(
        (item: ProductType) => item.id === id
      );

      let updatedCart;
      if (existingItem) {
        updatedCart = existingCart.map((item: ProductType) =>
          item.id === id
            ? { ...item, quantity: (item.quantity ?? 0) + 1 }
            : item
        );
      } else {
        updatedCart = [...existingCart, { ...productToAdd, quantity: 1 }];
      }

      await set("cartItems", updatedCart);

      setTimeout(() => {
        setLoadingId(null);
        setToast(`${name} added to cart!`);
        setTimeout(() => setToast(null), 1800);
      }, 700);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />
      <div className="w-[90%] mx-auto lg:w-[60%]">
        <h2 className="text-[24px] font-semibold my-10 text-green-700">
          Sales
        </h2>

        <div className="flex justify-between items-center">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, products.length)} of{" "}
            {products.length}
          </p>
          <div className="border border-[#ddd] rounded-lg p-2">
            <select className="border-none outline-none bg-transparent">
              <option>Sort by</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-10"
        >
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="relative border border-[#ddd] rounded-lg p-3 flex flex-col space-y-3 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              onMouseEnter={() => setActiveId(product.id)}
              onMouseLeave={() => setActiveId(null)}
              onTouchStart={() => setActiveId(product.id)}
              onTouchEnd={() => setActiveId(null)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-[160px] object-cover rounded-md"
                />

                <AnimatePresence>
                  {activeId === product.id && (
                    <motion.div
                      className="absolute top-3 right-3 flex flex-col space-y-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredIcon("heart")}
                        onMouseLeave={() => setHoveredIcon("")}
                        onClick={() => handleLike(product.id)}
                      >
                        <motion.div
                          initial={false}
                          animate={{
                            scale: liked.includes(product.id) ? [1, 1.3, 1] : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            size={20}
                            className={`transition-colors duration-300 ${
                              liked.includes(product.id)
                                ? "fill-red-500 text-red-500"
                                : hoveredIcon === "heart"
                                ? "text-[#a4c059]"
                                : "text-gray-600"
                            }`}
                          />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHoveredIcon("eye")}
                        onMouseLeave={() => setHoveredIcon("")}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <Eye
                          size={20}
                          className={`transition-colors duration-300 ${
                            hoveredIcon === "eye"
                              ? "text-[#a4c059]"
                              : "text-gray-600"
                          }`}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h3 className="font-semibold text-sm sm:text-base">
                {product.name}
              </h3>
              <p className="text-green-700 font-bold text-sm sm:text-base">
                ${product.price}
              </p>

              <AnimatePresence>
                {activeId === product.id && (
                  <motion.button
                    key="cart-btn"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    onClick={() => handleAddToCart(product.id, product.name)}
                    className="bg-[#6eb356] text-white py-2 rounded-lg hover:bg-[#5aa246] transition-colors ease-in-out duration-300 font-semibold flex items-center justify-center text-sm sm:text-base"
                  >
                    {loadingId === product.id ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: "linear",
                        }}
                      />
                    ) : (
                      "Add to Cart"
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            total={products.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6eb356] text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
            >
              <CheckCircle size={18} className="text-white" />
              <span className="font-medium text-sm sm:text-base">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegularSales;
