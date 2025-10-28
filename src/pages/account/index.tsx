import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Package,
  MapPin,
  Settings,
  LogOut,
  Camera,
} from 'lucide-react';
import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import SettingsSection from '../../components/sections/account/Settings';

const tabs = [
  { key: 'profile', label: 'Profile Info', icon: <User size={18} /> },
  { key: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { key: 'preorders', label: 'Preorders', icon: <Package size={18} /> },
  { key: 'addresses', label: 'Addresses', icon: <MapPin size={18} /> },
  { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
];

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [logoutModal, setLogoutModal] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImg(url);
    }
  };

  return (
    <div>
      <Ad />
      <Header />
      <TopNav />

      <motion.div
        className="w-[90%] lg:w-[60%] mx-auto my-10 text-[#333]"
        initial="hidden"
        animate="show"
        variants={{
          show: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.h2
          variants={fadeUp}
          className="text-[24px] font-semibold text-green-700 mb-4"
        >
          My Account
        </motion.h2>

        <motion.p variants={fadeUp} className="text-gray-600 mb-10">
          Manage your profile, orders, addresses, and preferences from one
          place.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-3"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md rounded-xl p-6 border border-gray-100"
          >
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 text-green-700">
                  Profile Information
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 bg-gray-100">
                      {profileImg ? (
                        <img
                          src={profileImg}
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
                      />
                    </label>
                  </div>

                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-lg">John Doe</h3>
                    <p className="text-gray-500 text-sm">john@example.com</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+234 900 000 0000"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Date Joined
                    </label>
                    <input
                      type="text"
                      value="Jan 20, 2025"
                      readOnly
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setLogoutModal(true)}
                    className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">
                  Orders
                </h3>
                <p className="text-gray-600">
                  You haven’t placed any orders yet.
                </p>
              </div>
            )}

            {activeTab === 'preorders' && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">
                  Preorders
                </h3>
                <p className="text-gray-600">No preorders found.</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-700">
                  Addresses
                </h3>
                <p className="text-gray-600">
                  You haven’t added any addresses yet.
                </p>
              </div>
            )}

            {activeTab === 'settings' && <SettingsSection />}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {logoutModal && (
            <LogoutConfirmModal setLogoutModal={setLogoutModal} />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyAccount;
