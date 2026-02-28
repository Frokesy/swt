/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { account, databases } from '../lib/appwrite';
import { AdminContext } from './AdminContext';
import type { AdminUser } from './AdminContext';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const ADMINS_COLLECTION_ID = 'admins';

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshAdmin = async () => {
    try {
      const user = await account.get();
      const adminDocs = await databases.listDocuments(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        []
      );

      const adminUser = adminDocs.documents.find(
        (doc: any) => doc.userId === user.$id
      );

      if (adminUser) {
        setAdmin({
          $id: adminUser.$id,
          email: adminUser.email,
          role: adminUser.role,
          createdAt: adminUser.$createdAt,
          lastLogin: adminUser.lastLogin,
        });
        setError(null);
      } else {
        setAdmin(null);
        setError('User is not an admin');
      }
    } catch (err) {
      console.error('Error refreshing admin:', err);
      setAdmin(null);
      setError('Failed to load admin data');
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await account.get();
        if (user) {
          await refreshAdmin();
        }
      } catch (err) {
        setAdmin(null);
        console.error('No active admin session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const loginAdmin = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      try {
        await account.deleteSession('current');
      } catch (e) {
        /* ignore */
        console.warn('No existing session to delete:', e);
      }

      await account.createEmailPasswordSession(email, password);

      const user = await account.get();

      const adminDocs = await databases.listDocuments(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        []
      );

      const adminUser = adminDocs.documents.find(
        (doc: any) => doc.userId === user.$id || doc.email === email
      );

      if (!adminUser) {
        await account.deleteSession('current');
        throw new Error('This account does not have admin access');
      }

      const now = new Date().toISOString();

      await databases.updateDocument(
        DATABASE_ID,
        ADMINS_COLLECTION_ID,
        adminUser.$id,
        { lastLogin: now }
      );

      setAdmin({
        $id: adminUser.$id,
        email: adminUser.email,
        role: adminUser.role,
        createdAt: adminUser.$createdAt,
        lastLogin: now,
      });
    } catch (err: any) {
      const errorMsg =
        err?.message || 'Failed to login. Please check credentials.';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = async () => {
    try {
      await account.deleteSession('current');
      setAdmin(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout');
      throw err;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        error,
        loginAdmin,
        logoutAdmin,
        refreshAdmin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
