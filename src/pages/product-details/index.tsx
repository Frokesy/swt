import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, type MouseEvent, type TouchEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, Circle, CircleCheck } from 'lucide-react';
import { type ProductType } from '../../components/data/products';
import Ad from '../../components/defaults/Ad';
import TopNav from '../../components/defaults/TopNav';
import Header from '../../components/defaults/Header';
import { databases } from '../../lib/appwrite';
import { useCart } from '../../hooks/useCart';
const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>('');
  const [products, setProducts] = useState<ProductType[]>([]);
  const { addToCart } = useCart();

  const [toast, setToast] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | undefined>('');
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  const [isTouchZoom, setIsTouchZoom] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);

      const mapped = res.documents.map((doc) => ({
        id: doc.$id,
        name: doc.name,
        price: doc.price,
        image: doc.image,
        category: doc.category,
        type: doc.type,
        quantity: doc.quantity,
        desc: doc.desc,
        images: Array.isArray(doc.images)
          ? doc.images
          : typeof doc.images === 'string'
            ? JSON.parse(doc.images)
            : [],
        liked: doc.liked,
        inStock: doc.inStock,
      }));

      setProducts(mapped);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const found = products.find((p) => p.id === id);
    if (found) {
      setProduct(found);
      const gallery =
        Array.isArray(product?.images) && product.images.length > 0
          ? product.images
          : [product?.image];
      setActiveImage(gallery[0]);
    } else {
      setProduct(null);
    }
  }, [products, id]);

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
                ${product.price.toLocaleString()}
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
                    <li>• Weight: 1.2kg</li>
                    <li>• Dimensions: 15 × 10 × 8 cm</li>
                    <li>• Origin: Nigeria</li>
                    <li>• Best Before: 12 months</li>
                  </ul>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAddToCart(product.id, product.name)}
              disabled={loadingId ? true : false}
              className="mt-10 w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-full font-semibold shadow-md transition-all"
            >
              {loadingId ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"
                  transition={{ repeat: Infinity, duration: 0.8 }}
                />
              ) : (
                'Add to Cart'
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {toast && (
        <motion.div
          key="toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6eb356] text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50"
        >
          <CheckCircle size={18} />
          <span className="font-medium text-sm sm:text-base">{toast}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ProductDetailsPage;
