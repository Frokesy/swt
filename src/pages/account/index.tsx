/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShoppingBag, Package, MapPin, Settings } from 'lucide-react';
import { account, databases } from '../../lib/appwrite';
import Ad from '../../components/defaults/Ad';
import Header from '../../components/defaults/Header';
import TopNav from '../../components/defaults/TopNav';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import SettingsSection from '../../components/sections/account/Settings';
import Addresses from '../../components/sections/account/Addresses';
import Preorders from '../../components/sections/account/Preorders';
import Orders from '../../components/sections/account/Orders';
import ProfileInfo from '../../components/sections/account/ProfileInfo';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accountData = await account.get();
        const userDoc = await databases.listDocuments(DATABASE_ID, 'users', [
          Query.equal('userId', accountData.$id),
        ]);

        setUser(userDoc.documents[0]);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <p className="text-gray-600 mb-3">
          You need to be logged in to view your account.
        </p>
        <a href="/" className="text-green-700 font-medium hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

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
              <ProfileInfo user={user} setLogoutModal={setLogoutModal} />
            )}

            {activeTab === 'orders' && <Orders userId={user.userId} />}

            {activeTab === 'preorders' && <Preorders userId={user.$id} />}

            {activeTab === 'addresses' && <Addresses userId={user.$id} />}

            {activeTab === 'settings' && <SettingsSection user={user} />}
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
