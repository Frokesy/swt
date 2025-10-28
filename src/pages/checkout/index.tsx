/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import { account, databases, client } from '../../lib/appwrite';
import { ID, Query, Functions } from 'appwrite';
import Toast from '../../components/defaults/Toast';
import ErrToast from '../../components/defaults/ErrToast';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const DELIVERY_COLLECTION_ID = 'deliveryAddresses';

const Checkout = () => {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [addressDocId, setAddressDocId] = useState<string | null>(null);
  const [hasAddress, setHasAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [errToast, setErrToast] = useState<string | null>(null);
  const functions = new Functions(client);

  const deliveryFee = 5.99;

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        const res = await databases.listDocuments(
          DATABASE_ID,
          DELIVERY_COLLECTION_ID,
          [Query.equal('userId', user.$id)]
        );

        if (res.documents.length > 0) {
          const doc = res.documents[0];
          setAddress(doc.deliveryAddress);
          setAddressDocId(doc.$id);
          setHasAddress(true);
        }
      } catch (err) {
        console.error('Error fetching address:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleAddressSave = async () => {
    if (!address.trim() || !userId) return;

    try {
      if (addressDocId) {
        await databases.updateDocument(
          DATABASE_ID,
          DELIVERY_COLLECTION_ID,
          addressDocId,
          { deliveryAddress: address }
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          DELIVERY_COLLECTION_ID,
          ID.unique(),
          {
            userId,
            deliveryAddress: address,
          }
        );
      }

      setHasAddress(true);
      setToast('Delivery address saved successfully ✅');
      setTimeout(() => setToast(null), 1800);
    } catch (err) {
      console.error('Error saving address:', err);
      setErrToast('Failed to save address. Please try again.');
      setTimeout(() => setErrToast(null), 1800);
    }
  };

  const handleProceed = async () => {
    if (!hasAddress) {
      setErrToast('Please provide a valid delivery address first.');
      setTimeout(() => setErrToast(null), 1800);

      return;
    }

    if (!userId) {
      setErrToast('You must be logged in to continue.');
      setTimeout(() => setErrToast(null), 1800);
      return;
    }

    try {
      const lineItems = cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        currency: 'usd',
      }));

      const payload = {
        lineItems,
        deliveryFee,
        successUrl: `${window.location.origin}/success`,
        failureUrl: `${window.location.origin}/cancel`,
        metadata: {
          userId,
          deliveryAddress: address,
        },
      };

      console.log('Payload sent to Appwrite:', payload);

      const execution = await functions.createExecution(
        import.meta.env.VITE_STRIPE_FUNCTION_ID,
        JSON.stringify(payload),
        false,
        '/checkout'
      );

      let response: any;
      try {
        response = JSON.parse(execution.responseBody ?? '{}');
      } catch {
        console.warn('Response is not valid JSON:', execution.responseBody);
        response = {};
      }

      console.log('Execution:', execution);
      console.log('Parsed Response:', response);

      if (response.url) {
        window.location.href = response.url;
      } else {
        setErrToast('Unable to start checkout session.');
        console.error('Stripe response:', response);
        setTimeout(() => setErrToast(null), 1800);
      }
    } catch (err) {
      console.error('Error proceeding to checkout:', err);
      setErrToast('Something went wrong, please try again.');
      setTimeout(() => setErrToast(null), 1800);
    }
  };

  const totalWithDelivery = totalPrice + deliveryFee;

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading checkout details...</p>
      </div>
    );

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />
      <div className="w-[90%] md:w-[60%] mx-auto my-10 text-[#333]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 mb-6 hover:underline"
        >
          <ArrowLeft size={18} /> Back to Cart
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-green-700">
          Checkout Summary
        </h2>

        <div className="bg-white shadow rounded-2xl p-5 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-gray-100 py-3"
            >
              <span>{item.name}</span>
              <span className="text-green-700 font-medium">
                ${item.price.toFixed(2)} × {item.quantity}
              </span>
            </div>
          ))}

          <div className="flex justify-between py-3 border-t border-gray-200 mt-3">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 font-semibold text-green-700">
            <span>Total</span>
            <span>${totalWithDelivery.toFixed(2)}</span>
          </div>
        </div>

        {!hasAddress ? (
          <div className="bg-white shadow rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-lg">Delivery Address</h3>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-600"
              rows={3}
            />
            <button
              onClick={handleAddressSave}
              className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition"
            >
              Save Address
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-2xl p-5 mb-6">
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <p className="text-gray-700">{address}</p>
            <button
              onClick={() => setHasAddress(false)}
              className="text-sm text-green-700 hover:underline mt-2"
            >
              Edit Address
            </button>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleProceed}
          className="bg-green-700 text-white w-full py-3 rounded-lg font-semibold text-lg mt-6 hover:bg-green-800 transition"
        >
          Proceed to Payment
        </motion.button>
      </div>
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
      <AnimatePresence>
        {errToast && <ErrToast toast={errToast} />}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;
