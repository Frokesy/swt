/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import ProductForm from '../../../components/admin/ProductForm';
import { databases, client } from '../../../lib/appwrite';
import { ID, Functions } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import uploadToCloudinary from '../../../lib/cloudinary';
import AlertModal from '../../../components/modals/AlertModal';
import type { AlertType } from '../../../components/modals/AlertModal';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';

const CreateProduct = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: AlertType;
  }>({ isOpen: false, title: '', message: '', type: 'info' });

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
            setAlertModal({
              isOpen: true,
              title: 'Upload Failed',
              message: 'Image upload failed. Please try again.',
              type: 'error',
            });
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
      setAlertModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to create product. Please try again.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Product
      </h1>
      <ProductForm onSubmit={handleCreate} submitting={submitting} />

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

export default CreateProduct;
