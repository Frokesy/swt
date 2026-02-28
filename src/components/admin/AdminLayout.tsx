import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Box,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  Percent,
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  requiredRole?: 'viewer' | 'manager' | 'admin';
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <BarChart3 size={20} />,
    path: '/admin/dashboard',
  },
  { label: 'Products', icon: <Box size={20} />, path: '/admin/products' },
  { label: 'Inventory', icon: <Package size={20} />, path: '/admin/inventory' },
  { label: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
  { label: 'Preorders', icon: <Package size={20} />, path: '/admin/preorders' },
  {
    label: 'Customers',
    icon: <Users size={20} />,
    path: '/admin/customers',
    requiredRole: 'manager',
  },
  {
    label: 'Promotions',
    icon: <Percent size={20} />,
    path: '/admin/promotions',
    requiredRole: 'manager',
  },
  {
    label: 'Delivery',
    icon: <DollarSign size={20} />,
    path: '/admin/delivery',
    requiredRole: 'manager',
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    path: '/admin/settings',
    requiredRole: 'admin',
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { admin, logoutAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const roleHierarchy = { viewer: 1, manager: 2, admin: 3 } as const;
  const adminLevel = roleHierarchy[admin?.role || 'viewer'] || 0;

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRole) return true;
    const requiredLevel = roleHierarchy[item.requiredRole] || 1;
    return adminLevel >= requiredLevel;
  });

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <motion.div
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3 }}
        className="bg-green-900 text-white shadow-lg hidden md:flex flex-col"
      >
        <div className="p-6 border-b border-green-800">
          <motion.h1
            animate={{ opacity: sidebarCollapsed ? 0 : 1 }}
            className="text-xl font-bold"
          >
            {!sidebarCollapsed && 'Rehubot'}
          </motion.h1>
          {sidebarCollapsed && <div className="text-xl font-bold">RB</div>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-green-700 text-white'
                    : 'text-green-100 hover:bg-green-800'
                }`}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </motion.button>
            </Link>
          ))}
        </nav>

        <div className="border-t border-green-800 p-4 space-y-3">
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-green-200 px-2"
            >
              <p className="font-semibold text-white">{admin?.email}</p>
              <p className="capitalize text-xs text-green-300">{admin?.role}</p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition"
          >
            <LogOut size={18} />
            {!sidebarCollapsed && 'Logout'}
          </motion.button>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="p-2 hover:bg-gray-100 rounded-lg hidden md:inline-flex text-gray-700"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg md:hidden inline-flex text-gray-700"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex-1 text-center md:text-left md:ml-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {filteredNavItems.find((item) => isActive(item.path))?.label ||
                'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 capitalize hidden sm:inline">
              {admin?.role}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-lg text-red-600"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black z-40 md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />

              <motion.div
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed top-0 left-0 w-64 h-screen bg-green-900 text-white shadow-lg z-50 md:hidden flex flex-col"
              >
                <div className="p-6 border-b border-green-800 flex items-center justify-between">
                  <h1 className="text-xl font-bold">Rehubot</h1>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-2 hover:bg-green-800 rounded-lg"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                          isActive(item.path)
                            ? 'bg-green-700'
                            : 'text-green-100 hover:bg-green-800'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </motion.button>
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-green-800 p-4 space-y-3">
                  <div className="text-sm text-green-200 px-2">
                    <p className="font-semibold text-white">{admin?.email}</p>
                    <p className="capitalize text-xs text-green-300">
                      {admin?.role}
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                  >
                    <LogOut size={18} />
                    Logout
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
