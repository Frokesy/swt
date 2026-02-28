import { createContext } from 'react';
import type { LikesContextType } from './LikesProvider';

export const LikesContext = createContext<LikesContextType | null>(null);
