/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { databases, client } from '../../../lib/appwrite';
import uploadToCloudinary from '../../../lib/cloudinary';
import { Functions } from 'appwrite';
import { Query } from 'appwrite';
import type { ProductType } from '../../../components/data/products';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Partial<ProductType> | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
          Query.equal('$id', id),
        ]);
        const doc = res.documents[0] as unknown as ProductType;
        setProduct(doc);
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpdate = async (payload: any) => {
    if (!id) return;
    try {
      setSubmitting(true);
      if (payload.imagesFiles && Array.isArray(payload.imagesFiles)) {
        const uploads: string[] = [];
        for (const f of payload.imagesFiles) {
          try {
            const url = await uploadToCloudinary(f);
            uploads.push(url);
          } catch (err) {
            console.error('Image upload failed', err);
            alert('Image upload failed. Aborting.');
            setSubmitting(false);
            return;
          }
        }
        payload.images = [...(payload.images ?? []), ...uploads];
        if (!payload.image && uploads.length) payload.image = uploads[0];
        delete payload.imagesFiles;
      }

      const fnId = import.meta.env.VITE_APPWRITE_VALIDATE_PRODUCT_FUNCTION_ID;
      if (fnId) {
        try {
          const functions = new Functions(client);
          const exec = await functions.createExecution(
            fnId,
            JSON.stringify(payload)
          );
          const body = exec.responseBody ? JSON.parse(exec.responseBody) : null;
          if (body && (body.$id || body.id || body.docId)) {
            navigate('/admin/products');
            return;
          }
        } catch (err) {
          console.warn(
            'Validation function failed, falling back to direct DB update',
            err
          );
        }
      }

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, payload);
      navigate('/admin/products');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  if (!product)
    return (
      <AdminLayout>
        <div className="p-6">Product not found</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <ProductForm
        initial={product}
        onSubmit={handleUpdate}
        submitting={submitting}
      />
    </AdminLayout>
  );
};

export default EditProduct;
