/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Plunk from '@plunk/node';
const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'orders';
const plunkSecret = import.meta.env.VITE_PLUNK_SECRET;
const plunkClient = new Plunk(plunkSecret);

const AdminOrders: FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
      ]);
      setOrders(res.documents as any[]);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkShipped = async (docId: string) => {
    const ok = window.confirm('Mark this order as Shipped?');
    if (!ok) return;
    try {
      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        docId,
        {
          status: 'Shipped',
          shippedAt: new Date().toISOString(),
        }
      );
      fetchOrders();

      try {
        const toEmail = updated.email || updated.userId;
        if (toEmail) {
          await plunkClient.emails.send({
            to: toEmail,
            subject: 'Your order has been shipped 🚚',
            body: `Hello,\n\nYour order ${updated.orderId || docId} has been marked as shipped.\n\nThank you for shopping with us!`,
          });
        }
        await plunkClient.emails.send({
          to: 'ayanfeoluwaakindele24@gmail.com',
          subject: `Order ${updated.orderId || docId} shipped`,
          body: `Order ${updated.orderId || docId} was marked shipped by admin at ${new Date().toLocaleString()}.`,
        });
      } catch (emailErr) {
        console.warn('Failed to send shipment notification email', emailErr);
      }
    } catch (err) {
      console.error('Failed to update order', err);
      alert('Failed to update order');
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        (o.orderId || '').toString().toLowerCase().includes(q) ||
        (o.userId || '').toLowerCase().includes(q) ||
        (o.email || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4 gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <input
            placeholder="Search by order id, user id or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="p-2 border rounded-lg w-full"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-auto bg-white border border-gray-100 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Placed</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const id = (o as any).$id ?? o.$id ?? o.id;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{o.orderId || id}</td>
                    <td className="p-3">{o.email || o.userId || '—'}</td>
                    <td className="p-3">${(o.totalPrice ?? 0).toFixed(2)}</td>
                    <td className="p-3">{o.status || 'Pending'}</td>
                    <td className="p-3">
                      {new Date(
                        o.$createdAt || o.createdAt || Date.now()
                      ).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/orders/${id}`}
                          className="text-blue-600"
                        >
                          View
                        </Link>
                        {o.status !== 'Shipped' && (
                          <button
                            onClick={() => handleMarkShipped(id)}
                            className="text-green-700"
                          >
                            Mark Shipped
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
