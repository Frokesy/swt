/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Loader2 } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const ORDERS_COLLECTION_ID = 'orders';

interface OrdersProps {
  userId: string;
}

const Orders = ({ userId }: OrdersProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
        );
        setOrders(res.documents);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-gray-500">
        <Loader2 className="animate-spin mr-2" size={18} />
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-700">Orders</h3>
        <p className="text-gray-600 flex items-center gap-2">
          <Package size={16} className="text-gray-500" /> You haven’t placed any
          orders yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-green-700">My Orders</h3>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order) => {
            const items = JSON.parse(order.items[0] || '[]');
            const totalPrice = order.totalPrice.toFixed(2);
            const deliveryFee = (order.deliveryFee / 100).toFixed(2);

            return (
              <motion.div
                key={order.$id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="border border-gray-200 rounded-xl p-5 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID:{' '}
                      <span className="font-mono">{order.orderId}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Placed on{' '}
                      {new Date(order.$createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      order.status === 'Paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <ul className="text-sm text-gray-700 mb-3 list-disc pl-4 space-y-1">
                  {items.map((item: any, index: number) => (
                    <li key={index}>
                      {item.name} × {item.quantity} — £{item.price.toFixed(2)}
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between text-sm font-medium border-t pt-2 text-gray-800">
                  <p>
                    Delivery Fee:{' '}
                    <span className="text-gray-600">£{deliveryFee}</span>
                  </p>
                  <p>
                    Total: <span className="text-green-700">£{totalPrice}</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
