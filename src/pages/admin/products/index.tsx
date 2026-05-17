/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import type { ProductType } from '../../../components/data/products';
import { Loader2, Trash2, Edit2, Plus } from 'lucide-react';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import AlertModal from '../../../components/modals/AlertModal';
import type { AlertType } from '../../../components/modals/AlertModal';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

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
    setDeleteModal({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    try {
      setIsDeleting(true);
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        deleteModal.id
      );
      fetchProducts();
      setDeleteModal({ isOpen: false, id: null });
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: 'Product deleted successfully',
        type: 'success',
      });
    } catch (err) {
      console.error('Delete failed', err);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete product. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/create"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 shadow-md transition font-medium"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="text-sm font-semibold text-gray-700 border-b bg-gray-50">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const docId = (p as any).$id ?? p.id;
                return (
                  <tr
                    key={docId}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4">£{p.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.category || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">{p.quantity ?? 0}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          p.inStock
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/products/${docId}`}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                        >
                          <Edit2 size={16} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(docId)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 transition"
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

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onCancel={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={confirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        isDangerous
        isLoading={isDeleting}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </AdminLayout>
  );
};

export default AdminProducts;
