/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import type { ProductType } from '../../../components/data/products';
import { Loader2, Trash2, Edit2, Plus } from 'lucide-react';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
      ]);
      setProducts(res.documents as unknown as ProductType[]);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm('Delete this product?');
    if (!ok) return;
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      fetchProducts();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={16} /> Add Product
        </Link>
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
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const docId = (p as any).$id ?? p.id;
                return (
                  <tr key={docId} className="border-b hover:bg-gray-50">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">${p.price.toFixed(2)}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3">{p.quantity ?? 0}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${docId}`}
                          className="text-blue-600 flex items-center gap-2"
                        >
                          <Edit2 size={16} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(docId)}
                          className="text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete
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

export default AdminProducts;
