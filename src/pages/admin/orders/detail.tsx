/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Loader2 } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'orders';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('$id', id),
        ]);
        setOrder(res.documents[0] as any);
      } catch (err) {
        console.error('Failed to load order', err);
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
  if (!order)
    return (
      <AdminLayout>
        <div className="p-6">Order not found</div>
      </AdminLayout>
    );

  const items = (() => {
    try {
      return JSON.parse(order.items?.[0] || '[]');
    } catch {
      return [];
    }
  })();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">
        Order {order.orderId || order.$id}
      </h1>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>{order.email || order.userId}</p>
        <p className="text-sm text-gray-500">
          Placed{' '}
          {new Date(order.$createdAt || order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Items</h2>
        <div className="space-y-3">
          {items.map((it: any, i: number) => (
            <div key={i} className="flex items-center gap-4 border-b pb-2">
              <img
                src={it.image}
                alt={it.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-600">
                  Qty: {it.quantity ?? 1}
                </div>
              </div>
              <div className="ml-auto font-semibold">
                ${(it.price ?? 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-2">Summary</h2>
        <p>Total: ${((order.totalPrice ?? 0) / 100).toFixed(2)}</p>
        <p>Status: {order.status}</p>
        {order.tracking && <p>Tracking: {order.tracking}</p>}
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
