import Ad from "../../components/defaults/Ad";
import Header from "../../components/defaults/Header";
import TopNav from "../../components/defaults/TopNav";
import { products, type ProductType } from "../../components/data/products";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, CheckCircle } from "lucide-react";
import { Pagination } from "antd";
import { set, get } from "idb-keyval";
import { useNavigate } from "react-router-dom";

const ProductCatalogue = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [liked, setLiked] = useState<number[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>("All");
  const navigate = useNavigate();

  const productTypes = ["All", ...new Set(products.map((p) => p.type))];
  const [sortBy, setSortBy] = useState<string>("default");

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    return 0;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
      const updatedCart = existingItem
        ? existingCart.map((item: ProductType) =>
            item.id === id
              ? { ...item, quantity: (item.quantity ?? 0) + 1 }
              : item
          )
        : [...existingCart, { ...productToAdd, quantity: 1 }];

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

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <div className="w-[90%] mx-auto lg:w-[60%]">
        <h2 className="text-[24px] font-semibold my-10 text-green-700">
          Product Catalogue
        </h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {productTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                selectedType === type
                  ? "bg-green-700 text-white border-green-700"
                  : "border-gray-300 text-gray-600 hover:border-green-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of{" "}
            {sortedProducts.length}
          </p>
          <div className="border border-[#ddd] rounded-lg p-2">
            <select
              className="border-none outline-none bg-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-10"
        >
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              className="relative border border-[#ddd] rounded-lg p-3 flex flex-col space-y-3 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              onMouseEnter={() => setActiveId(product.id)}
              onMouseLeave={() => setActiveId(null)}
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
                      {/* Like */}
                      <motion.div
                        className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(product.id)}
                      >
                        <Heart
                          size={20}
                          className={`${
                            liked.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-600"
                          }`}
                        />
                      </motion.div>

                      <motion.div
                        className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <Eye size={20} className="text-gray-600" />
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
                    transition={{ duration: 0.4 }}
                    onClick={() => handleAddToCart(product.id, product.name)}
                    className="bg-[#6eb356] text-white py-2 rounded-lg hover:bg-[#5aa246] font-semibold flex items-center justify-center text-sm sm:text-base"
                  >
                    {loadingId === product.id ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                        transition={{ repeat: Infinity, duration: 0.8 }}
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

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            total={sortedProducts.length}
            pageSize={itemsPerPage}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.4 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6eb356] text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
            >
              <CheckCircle size={18} />
              <span className="font-medium text-sm sm:text-base">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductCatalogue;
