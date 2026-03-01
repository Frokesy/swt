/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Loader2 } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const USERS_COLLECTION_ID = 'users';
const ORDERS_COLLECTION_ID = 'orders';
const PREORDERS_COLLECTION_ID = 'preorders';

const CustomerDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [preorders, setPreorders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const userRes = await databases.listDocuments(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          [Query.equal('userId', id)]
        );
        setUser(userRes.documents[0] as any);

        const ordRes = await databases.listDocuments(
          DATABASE_ID,
          ORDERS_COLLECTION_ID,
          [Query.equal('userId', id), Query.orderDesc('$createdAt')]
        );
        setOrders(ordRes.documents as any[]);

        const preRes = await databases.listDocuments(
          DATABASE_ID,
          PREORDERS_COLLECTION_ID,
          [Query.equal('userId', id), Query.orderDesc('$createdAt')]
        );
        setPreorders(preRes.documents as any[]);
      } catch (err) {
        console.error('Error loading customer detail', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6">
          <Loader2 className="animate-spin" /> Loading...
        </div>
      </AdminLayout>
    );
  if (!user)
    return (
      <AdminLayout>
        <div className="p-6">Customer not found</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">{user.name || user.email}</h1>
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Profile</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || '—'}
        </p>
        <p>
          <strong>Joined:</strong>{' '}
          {new Date(user.$createdAt || user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Orders</h2>
        {orders.length === 0 ? (
          <p>No orders</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.$id || o.id}>
                <Link
                  to={`/admin/orders/${o.$id || o.id}`}
                  className="text-blue-600"
                >
                  {o.orderId || o.$id} - {o.status}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-2">Preorders</h2>
        {preorders.length === 0 ? (
          <p>No preorders</p>
        ) : (
          <ul className="space-y-2">
            {preorders.map((p) => (
              <li key={p.$id || p.id}>
                <Link
                  to={`/admin/preorders/${p.$id || p.id}`}
                  className="text-blue-600"
                >
                  {p.productName} - {p.status || 'New'}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomerDetail;
