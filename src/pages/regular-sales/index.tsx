/* eslint-disable @typescript-eslint/no-explicit-any */
import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { type ProductType } from '../../components/data/products';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import ProductCard from '../../components/defaults/ProductCard';
import { Pagination } from 'antd';
import { get, set } from 'idb-keyval';
import { useNavigate } from 'react-router-dom';
import { databases } from '../../lib/appwrite';
import { Query } from 'appwrite';
import { useCart } from '../../hooks/useCart';
import { ProductGridSkeleton } from '../../components/defaults/Skeleton';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const RegularSales = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [liked, setLiked] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const itemsPerPage = 5;

  useEffect(() => {
    const loadLikedItems = async () => {
      try {
        const storedLikes: ProductType[] = (await get('likedItems')) || [];
        if (storedLikes.length > 0) {
          setLiked(storedLikes.map((item) => item.id));
        }
      } catch (error) {
        console.error('Failed to load liked items:', error);
      }
    };

    loadLikedItems();
  }, []);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.orderDesc('salesCount'),
          Query.limit(12),
        ]);

        const mapped = res.documents.map((doc: any) => ({
          id: doc.$id,
          name: doc.name,
          price: doc.price,
          image: doc.image,
          category: doc.category,
          type: doc.type,
          desc: doc.desc,
          quantity: doc.quantity ?? 0,
          inStock: doc.inStock ?? true,
          images: doc.images ?? [],
          salesCount: doc.salesCount ?? 0,
        }));

        setProducts(mapped);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchTopProducts();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const handleLike = async (id: string, name?: string) => {
    try {
      const existingLikes: ProductType[] = (await get('likedItems')) || [];
      const productToToggle = products.find((p) => p.id === id);
      if (!productToToggle) return;

      const isLiked = existingLikes.some((item) => item.id === id);
      let updatedLikes;

      if (isLiked) {
        updatedLikes = existingLikes.filter((item) => item.id !== id);
        setToast(`${name ?? productToToggle.name} removed from favorites`);
      } else {
        updatedLikes = [...existingLikes, productToToggle];
        setToast(`${name ?? productToToggle.name} added to favorites`);
      }

      await set('likedItems', updatedLikes);
      try {
        window.dispatchEvent(new Event('likedItemsChanged'));
      } catch (error) {
        console.error('Failed to dispatch liked items event:', error);
      }

      setLiked(updatedLikes.map((item) => item.id));

      setTimeout(() => setToast(null), 1800);
    } catch (error) {
      console.error('Failed to update liked items:', error);
    }
  };

  const handleAddToCart = async (id: string, name: string) => {
    setLoadingId(id);
    try {
      const productToAdd = products.find((p) => p.id === id);
      if (!productToAdd) return;

      await addToCart(productToAdd);

      setToast(`${name} added to cart!`);
      setTimeout(() => setToast(null), 1800);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingId(null);
    }
  };

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
          Best Sellers
        </h2>

        <div className="flex justify-between items-center">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, products.length)} of{' '}
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

        {loadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-10"
          >
            {currentProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard
                  product={product}
                  liked={liked.includes(product.id)}
                  loading={loadingId === product.id}
                  onLike={handleLike}
                  onView={(id) => navigate(`/product/${id}`)}
                  onAddToCart={handleAddToCart}
                  onPreorder={(product) =>
                    navigate(
                      `/preorder?product=${encodeURIComponent(product.name)}`
                    )
                  }
                  extra={
                    <p className="text-xs text-gray-500">
                      Bought {product.salesCount} times recently
                    </p>
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        )}

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
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
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
