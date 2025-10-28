/* eslint-disable @typescript-eslint/no-explicit-any */
import { Camera, LogOut, User } from 'lucide-react';
import { useState, type SetStateAction } from 'react';
import { databases } from '../../../lib/appwrite';
import { AnimatePresence } from 'framer-motion';
import Toast from '../../defaults/Toast';
import ErrToast from '../../defaults/ErrToast';

interface ProfileInfoProps {
  user: any;
  setLogoutModal: React.Dispatch<SetStateAction<boolean>>;
}

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const USERS_COLLECTION_ID = 'users';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const ProfileInfo = ({ user, setLogoutModal }: ProfileInfoProps) => {
  const [profilePicture, setProfilePicture] = useState<string | null>(
    user?.profilePicture || null
  );
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [toast, setToast] = useState<string | null>(null);
  const [errToast, setErrToast] = useState<string | null>(null);
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      setLoading(true);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();

      if (!data.secure_url) throw new Error('Upload failed.');

      setProfilePicture(data.secure_url);

      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        {
          profilePicture: data.secure_url,
        }
      );

      setToast('Profile picture updated successfully.');
      setTimeout(() => setToast(null), 1800);
    } catch (error) {
      console.error('Upload failed:', error);
      setTimeout(() => setErrToast(null), 1800);
      setErrToast('Image upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        {
          name,
          phone,
        }
      );
      setToast('Profile updated successfully.');
      setTimeout(() => setToast(null), 1800);
    } catch (error) {
      console.error('Error saving profile:', error);
      setTimeout(() => setErrToast(null), 1800);
      setErrToast('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-green-700">
        Profile Information
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 bg-gray-100 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
                <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-green-700 mt-1">Uploading...</p>
              </div>
            ) : profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-full h-full text-gray-400 p-8" />
            )}
          </div>

          <label className="absolute bottom-0 right-0 bg-green-700 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-green-800 transition">
            <Camera size={16} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-500 text-sm">{email}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Joined</label>
          <input
            type="text"
            value={formatDate(user?.$createdAt)}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-70"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={() => setLogoutModal(true)}
          className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
      <AnimatePresence>{toast && <Toast toast={toast} />}</AnimatePresence>
      <AnimatePresence>
        {errToast && <ErrToast toast={errToast} />}
      </AnimatePresence>
    </div>
  );
};

export default ProfileInfo;
