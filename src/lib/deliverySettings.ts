import { databases } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'deliverySettings';

export interface DeliverySettings {
  $id?: string;
  fee: number;
  updatedAt?: string;
}

/**
 * Fetch the current delivery fee from the database
 * @returns The delivery fee amount, or default 5.99 if not found
 */
export const getDeliveryFee = async (): Promise<number> => {
  try {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1),
    ]);

    if (res.documents.length > 0) {
      return res.documents[0].fee || 5.99;
    }

    // Return default if no settings found
    return 5.99;
  } catch (error) {
    console.error('Error fetching delivery fee:', error);
    // Return default fee on error
    return 5.99;
  }
};

/**
 * Update the delivery fee in the database
 * @param newFee The new delivery fee amount
 * @returns The updated delivery settings
 */
export const updateDeliveryFee = async (
  newFee: number
): Promise<DeliverySettings> => {
  try {
    // First, try to fetch existing settings
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1),
    ]);

    if (res.documents.length > 0) {
      // Update existing document
      const docId = res.documents[0].$id;
      const updated = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        docId,
        {
          fee: newFee,
          $updatedAt: new Date().toISOString(),
        }
      );
      return updated as unknown as DeliverySettings;
    } else {
      // Create new document if none exists
      const created = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'delivery_fee_config', // Fixed document ID for easy access
        {
          fee: newFee,
          updatedAt: new Date().toISOString(),
        }
      );
      return created as unknown as DeliverySettings;
    }
  } catch (error) {
    console.error('Error updating delivery fee:', error);
    throw error;
  }
};

/**
 * Get delivery fee with caching (simple in-memory cache)
 * Cache lasts for 5 minutes
 */
const cache: { fee: number; timestamp: number } = {
  fee: 5.99,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getDeliveryFeeCached = async (): Promise<number> => {
  const now = Date.now();

  // Return cached value if still valid
  if (cache.timestamp && now - cache.timestamp < CACHE_DURATION) {
    return cache.fee;
  }

  // Fetch fresh data
  const fee = await getDeliveryFee();
  cache.fee = fee;
  cache.timestamp = now;

  return fee;
};
