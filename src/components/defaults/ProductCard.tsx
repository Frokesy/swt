import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Heart, Eye, Star } from 'lucide-react';
import type { ProductType } from '../data/products';

type Props = {
  product: ProductType;
  liked: boolean;
  loading: boolean;
  onLike: (id: string, name?: string) => void;
  onView: (id: string) => void;
  onAddToCart: (id: string, name: string) => void;
  onPreorder?: (product: ProductType) => void;
  onCompare?: (product: ProductType) => void;
  compared?: boolean;
  extra?: React.ReactNode;
};

const ProductCard: React.FC<Props> = ({
  product,
  liked,
  loading,
  onLike,
  onView,
  onAddToCart,
  onPreorder,
  onCompare,
  compared = false,
  extra,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string>('');
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover)');
    setSupportsHover(Boolean(mq.matches));
    const handler = (e: MediaQueryListEvent) =>
      setSupportsHover(Boolean(e.matches));
    // older browsers use addListener
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  const showControls = supportsHover ? isActive : true;
  const inStock = (product.inStock ?? true) && (product.quantity ?? 1) > 0;

  return (
    <motion.div
      className="relative border border-[#ddd] rounded-lg p-3 flex flex-col space-y-3 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onTouchStart={() => setIsActive(true)}
      onTouchEnd={() => setIsActive(false)}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[160px] object-cover rounded-md"
        />

        <AnimatePresence>
          {showControls && (
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
                onMouseEnter={() => setHoveredIcon('heart')}
                onMouseLeave={() => setHoveredIcon('')}
                onClick={() => onLike(product.id, product.name)}
              >
                <motion.div
                  initial={false}
                  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    size={20}
                    className={`transition-colors duration-300 ${
                      liked
                        ? 'fill-red-500 text-red-500'
                        : hoveredIcon === 'heart'
                          ? 'text-green-700'
                          : 'text-gray-600'
                    }`}
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHoveredIcon('eye')}
                onMouseLeave={() => setHoveredIcon('')}
                onClick={() => onView(product.id)}
              >
                <Eye
                  size={20}
                  className={`transition-colors duration-300 ${
                    hoveredIcon === 'eye' ? 'text-green-700' : 'text-gray-600'
                  }`}
                />
              </motion.div>

              {onCompare && (
                <motion.div
                  className="bg-white p-2 rounded-full cursor-pointer shadow-sm"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setHoveredIcon('compare')}
                  onMouseLeave={() => setHoveredIcon('')}
                  onClick={() => onCompare(product)}
                  title={compared ? 'Remove from comparison' : 'Compare'}
                >
                  <GitCompare
                    size={20}
                    className={`transition-colors duration-300 ${
                      compared || hoveredIcon === 'compare'
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
      <p className="text-green-700 font-bold text-sm sm:text-base">
        £{product.price}
      </p>

      <div className="flex items-center gap-1 text-xs text-gray-500 min-h-4">
        <Star
          size={14}
          className={
            product.reviewCount
              ? 'fill-amber-400 text-amber-400'
              : 'text-gray-300'
          }
        />
        {product.reviewCount ? (
          <span>
            {product.averageRating?.toFixed(1)} ({product.reviewCount})
          </span>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>

      {extra}

      <AnimatePresence>
        {showControls && (
          <motion.button
            key="cart-btn"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            onClick={() =>
              inStock
                ? onAddToCart(product.id, product.name)
                : onPreorder?.(product)
            }
            className={`py-2 rounded-lg font-semibold flex items-center justify-center text-sm sm:text-base transition ${
              inStock
                ? 'bg-green-700 text-white hover:bg-green-800'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            ) : (
              inStock ? 'Add to Cart' : 'Preorder'
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductCard;
