/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { databases, client } from '../../../lib/appwrite';
import { ID, Functions } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import uploadToCloudinary from '../../../lib/cloudinary';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const CreateProduct = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (payload: any) => {
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
        payload.images = uploads;
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
            'Validation function failed, falling back to direct DB write',
            err
          );
        }
      }

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        payload
      );
      navigate('/admin/products');
    } catch (err) {
      console.error('Create product failed', err);
      alert('Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Create Product</h1>
      <ProductForm onSubmit={handleCreate} submitting={submitting} />
    </AdminLayout>
  );
};

export default CreateProduct;
