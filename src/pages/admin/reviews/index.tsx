import { useEffect, useMemo, useState } from 'react';
import { ID, Query } from 'appwrite';
import { Edit2, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import { databases } from '../../../lib/appwrite';
import { listAllProducts } from '../../../lib/products';
import type { ProductType } from '../../../components/data/products';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const REVIEWS_COLLECTION_ID = 'productReviews';

type ReviewDoc = {
  $id: string;
  productId: string;
  name: string;
  rating: number;
  comment: string;
  $createdAt?: string;
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    productId: '',
    name: '',
    rating: 5,
    comment: '',
  });

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product.name])),
    [products]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({ productId: '', name: '', rating: 5, comment: '' });
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [reviewRes, loadedProducts] = await Promise.all([
        databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
          Query.orderDesc('$createdAt'),
          Query.limit(100),
        ]),
        listAllProducts(),
      ]);

      setReviews(reviewRes.documents as unknown as ReviewDoc[]);
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.name.trim() || !form.comment.trim()) return;

    try {
      setSaving(true);
      const payload = {
        productId: form.productId,
        name: form.name.trim(),
        rating: Number(form.rating),
        comment: form.comment.trim(),
      };

      if (editingId) {
        await databases.updateDocument(
          DATABASE_ID,
          REVIEWS_COLLECTION_ID,
          editingId,
          payload
        );
      } else {
        await databases.createDocument(
          DATABASE_ID,
          REVIEWS_COLLECTION_ID,
          ID.unique(),
          payload
        );
      }

      resetForm();
      await loadReviews();
    } catch (error) {
      console.error('Failed to save review:', error);
      alert('Failed to save review.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (review: ReviewDoc) => {
    setEditingId(review.$id);
    setForm({
      productId: review.productId,
      name: review.name,
      rating: Number(review.rating ?? 5),
      comment: review.comment,
    });
  };

  const handleDelete = async (reviewId: string) => {
    const ok = window.confirm('Delete this review?');
    if (!ok) return;

    try {
      await databases.deleteDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        reviewId
      );
      setReviews((current) =>
        current.filter((review) => review.$id !== reviewId)
      );
      if (editingId === reviewId) resetForm();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reviews</h1>
          <p className="text-gray-600">
            Create, edit, and remove customer product reviews.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-5 grid gap-4"
        >
          <div className="grid md:grid-cols-[1fr_1fr_auto] gap-4">
            <select
              value={form.productId}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  productId: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <input
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Reviewer name"
              required
            />
            <select
              value={form.rating}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  rating: Number(e.target.value),
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating === 1 ? '' : 's'}
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={form.comment}
            onChange={(e) =>
              setForm((current) => ({ ...current, comment: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 min-h-[100px]"
            placeholder="Review comment"
            required
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {saving
                ? 'Saving...'
                : editingId
                  ? 'Update Review'
                  : 'Create Review'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg font-semibold"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="animate-spin text-green-700" />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="p-3">Product</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Comment</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.$id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {productMap.get(review.productId) || review.productId}
                    </td>
                    <td className="p-3">{review.name}</td>
                    <td className="p-3">{review.rating}/5</td>
                    <td className="p-3 max-w-md">{review.comment}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(review)}
                          className="text-blue-600 inline-flex items-center gap-1"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.$id)}
                          className="text-red-600 inline-flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
