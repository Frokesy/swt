/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account, databases } from '../../lib/appwrite';
import { ID } from 'appwrite';
import { useCart } from '../../hooks/useCart';
import { motion } from 'framer-motion';
import Plunk from '@plunk/node';
import { render } from '@react-email/render';
import { Slide, toast } from 'react-toastify';
import { OrderConfirmedUserTemplate } from '../../components/email-templates/OrderConfirmedUserTemplate';
import { NewOrderAdminTemplate } from '../../components/email-templates/NewOrderAdminTemplate';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const ORDERS_COLLECTION_ID = 'orders';
const plunkSecret = import.meta.env.VITE_PLUNK_SECRET;
const plunkClient = new Plunk(plunkSecret);

const Success = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const hasProcessed = useRef(false);
  const deliveryFee = 5.99;
  const totalWithDelivery = totalPrice + deliveryFee;

  useEffect(() => {
    const handleSuccess = async () => {
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      try {
        const currentUser = await account.get();
        setUser(currentUser);

        const normalizedItems = cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity ?? 1,
        }));

        const order = await databases.createDocument(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          ID.unique(),
          {
            userId: currentUser.$id,
            email: currentUser.email,
            items: [JSON.stringify(normalizedItems)],
            totalPrice,
            deliveryFee: Math.round(deliveryFee * 100),
            status: 'Paid',
            orderId: new Date().toISOString(),
          }
        );

        console.log('✅ Order saved:', order);

        const userEmailHtml = render(
          <OrderConfirmedUserTemplate
            firstname={currentUser.name}
            total={totalWithDelivery}
            items={normalizedItems}
          />
        );

        await plunkClient.emails.send({
          to: currentUser.email,
          subject: 'Your Rehubot Order is Confirmed 🥖',
          body: await userEmailHtml,
        });

        const adminEmailHtml = render(
          <NewOrderAdminTemplate
            customerName={currentUser.name}
            customerEmail={currentUser.email}
            total={totalWithDelivery}
            items={normalizedItems}
          />
        );

        await plunkClient.emails.send({
          to: 'frokeslini@gmail.com',
          subject: 'New Rehubot Order Received 📦',
          body: await adminEmailHtml,
        });

        console.log(cartItems);

        for (const item of normalizedItems) {
          try {
            const product = await databases.getDocument(
              DATABASE_ID,
              'products',
              item.id
            );

            const currentSales = product.salesCount ?? 0;
            const newSales = currentSales + item.quantity;

            await databases.updateDocument(DATABASE_ID, 'products', item.id, {
              salesCount: newSales,
            });
          } catch (err) {
            console.error(
              `❌ Failed to update sales count for ${item.name}:`,
              err
            );
          }
        }

        toast.success('🎉 Order placed successfully! Check your email.', {
          position: 'top-center',
          autoClose: 2000,
          transition: Slide,
          hideProgressBar: true,
        });

        clearCart();
        setSuccess(true);
      } catch (err) {
        console.error('❌ Error on success page:', err);
        toast.error('Something went wrong. Please try again.', {
          position: 'top-center',
          autoClose: 2000,
          transition: Slide,
          hideProgressBar: true,
        });
      } finally {
        setLoading(false);
      }
    };

    handleSuccess();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Processing your order...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center text-gray-700">
      {success ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-green-700 mb-4">
            Payment Successful 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. A confirmation email has
            been sent to <strong>{user?.email}</strong>.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition"
          >
            Back to Home
          </button>
        </motion.div>
      ) : (
        <p className="text-red-600 font-medium">
          Something went wrong while saving your order.
        </p>
      )}
    </div>
  );
};

export default Success;
