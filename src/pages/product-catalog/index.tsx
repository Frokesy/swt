import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { type ProductType } from '../../components/data/products';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, GitCompare, X } from 'lucide-react';
import ProductCard from '../../components/defaults/ProductCard';
import { Pagination } from 'antd';
import { set, get } from 'idb-keyval';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { listAllProducts } from '../../lib/products';
import { ProductGridSkeleton } from '../../components/defaults/Skeleton';

const ProductCatalogue = () => {
  const [liked, setLiked] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productTypes = ['All', ...new Set(products.map((p) => p.type))];
  const [sortBy, setSortBy] = useState<string>('default');

  const filteredProducts =
    selectedType === 'All'
      ? products
      : products.filter((p) => p.type === selectedType);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') return a.price - b.price;
    if (sortBy === 'Price: High to Low') return b.price - a.price;
    return 0;
  });

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const comparedProducts = compareIds
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean) as ProductType[];

  const toggleCompare = (productId: string) => {
    setCompareIds((current) => {
      if (current.includes(productId)) {
        return current.filter((id) => id !== productId);
      }

      if (current.length >= 2) {
        setToast('You can compare 2 products at a time.');
        setTimeout(() => setToast(null), 1800);
        return current;
      }

      return [...current, productId];
    });
  };

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
      // notify other parts of the app that liked items changed
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
      try {
        setLoadingProducts(true);
        setProducts(await listAllProducts());
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <div className="w-[90%] mx-auto lg:w-[60%]">
        <h2 className="text-[24px] font-semibold my-10 text-green-700">
          Product Catalogue
        </h2>

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
                  ? 'bg-green-700 text-white border-green-700'
                  : 'border-gray-300 text-gray-600 hover:border-green-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, sortedProducts.length)} of{' '}
            {sortedProducts.length}
          </p>
          <div className="flex items-center gap-3">
            {compareIds.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                disabled={compareIds.length !== 2}
                className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GitCompare size={18} />
                Compare ({compareIds.length})
              </button>
            )}
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
        </div>

        {compareIds.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {comparedProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => toggleCompare(product.id)}
                className="inline-flex items-center gap-2 rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm"
              >
                {product.name}
                <X size={14} />
              </button>
            ))}
          </div>
        )}

        {loadingProducts ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-10"
          >
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={liked.includes(product.id)}
                loading={loadingId === product.id}
                onLike={handleLike}
                onView={(id) => navigate(`/product/${id}`)}
                onAddToCart={handleAddToCart}
                onCompare={(product) => toggleCompare(product.id)}
                compared={compareIds.includes(product.id)}
                onPreorder={(product) =>
                  navigate(
                    `/preorder?product=${encodeURIComponent(product.name)}`
                  )
                }
              />
            ))}
          </motion.div>
        )}

        <AnimatePresence>
          {compareOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 flex items-start sm:items-center justify-center overflow-y-auto p-3 sm:p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-xl w-full max-w-4xl my-4 sm:my-8 max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:p-6"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Product Comparison
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCompareOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close comparison"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
                  {comparedProducts.map((product) => {
                    const available =
                      (product.inStock ?? true) && (product.quantity ?? 1) > 0;

                    return (
                      <article
                        key={product.id}
                        className="border border-gray-200 rounded-xl overflow-hidden bg-white"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-lg text-gray-800">
                                {product.name}
                              </h4>
                              <p className="text-green-700 font-bold">
                                £{product.price.toFixed(2)}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-semibold rounded-full px-3 py-1 ${
                                available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {available ? 'In stock' : 'Preorder only'}
                            </span>
                          </div>

                          <dl className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <dt className="text-gray-500">Type</dt>
                              <dd className="font-medium capitalize">
                                {product.type}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Category</dt>
                              <dd className="font-medium">{product.category}</dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Weight</dt>
                              <dd className="font-medium">
                                {product.weight || 'N/A'}
                              </dd>
                            </div>
                            <div>
                              <dt className="text-gray-500">Origin</dt>
                              <dd className="font-medium">
                                {product.origin || 'N/A'}
                              </dd>
                            </div>
                          </dl>

                          <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="flex-1 border border-green-700 text-green-700 rounded-lg py-2 font-semibold hover:bg-green-50"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                available
                                  ? handleAddToCart(product.id, product.name)
                                  : navigate(
                                      `/preorder?product=${encodeURIComponent(
                                        product.name
                                      )}`
                                    )
                              }
                              className="flex-1 bg-green-700 text-white rounded-lg py-2 font-semibold hover:bg-green-800"
                            >
                              {available ? 'Add to Cart' : 'Preorder'}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-center mt-10">
          <Pagination
            current={currentPage}
            total={sortedProducts.length}
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
              transition={{ duration: 0.4 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
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
