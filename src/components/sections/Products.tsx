import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../defaults/ProductCard';
import { type ProductType } from '../data/products';
import { get, set } from 'idb-keyval';
import { useNavigate } from 'react-router-dom';
import Toast from '../defaults/Toast';
import { useCart } from '../../hooks/useCart';
import { listAllProducts } from '../../lib/products';

const Products = () => {
  const [liked, setLiked] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleLike = async (id: string, name?: string) => {
    try {
      const existingLikes = (await get('likedItems')) || [];
      const productToToggle = products.find((p) => p.id === id);
      if (!productToToggle) return;

      const isLiked = existingLikes.some((item: ProductType) => item.id === id);
      let updatedLikes;

      if (isLiked) {
        updatedLikes = existingLikes.filter(
          (item: ProductType) => item.id !== id
        );
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

      setLiked(updatedLikes.map((item: ProductType) => item.id));

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
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const displayedCategories = categories.slice(0, 3);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

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
    const fetchProducts = async () => {
      setProducts(await listAllProducts());
    };

    fetchProducts();
  }, []);

  return (
    <div className="lg:w-[60%] w-[90%] mx-auto my-10 space-y-14">
      {displayedCategories.map((category) => {
        const categoryProducts = products.filter(
          (p) => p.category === category
        );
        const visibleProducts = categoryProducts.slice(0, 4);

        return (
          <div key={category}>
            <h2 className="text-[22px] font-bold mb-6">{category}</h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid lg:grid-cols-4 grid-cols-2 gap-5"
            >
              {visibleProducts.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard
                    product={product}
                    liked={liked.includes(product.id)}
                    loading={loadingId === product.id}
                    onLike={handleLike}
                    onView={(id) => navigate(`/product/${id}`)}
                    onAddToCart={handleAddToCart}
                  />
                </motion.div>
              ))}
            </motion.div>

          </div>
        );
      })}

      {categories.length > 0 && (
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#6eb356] text-white py-3 px-8 rounded-lg hover:bg-[#5aa246] transition-colors ease-in-out duration-300 font-semibold"
            onClick={() => navigate('/product-catalogue')}
          >
            Explore All Products
          </motion.button>
        </div>
      )}

      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
};

export default Products;
