/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  Loader2,
} from 'lucide-react';
import { databases } from '../../../lib/appwrite';
import { Query } from 'appwrite';
import AdminLayout from '../../../components/admin/AdminLayout';

const DATABASE_ID = import.meta.env.VITE_DB_ID;

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const ordersRes = await databases.listDocuments(DATABASE_ID, 'orders', [
          Query.orderDesc('$createdAt'),
        ]);
        const totalOrders = ordersRes.total;

        const preordersRes = await databases.listDocuments(
          DATABASE_ID,
          'preorders',
          [Query.orderDesc('$createdAt')]
        );
        const totalPreorders = preordersRes.total;

        const usersRes = await databases.listDocuments(
          DATABASE_ID,
          'users',
          []
        );
        const totalCustomers = usersRes.total;

        const totalRevenue = ordersRes.documents.reduce(
          (sum: number, order: any) => sum + (order.totalPrice || 0),
          0
        );

        setStats([
          {
            title: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            icon: <TrendingUp size={24} />,
            color: 'bg-green-100 text-green-700',
          },
          {
            title: 'Orders',
            value: totalOrders,
            icon: <ShoppingCart size={24} />,
            color: 'bg-blue-100 text-blue-700',
          },
          {
            title: 'Preorders',
            value: totalPreorders,
            icon: <Package size={24} />,
            color: 'bg-purple-100 text-purple-700',
          },
          {
            title: 'Customers',
            value: totalCustomers,
            icon: <Users size={24} />,
            color: 'bg-orange-100 text-orange-700',
          },
        ]);

        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AdminLayout>
      <motion.div
        className="space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to Rehubot Admin
          </h1>
          <p className="text-gray-600">
            Manage your store, track orders, and view analytics all in one
            place.
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex items-center justify-center min-h-96"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={32} className="text-green-700" />
              </motion.div>
              <p className="text-gray-600">Loading dashboard stats...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4"
            variants={itemVariants}
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`${stat.color} rounded-lg p-6 shadow-sm border border-gray-200`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium opacity-75 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="opacity-20">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.a
              href="/admin/products/create"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-green-800 transition"
            >
              Add Product
            </motion.a>
            <motion.a
              href="/admin/orders"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-blue-800 transition"
            >
              View Orders
            </motion.a>
            <motion.a
              href="/admin/preorders"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-700 text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-purple-800 transition"
            >
              Manage Preorders
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminDashboard;
