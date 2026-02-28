import { createContext } from 'react';

export interface AdminUser {
  $id: string;
  email: string;
  role: 'admin' | 'manager' | 'viewer';
  createdAt: string;
  lastLogin?: string;
}

export interface AdminContextType {
  admin: AdminUser | null;
  loading: boolean;
  error: string | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);
