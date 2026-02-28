/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Plunk from '@plunk/node';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'preorders';
const plunkSecret = import.meta.env.VITE_PLUNK_SECRET;
const plunkClient = new Plunk(plunkSecret);

const AdminPreorders = () => {
  const [preorders, setPreorders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
      ]);
      setPreorders(res.documents as any[]);
    } catch (err) {
      console.error('Failed to load preorders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  const handleDecision = async (id: string, approve: boolean) => {
    const comment = window.prompt(
      approve ? 'Approval comment (optional):' : 'Rejection reason (required):'
    );
    if (!approve && !comment) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
        status: approve ? 'Approved' : 'Rejected',
        adminComment: comment ?? '',
        reviewedAt: new Date().toISOString(),
      });
      fetchPreorders();

      // Fetch updated doc to use in emails
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('$id', id),
      ]);
      const doc = res.documents[0] as any;

      // Notify customer
      try {
        const to = doc.email || doc.userEmail || doc.emailAddress || doc.userId;
        if (to) {
          await plunkClient.emails.send({
            to,
            subject: approve
              ? 'Your preorder was approved'
              : 'Your preorder was rejected',
            body: approve
              ? `Hi ${doc.name || ''},\n\nYour preorder for ${doc.productName} was approved.\n\nComment: ${comment ?? '—'}`
              : `Hi ${doc.name || ''},\n\nYour preorder for ${doc.productName} was rejected.\n\nReason: ${comment}`,
          });
        }
        // notify admin
        await plunkClient.emails.send({
          to: 'ayanfeoluwaakindele24@gmail.com',
          subject: `Preorder ${doc.$id || id} ${approve ? 'approved' : 'rejected'}`,
          body: `Preorder ${doc.$id || id} has been ${approve ? 'approved' : 'rejected'} by admin. Comment: ${comment ?? '—'}`,
        });
      } catch (emailErr) {
        console.warn('Failed to send preorder notification', emailErr);
      }
    } catch (err) {
      console.error('Decision failed', err);
      alert('Failed to update preorder status');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Preorders</h1>
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
                <th className="p-3">Product</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Requested Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {preorders.map((p) => {
                const id = (p as any).$id ?? p.id;
                return (
                  <tr key={id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.productName}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3">{p.deliveryDate}</td>
                    <td className="p-3">{p.name || p.email || p.userId}</td>
                    <td className="p-3">{p.status || 'New'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/preorders/${id}`}
                          className="text-blue-600"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDecision(id, true)}
                          className="text-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleDecision(id, false)}
                          className="text-red-600"
                        >
                          Reject
                        </button>
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

export default AdminPreorders;
