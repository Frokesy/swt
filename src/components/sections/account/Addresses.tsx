import { useEffect, useState } from 'react';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const ADDRESSES_COLLECTION_ID = 'deliveryAddresses';

interface Address {
  $id: string;
  deliveryAddress: string;
  userId: string;
}

const Addresses = ({ userId }: { userId: string }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          ADDRESSES_COLLECTION_ID,
          [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
        );
        setAddresses(response.documents as unknown as Address[]);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  if (loading) {
    return <p className="text-gray-500">Loading addresses...</p>;
  }

  if (addresses.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
          <MapPin size={18} /> Addresses
        </h3>
        <p className="text-gray-600">You haven’t added any addresses yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-green-700 flex items-center gap-2">
        <MapPin size={18} /> Saved Addresses
      </h3>

      <div className="grid gap-3">
        {addresses.map((addr) => (
          <motion.div
            key={addr.$id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="text-gray-700">{addr.deliveryAddress}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Addresses;
