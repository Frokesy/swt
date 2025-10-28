import { useEffect, useState } from 'react';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;

interface Preorder {
  $id: string;
  productName: string;
  description: string;
  quantity: number;
  deliveryDate: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

const Preorders = ({ userId }: { userId: string }) => {
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(userId);

  useEffect(() => {
    const fetchPreorders = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          'preorders',
          [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
        );
        setPreorders(response.documents as unknown as Preorder[]);
      } catch (error) {
        console.error('Error fetching preorders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreorders();
  }, [userId]);

  if (loading) {
    return <p className="text-gray-500">Loading preorders...</p>;
  }

  if (preorders.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-700">Preorders</h3>
        <p className="text-gray-600">No preorders found.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
        <Package size={18} /> Preorders
      </h3>

      <div className="grid gap-4">
        {preorders.map((order) => (
          <motion.div
            key={order.$id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-800">
                {order.productName}
              </h4>
              <span className="text-sm text-gray-500">
                {new Date(order.deliveryDate).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{order.description}</p>

            <div className="mt-3 text-sm text-gray-700">
              <p>
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p>
                <strong>Name:</strong> {order.name}
              </p>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Preorders;
