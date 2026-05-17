import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, type MouseEvent, type TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Circle, CircleCheck, Star } from 'lucide-react';
import { ID, Query } from 'appwrite';
import { type ProductType } from '../../components/data/products';
import Ad from '../../components/defaults/Ad';
import TopNav from '../../components/defaults/TopNav';
import Header from '../../components/defaults/Header';
import { useCart } from '../../hooks/useCart';
import { getProductById, listAllProducts } from '../../lib/products';
import { Skeleton } from '../../components/defaults/Skeleton';
import { databases } from '../../lib/appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const REVIEWS_COLLECTION_ID = 'productReviews';

type Review = {
  id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [productLoading, setProductLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const { addToCart } = useCart();

  const [toast, setToast] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | undefined>('');
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const [isTouchZoom, setIsTouchZoom] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(await listAllProducts());
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setProductLoading(true);
        const found = await getProductById(id);
        setProduct(found);
        const gallery =
          Array.isArray(found.images) && found.images.length > 0
            ? found.images
            : [found.image];
        setActiveImage(gallery[0]);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setProductLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!id) return;

      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          REVIEWS_COLLECTION_ID,
          [Query.equal('productId', id), Query.orderDesc('$createdAt')]
        );

        setReviews(
          res.documents.map((doc) => ({
            id: doc.$id,
            productId: doc.productId,
            name: doc.name,
            rating: Number(doc.rating ?? 0),
            comment: doc.comment,
            createdAt: doc.$createdAt,
          }))
        );
      } catch (error) {
        console.error('Failed to load product reviews:', error);
      }
    };

    loadReviews();
  }, [id]);

  const additionalInfo = [
    ['SKU', product?.sku],
    ['Weight', product?.weight],
    ['Dimensions', product?.dimensions],
    ['Origin', product?.origin],
    [
      'Best Before',
      product?.bestBefore
        ? new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }).format(new Date(product.bestBefore))
        : undefined,
    ],
  ].filter(([, value]) => value);

  useEffect(() => {
    const syncedProduct = products.find((p) => p.id === id);
    if (syncedProduct) {
      setProduct(syncedProduct);
    }
  }, [products, id]);

  const handleAddToCart = async (id: string, name: string) => {
    if (!inStock && product) {
      navigate(`/preorder?product=${encodeURIComponent(product.name)}`);
      return;
    }

    setLoadingId(id);
    try {
      const productToAdd = products.find((p) => p.id === id) ?? product;
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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isTouchZoom || e.touches.length !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%` });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !reviewName.trim() || !reviewComment.trim()) return;

    try {
      setReviewSubmitting(true);
      const created = await databases.createDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        ID.unique(),
        {
          productId: id,
          name: reviewName.trim(),
          rating: reviewRating,
          comment: reviewComment.trim(),
        }
      );

      setReviews((current) => [
        {
          id: created.$id,
          productId: created.productId,
          name: created.name,
          rating: Number(created.rating ?? reviewRating),
          comment: created.comment,
          createdAt: created.$createdAt,
        },
        ...current,
      ]);
      setProduct((current) => {
        if (!current) return current;

        const currentCount = current.reviewCount ?? reviews.length;
        const currentAverage = current.averageRating ?? averageRating;
        const nextCount = currentCount + 1;
        const nextAverage =
          (currentAverage * currentCount + reviewRating) / nextCount;

        return {
          ...current,
          reviewCount: nextCount,
          averageRating: nextAverage,
        };
      });
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
    } catch (error) {
      console.error('Failed to submit product review:', error);
      setToast('Review could not be submitted. Please try again.');
      setTimeout(() => setToast(null), 1800);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Ad />
        <Header />
        <TopNav />
        <div className="w-[92%] mx-auto lg:w-[80%] xl:w-[70%] mt-10 mb-20">
          <Skeleton className="h-6 w-36 mb-6" />
          <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="lg:w-1/2 p-6 space-y-4">
              <Skeleton className="h-[350px] lg:h-[500px] w-full rounded-xl" />
              <div className="flex gap-3">
                <Skeleton className="w-20 h-20 rounded-lg" />
                <Skeleton className="w-20 h-20 rounded-lg" />
                <Skeleton className="w-20 h-20 rounded-lg" />
              </div>
            </div>
            <div className="lg:w-1/2 p-6 lg:p-10 space-y-5">
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-gray-500">Product not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const gallery = product.images || [product.image];
  const inStock = product.inStock ?? true;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Ad />
      <Header />
      <TopNav />

      <div className="w-[92%] mx-auto lg:w-[80%] xl:w-[70%] mt-10 mb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-green-700 mb-6 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Products
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="lg:w-1/2 p-6 flex flex-col items-center justify-center space-y-4">
            <div
              className="relative w-full h-[350px] lg:h-[500px] rounded-xl overflow-hidden bg-gray-100 cursor-zoom-in"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onTouchStart={() => setIsTouchZoom(!isTouchZoom)}
              onTouchMove={handleTouchMove}
              style={{
                backgroundImage: `url(${activeImage})`,
                backgroundSize: isZooming || isTouchZoom ? '200%' : 'cover',
                backgroundRepeat: 'no-repeat',
                ...zoomStyle,
              }}
            >
              {!isZooming && !isTouchZoom && (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex space-x-3 mt-4 overflow-x-auto">
                {gallery.map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    onClick={() => setActiveImage(img)}
                    whileHover={{ scale: 1.05 }}
                    className={`w-20 h-20 rounded-lg object-cover cursor-pointer border-2 ${
                      activeImage === img
                        ? 'border-green-700'
                        : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2 p-6 lg:p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-800 mb-3 leading-tight">
                {product.name}
              </h1>

              <p className="text-green-700 font-semibold text-2xl mb-5">
                £{product.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-2 mb-4">
                {inStock ? (
                  <>
                    <CircleCheck size={18} className="text-green-600" />
                    <span className="text-green-700 font-medium">In Stock</span>
                  </>
                ) : (
                  <>
                    <Circle size={18} className="text-red-500" />
                    <span className="text-red-600 font-medium">
                      Out of Stock
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {product.desc || 'No description available for this product.'}
              </p>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div>
                  <p className="text-sm text-gray-500 uppercase mb-2">
                    Category
                  </p>
                  <span className="inline-block capitalize bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {product.type}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase mb-2">
                    Additional Info
                  </p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    {additionalInfo.length > 0 ? (
                      additionalInfo.map(([label, value]) => (
                        <li key={label}>
                          • {label}: {value}
                        </li>
                      ))
                    ) : (
                      <li>No additional information available.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAddToCart(product.id, product.name)}
              disabled={loadingId ? true : false}
              className={`mt-10 w-full text-white py-3 rounded-full font-semibold shadow-md transition-all ${
                inStock
                  ? 'bg-green-700 hover:bg-green-800'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {loadingId ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              ) : (
                inStock ? 'Add to Cart' : 'Preorder'
              )}
            </motion.button>
          </div>
        </motion.div>

        <section className="mt-10 bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Customer Reviews
              </h2>
              <p className="text-sm text-gray-500">
                {reviews.length
                  ? `${averageRating.toFixed(1)} out of 5 from ${
                      reviews.length
                    } review${reviews.length === 1 ? '' : 's'}`
                  : 'No reviews yet.'}
              </p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={
                    star <= Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="grid gap-4 border border-gray-200 rounded-xl p-4 mb-6"
          >
            <div className="grid sm:grid-cols-[1fr_auto] gap-4">
              <input
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                placeholder="Your name"
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-700"
                required
              />
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-700"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} star{rating === 1 ? '' : 's'}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-700 resize-none"
              required
            />
            <button
              type="submit"
              disabled={reviewSubmitting}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg font-semibold w-fit"
            >
              {reviewSubmitting ? 'Saving Review...' : 'Leave Review'}
            </button>
          </form>

          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
        >
          <CheckCircle size={18} />
          <span className="font-medium text-sm sm:text-base">{toast}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
