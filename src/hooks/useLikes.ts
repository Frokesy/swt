import { useContext } from 'react';
import { LikesContext } from '../context/LikesContext';

export const useLikes = () => {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used within a LikesProvider');
  return ctx;
};

export default useLikes;
