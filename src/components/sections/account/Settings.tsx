/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { account } from '../../../lib/appwrite';
import { motion } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';

const SettingsSection = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handlePasswordChange = async () => {
    setMessage(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      setLoading(true);
      await account.updatePassword(newPassword, oldPassword);
      setMessage({ type: 'success', text: 'Password updated successfully ✅' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to update password. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5 text-green-700 flex items-center gap-2">
        <Lock size={18} /> Change Password
      </h3>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Current Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePasswordChange}
          disabled={loading}
          className={`flex items-center justify-center gap-2 w-full bg-green-700 text-white font-medium py-2 rounded-lg transition ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-800'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </motion.button>

        {message && (
          <p
            className={`text-sm mt-3 ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingsSection;
