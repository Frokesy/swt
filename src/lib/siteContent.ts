/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases } from './appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'siteContent';

export type AdBannerContent = {
  message: string;
  enabled: boolean;
};

export type DeliveryInfoContent = {
  title: string;
  items: string[];
};

const DEFAULT_AD: AdBannerContent = {
  message: 'Orders after 10am on Thu are shipped the following Monday',
  enabled: true,
};

const DEFAULT_DELIVERY_INFO: DeliveryInfoContent = {
  title: 'Delivery Information',
  items: [
    'Orders placed will be delivered within 3 - 4 working days (excluding weekends)',
    'If a customer re-arranges, redirects, cancels, rejects, or refuses their delivery with our delivery partners without prior notice, Wosiwosi will not accept any liability for any continued delay or spoilage of fresh/frozen products that may occur from the extended period of the delivery.',
    'Order placed after 10am on Thursday will be delivered the following Monday.',
    'Once order has been dispatched, amendment/cancellation may not be possible.',
    'If nobody is available when your parcel is delivered, the delivery driver will leave your parcel at a safe place within your compound.',
    'At checkout, the Total Weight of your order is calculated based on the gross weight of each product, which includes both the product content and its packaging.',
    'For some products, especially lightweight but bulky items, we may use volumetric weight instead of actual mass to determine shipping costs.',
    'Shipping costs are determined by the Total Weight of your order, which may be based on either gross weight or volumetric weight, depending on the product.',
    'The final shipping fee is automatically calculated at checkout, ensuring accurate pricing based on logistics requirements.',
    'Kindly give us a call if you are coming to collect at our store.',
  ],
};

const parseItems = (items: unknown): string[] => {
  if (Array.isArray(items)) return items.filter(Boolean) as string[];
  if (typeof items !== 'string') return [];

  try {
    const parsed = JSON.parse(items);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return items
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

export const getAdBannerContent = async (): Promise<AdBannerContent> => {
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      'ad_banner'
    );

    return {
      message: doc.message || DEFAULT_AD.message,
      enabled: doc.enabled ?? DEFAULT_AD.enabled,
    };
  } catch {
    return DEFAULT_AD;
  }
};

export const getDeliveryInfoContent =
  async (): Promise<DeliveryInfoContent> => {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'delivery_info'
      );

      return {
        title: doc.title || DEFAULT_DELIVERY_INFO.title,
        items: parseItems(doc.items).length
          ? parseItems(doc.items)
          : DEFAULT_DELIVERY_INFO.items,
      };
    } catch {
      return DEFAULT_DELIVERY_INFO;
    }
  };

const upsertContentDocument = async (
  documentId: string,
  payload: Record<string, any>
) => {
  try {
    await databases.getDocument(DATABASE_ID, COLLECTION_ID, documentId);
    return databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      payload
    );
  } catch {
    return databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      documentId,
      payload
    );
  }
};

export const updateAdBannerContent = (payload: AdBannerContent) =>
  upsertContentDocument('ad_banner', payload);

export const updateDeliveryInfoContent = (payload: DeliveryInfoContent) =>
  upsertContentDocument('delivery_info', {
    title: payload.title,
    items: payload.items,
  });
