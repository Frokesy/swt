import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import type { AdminContextType } from '../context/AdminContext';

export const useAdmin = (): AdminContextType => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
};

export default useAdmin;
