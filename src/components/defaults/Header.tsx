import { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, UserIcon, X, Heart } from 'lucide-react';
import { get } from 'idb-keyval';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { type ProductType } from '../data/products';
import { listAllProducts } from '../../lib/products';
import { Skeleton } from './Skeleton';

const navItems = [
  { id: 1, label: 'Home', link: '/' },
  { id: 2, label: 'My Account', link: '/account' },
  { id: 3, label: 'Product Catalogue', link: '/product-catalogue' },
  { id: 4, label: 'Regular Sales', link: '/regular-sales' },
  { id: 5, label: 'Preorder', link: '/preorder' },
  { id: 6, label: 'Delivery Information', link: '/delivery-info' },
];

const Header = () => {
  const { cartCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchLoading, setSearchLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const [likedCount, setLikedCount] = useState<number>(0);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setSearchLoading(true);

        const loadedProducts = await listAllProducts();
        if (!isMounted) return;

        setProducts(loadedProducts);
        setSearchError('');
      } catch (error) {
        console.error('Failed to fetch products for header search:', error);
        if (isMounted) {
          setSearchError('Unable to load products right now.');
        }
      } finally {
        if (isMounted) {
          setSearchLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadLikes = async () => {
      try {
        const stored = (await get('likedItems')) || [];
        if (!mounted) return;
        setLikedCount(Array.isArray(stored) ? stored.length : 0);
      } catch (err) {
        console.error('Failed to load liked items count:', err);
      }
    };

    loadLikes();

    const onFocus = () => {
      loadLikes();
    };

    const onLikedChange = () => loadLikes();

    window.addEventListener('focus', onFocus);
    window.addEventListener('likedItemsChanged', onLikedChange);
    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('likedItemsChanged', onLikedChange);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [searchOpen]);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = normalizedQuery
    ? products
        .filter((product) =>
          [product.name, product.category, product.type].some((value) =>
            value?.toLowerCase().includes(normalizedQuery)
          )
        )
        .slice(0, 6)
    : [];

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
  };

  const handleSearchSelect = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <div className="relative" ref={searchContainerRef}>
        <div className="lg:w-[60%] w-[90%] mx-auto lg:my-10 my-4 flex justify-between items-center gap-4">
          <Menu
            className="lg:hidden block cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          />

          <h2 className="text-green-700 lg:text-[44px] text-[30px] italic font-bold">
            Rehubot
          </h2>

          <div className="lg:flex hidden w-[60%] border border-[#ccc] pl-3 rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchOpen(true);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search for products..."
              className="outline-none border-none w-[90%] pr-4"
            />
            <button
              type="button"
              onClick={handleSearchToggle}
              className="bg-green-700 p-3 w-[10%] flex items-center justify-center cursor-pointer"
              aria-label="Toggle product search"
            >
              <Search color="#fff" />
            </button>
          </div>

          <div className="flex lg:space-x-6 space-x-3 items-center">
            <Search
              className="lg:hidden block cursor-pointer"
              onClick={handleSearchToggle}
            />
            <NavLink to="/cart">
              <div className="bg-green-700 p-2 relative rounded-full cursor-pointer">
                <ShoppingBag color="#fff" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 20,
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center px-1.5 py-0.5 shadow-md"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
            <NavLink to="/favorites">
              <div className="bg-green-700 p-2 relative rounded-full cursor-pointer">
                <Heart color="#fff" />
                <AnimatePresence>
                  {likedCount > 0 && (
                    <motion.span
                      key={likedCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 20,
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center px-1.5 py-0.5 shadow-md"
                    >
                      {likedCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </NavLink>
            <NavLink to="/account">
              <div className="bg-green-700 p-2 rounded-full cursor-pointer">
                <UserIcon color="#fff" />
              </div>
            </NavLink>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 top-full z-30 lg:w-[60%] w-[90%] -translate-x-1/2 bg-white border border-[#ddd] rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="hidden lg:flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">Search products</p>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close product search"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gray-100">
                <div className="flex items-center flex-1 border border-[#ccc] rounded-lg px-3">
                  <Search size={18} className="text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full py-3 pl-3 outline-none"
                    autoFocus
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="text-gray-500"
                  aria-label="Close product search"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="max-h-[360px] overflow-y-auto">
                {searchLoading && (
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                )}

                {!searchLoading && searchError && (
                  <p className="p-4 text-sm text-red-500">{searchError}</p>
                )}

                {!searchLoading && !searchError && !normalizedQuery && (
                  <p className="p-4 text-sm text-gray-500">
                    Start typing to find a product instantly.
                  </p>
                )}

                {!searchLoading &&
                  !searchError &&
                  normalizedQuery &&
                  filteredProducts.length === 0 && (
                    <p className="p-4 text-sm text-gray-500">
                      No products matched &quot;{searchQuery.trim()}&quot;.
                    </p>
                  )}

                {!searchLoading &&
                  !searchError &&
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSearchSelect(product.id)}
                      className="w-full flex items-center gap-4 p-4 text-left border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {product.type}
                        </p>
                      </div>
                      <p className="font-semibold text-green-700">
                        £{product.price}
                      </p>
                    </button>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="fixed top-0 left-0 h-full w-[80%] sm:w-[60%] bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 className="text-green-700 text-2xl font-semibold italic">
                  Rehubot
                </h2>
                <X
                  size={26}
                  className="cursor-pointer text-gray-600 hover:text-green-700 transition"
                  onClick={() => setDrawerOpen(false)}
                />
              </div>

              <div className="flex flex-col mt-4 px-5 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.link}
                    onClick={() => setDrawerOpen(false)}
                    className={({ isActive }) =>
                      `text-lg font-medium py-2 px-3 rounded-lg transition-all ${
                        isActive
                          ? 'text-green-700 bg-green-100'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto p-5 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Rehubot. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
