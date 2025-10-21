/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { account } from "../../lib/appwrite";
import { LoaderIcon } from "lucide-react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await account.get();
        setUser(res);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) return <LoaderIcon />;

  if (!user)
    return (
      <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
    );

  return children;
};

export default ProtectedRoute;
