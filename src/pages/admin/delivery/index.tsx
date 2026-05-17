import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import AdminLayout from '../../../components/admin/AdminLayout';
import {
  getDeliveryFee,
  updateDeliveryFee,
  type DeliverySettings,
} from '../../../lib/deliverySettings';
import {
  getAdBannerContent,
  getDeliveryInfoContent,
  updateAdBannerContent,
  updateDeliveryInfoContent,
} from '../../../lib/siteContent';

const AdminDeliverySettings = () => {
  const [settings, setSettings] = useState<DeliverySettings | null>(null);
  const [fee, setFee] = useState<string>('5.99');
  const [adMessage, setAdMessage] = useState('');
  const [adEnabled, setAdEnabled] = useState(true);
  const [deliveryTitle, setDeliveryTitle] = useState('Delivery Information');
  const [deliveryItemsText, setDeliveryItemsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const currentFee = await getDeliveryFee();
        const [adContent, deliveryContent] = await Promise.all([
          getAdBannerContent(),
          getDeliveryInfoContent(),
        ]);
        setFee(currentFee.toString());
        setSettings({ fee: currentFee });
        setAdMessage(adContent.message);
        setAdEnabled(adContent.enabled);
        setDeliveryTitle(deliveryContent.title);
        setDeliveryItemsText(deliveryContent.items.join('\n'));
      } catch (error) {
        console.error('Error loading delivery settings:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load delivery settings',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const newFee = parseFloat(fee);

      // Validation
      if (isNaN(newFee) || newFee < 0) {
        setMessage({
          type: 'error',
          text: 'Please enter a valid delivery fee (must be a positive number)',
        });
        return;
      }

      setSaving(true);
      await Promise.all([
        updateDeliveryFee(newFee),
        updateAdBannerContent({
          message: adMessage.trim(),
          enabled: adEnabled,
        }),
        updateDeliveryInfoContent({
          title: deliveryTitle.trim() || 'Delivery Information',
          items: deliveryItemsText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      ]);

      setSettings({ fee: newFee });
      setMessage({
        type: 'success',
        text: 'Delivery, ad banner, and delivery page content updated.',
      });

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving delivery fee:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save delivery fee. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFee(settings.fee.toString());
      setMessage(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-green-700" />
            <p className="text-gray-600">Loading delivery settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Delivery & Site Notices
            </h1>
            <p className="text-gray-600">
              Manage delivery fee, customer-facing delivery information, and the
              site-wide ad banner
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium">{message.text}</span>
            </motion.div>
          )}

          {/* Settings Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
            {/* Delivery Fee Input */}
            <div className="space-y-3">
              <label
                htmlFor="delivery-fee"
                className="block text-lg font-semibold text-gray-700"
              >
                Delivery Fee (£)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                This fee will be added to all customer orders
              </p>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-xl text-gray-500">
                  £
                </span>
                <input
                  id="delivery-fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                  placeholder="5.99"
                />
              </div>
              {!isNaN(parseFloat(fee)) && (
                <p className="text-sm text-gray-600 mt-2">
                  Current fee: <span className="font-semibold">£{parseFloat(fee).toFixed(2)}</span>
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tip:</span> This delivery fee
                will be automatically applied to all customer checkouts and is
                added to their order total.
              </p>
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <label className="block text-lg font-semibold text-gray-700">
                Ad Banner
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="ad-enabled"
                  type="checkbox"
                  checked={adEnabled}
                  onChange={(e) => setAdEnabled(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="ad-enabled" className="text-sm text-gray-700">
                  Show banner on user pages
                </label>
              </div>
              <input
                value={adMessage}
                onChange={(e) => setAdMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                placeholder="Banner message"
              />
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-6">
              <label className="block text-lg font-semibold text-gray-700">
                Delivery Information Page
              </label>
              <input
                value={deliveryTitle}
                onChange={(e) => setDeliveryTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition"
                placeholder="Page title"
              />
              <textarea
                value={deliveryItemsText}
                onChange={(e) => setDeliveryItemsText(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition min-h-[220px]"
                placeholder="One delivery information item per line"
              />
              <p className="text-xs text-gray-500">
                Add one delivery information bullet per line.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                disabled={saving}
                className="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </motion.button>
            </div>
          </div>

          {/* Recent Updates Info */}
          {settings?.updatedAt && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Last updated:</span>{' '}
                {new Date(settings.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDeliverySettings;
