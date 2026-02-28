/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { Query } from 'appwrite';
import { Loader2 } from 'lucide-react';
import { databases } from '../../../lib/appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'preorders';

const PreorderDetail = () => {
  const { id } = useParams();
  const [preorder, setPreorder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('$id', id),
        ]);
        setPreorder(res.documents[0] as any);
      } catch (err) {
        console.error('Failed to load preorder', err);
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
  if (!preorder)
    return (
      <AdminLayout>
        <div className="p-6">Preorder not found</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Preorder {preorder.$id}</h1>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="font-semibold mb-2">Details</h2>
        <p>
          <strong>Product:</strong> {preorder.productName}
        </p>
        <p>
          <strong>Quantity:</strong> {preorder.quantity}
        </p>
        <p>
          <strong>Delivery Date:</strong> {preorder.deliveryDate}
        </p>
        <p>
          <strong>Customer:</strong> {preorder.name} ({preorder.email})
        </p>
        <p>
          <strong>Phone:</strong> {preorder.phone}
        </p>
        <p className="mt-3">
          <strong>Description:</strong> {preorder.description}
        </p>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-2">Admin</h2>
        <p>
          <strong>Status:</strong> {preorder.status || 'New'}
        </p>
        <p>
          <strong>Comment:</strong> {preorder.adminComment || '—'}
        </p>
        <p>
          <strong>Reviewed At:</strong> {preorder.reviewedAt || '—'}
        </p>
      </div>
    </AdminLayout>
  );
};

export default PreorderDetail;
