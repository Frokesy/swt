import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/defaults/ProductCard';
import { get, set } from 'idb-keyval';
import { type ProductType } from '../../components/data/products';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Share2 } from 'lucide-react';
import { listAllProducts } from '../../lib/products';
import Toast from '../../components/defaults/Toast';
import { AnimatePresence } from 'framer-motion';

const FavoritesPage = () => {
  const [items, setItems] = useState<ProductType[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isSharedList, setIsSharedList] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const sharedIds = searchParams.get('items')?.split(',').filter(Boolean);

        if (sharedIds?.length) {
          const products = await listAllProducts();
          setItems(products.filter((product) => sharedIds.includes(product.id)));
          setIsSharedList(true);
          return;
        }

        const stored: ProductType[] = (await get('likedItems')) || [];
        setItems(Array.isArray(stored) ? stored : []);
        setIsSharedList(false);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };
    load();
  }, [searchParams]);

  const handleShareWishlist = async () => {
    if (items.length === 0) return;

    const url = `${window.location.origin}/favorites?items=${items
      .map((item) => item.id)
      .join(',')}`;
    const shareData = {
      title: 'My Rehubot wishlist',
      text: 'Have a look at my Rehubot wishlist.',
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setToast('Wishlist link copied!');
        setTimeout(() => setToast(null), 1800);
      }
    } catch (error) {
      console.error('Failed to share wishlist:', error);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const stored: ProductType[] = (await get('likedItems')) || [];
      const updated = (stored || []).filter((p) => p.id !== id);
      await set('likedItems', updated);
      try {
        window.dispatchEvent(new Event('likedItemsChanged'));
      } catch {
        /* empty */
      }
      setItems(updated);
    } catch (err) {
      console.error('Failed to remove liked item:', err);
    }
  };

  const handleAddToCart = async (id: string) => {
    setLoadingId(id);
    try {
      const product = items.find((p) => p.id === id);
      if (!product) return;
      await addToCart(product);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <div className="w-[90%] mx-auto lg:w-[60%] my-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-6">
          <div>
            <h2 className="text-[24px] font-semibold text-green-700">
              {isSharedList ? 'Shared Wishlist' : 'Favorites'}
            </h2>
            {isSharedList && (
              <p className="text-sm text-gray-500">
                Products shared from another wishlist.
              </p>
            )}
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={handleShareWishlist}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold w-fit"
            >
              <Share2 size={18} />
              Share Wishlist
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-500">
            You have no favorite items yet.
          </p>
        ) : (
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 my-6">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={true}
                loading={loadingId === product.id}
                onLike={() => handleLike(product.id)}
                onView={(id) => navigate(`/product/${id}`)}
                onAddToCart={handleAddToCart}
                onPreorder={(product) =>
                  navigate(
                    `/preorder?product=${encodeURIComponent(product.name)}`
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
    </div>
  );
};

export default FavoritesPage;
