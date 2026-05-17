/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import { Link } from 'react-router-dom';
import type { ProductType } from '../../../components/data/products';
import { Loader2, Trash2, Edit2, Plus, Search, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import AlertModal from '../../../components/modals/AlertModal';
import type { AlertType } from '../../../components/modals/AlertModal';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';
const ITEMS_PER_PAGE = 10;

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
  }>({ isOpen: false, id: null });
  const [bulkDeleteModal, setBulkDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
        Query.limit(ITEMS_PER_PAGE),
        Query.offset(offset),
      ]);
      setProducts(res.documents as unknown as ProductType[]);
      setTotalProducts(res.total);
      setCurrentPage(page);
    } catch (err) {
      console.error('Failed to load products', err);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to load products. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

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
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleProductSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => (p as any).$id ?? p.id));
    }
  };

  const confirmBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    try {
      setIsDeleting(true);
      await Promise.all(
        selectedProducts.map((id) =>
          databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
        )
      );
      fetchProducts(1);
      setSelectedProducts([]);
      setBulkDeleteModal(false);
      setAlertModal({
        isOpen: true,
        title: 'Success',
        message: `${selectedProducts.length} product(s) deleted successfully`,
        type: 'success',
      });
    } catch (err) {
      console.error('Bulk delete failed', err);
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to delete some products. Please try again.',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>
          <Link
            to="/admin/products/create"
            className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 shadow-md transition font-medium w-fit"
          >
            <Plus size={18} /> Add Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
          />
        </div>

        {/* Bulk Delete Bar */}
        {selectedProducts.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check className="text-blue-600" size={24} />
              <span className="text-sm font-medium text-blue-900">
                {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedProducts([])}
                className="px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 rounded-lg transition"
              >
                Clear
              </button>
              <button
                onClick={() => setBulkDeleteModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-3 text-green-700" size={40} />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm font-semibold text-gray-700 border-b bg-gray-50">
                    <th className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={products.length > 0 && selectedProducts.length === products.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(
                      (p) =>
                        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.category &&
                          p.category
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
                    )
                    .map((p) => {
                      const docId = (p as any).$id ?? p.id;
                      return (
                        <tr
                          key={docId}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(docId)}
                              onChange={() => toggleProductSelection(docId)}
                              className="w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {p.name}
                          </td>
                          <td className="px-6 py-4 text-gray-800 font-semibold">
                            £{p.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {p.category || '—'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">
                            {p.quantity ?? 0}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                p.inStock
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/products/${docId}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              >
                                <Edit2 size={16} /> Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(docId)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
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

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-green-700 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first product.</p>
            <Link
              to="/admin/products/create"
              className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-lg hover:bg-green-800 transition font-medium"
            >
              <Plus size={16} /> Create First Product
            </Link>
          </div>
        )}
      </div>

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

      <ConfirmModal
        isOpen={bulkDeleteModal}
        onCancel={() => setBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Products"
        message={`Are you sure you want to delete ${selectedProducts.length} product${selectedProducts.length !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
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
