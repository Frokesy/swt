import { useEffect, useState } from 'react';
import { get, set } from 'idb-keyval';
import type { ReactNode } from 'react';
import type { ProductType } from '../components/data/products';
import { LikesContext } from './LikesContext';

export type LikesContextType = {
  likedItems: ProductType[];
  likedIds: string[];
  likedCount: number;
  toggleLike: (product: ProductType) => Promise<void>;
  addLike: (product: ProductType) => Promise<void>;
  removeLike: (id: string) => Promise<void>;
  refreshLikes: () => Promise<void>;
};

interface Props {
  children: ReactNode;
}

export const LikesProvider = ({ children }: Props) => {
  const [likedItems, setLikedItems] = useState<ProductType[]>([]);

  const load = async () => {
    try {
      const stored: ProductType[] = (await get('likedItems')) || [];
      setLikedItems(Array.isArray(stored) ? stored : []);
    } catch (err) {
      console.error('Failed to load liked items:', err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const persist = async (items: ProductType[]) => {
    setLikedItems(items);
    await set('likedItems', items);
    try {
      window.dispatchEvent(new Event('likedItemsChanged'));
    } catch {
      /* empty */
    }
  };

  const addLike = async (product: ProductType) => {
    const exists = likedItems.some((p) => p.id === product.id);
    if (exists) return;
    const updated = [...likedItems, product];
    await persist(updated);
  };

  const removeLike = async (id: string) => {
    const updated = likedItems.filter((p) => p.id !== id);
    await persist(updated);
  };

  const toggleLike = async (product: ProductType) => {
    const exists = likedItems.some((p) => p.id === product.id);
    if (exists) await removeLike(product.id);
    else await addLike(product);
  };

  const refreshLikes = async () => {
    await load();
  };

  return (
    <LikesContext.Provider
      value={{
        likedItems,
        likedIds: likedItems.map((p) => p.id),
        likedCount: likedItems.length,
        toggleLike,
        addLike,
        removeLike,
        refreshLikes,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
};

export default LikesProvider;
