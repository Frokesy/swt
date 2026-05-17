import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/defaults/ProductCard';
import { get, set } from 'idb-keyval';
import { type ProductType } from '../../components/data/products';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const FavoritesPage = () => {
  const [items, setItems] = useState<ProductType[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const load = async () => {
      try {
        const stored: ProductType[] = (await get('likedItems')) || [];
        setItems(Array.isArray(stored) ? stored : []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };
    load();
  }, []);

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
        <h2 className="text-[24px] font-semibold my-6 text-green-700">
          Favorites
        </h2>

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
    </div>
  );
};

export default FavoritesPage;
