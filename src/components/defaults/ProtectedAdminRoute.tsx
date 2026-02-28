import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProtectedAdminRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'viewer';
}

const ProtectedAdminRoute = ({
  children,
  requiredRole = 'viewer',
}: ProtectedAdminRouteProps) => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 size={32} className="text-green-700" />
        </motion.div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check role hierarchy: admin > manager > viewer
  const roleHierarchy = { viewer: 1, manager: 2, admin: 3 };
  const adminLevel = roleHierarchy[admin.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole] || 1;

  if (adminLevel < requiredLevel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
