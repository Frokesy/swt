/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'appwrite';
import type { ProductType } from '../components/data/products';
import { databases } from './appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';
const REVIEWS_COLLECTION_ID = 'productReviews';
const PAGE_SIZE = 100;

const parseImages = (images: unknown): string[] => {
  if (Array.isArray(images)) return images.filter(Boolean) as string[];
  if (typeof images !== 'string' || !images.trim()) return [];

  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return images
      .split(',')
      .map((image) => image.trim())
      .filter(Boolean);
  }
};

export const mapProductDocument = (doc: any): ProductType => ({
  id: doc.$id,
  name: doc.name,
  price: Number(doc.price ?? 0),
  image: doc.image,
  category: doc.category,
  type: doc.type,
  quantity: doc.quantity,
  desc: doc.desc,
  images: parseImages(doc.images),
  liked: doc.liked,
  inStock: (doc.inStock ?? true) && Number(doc.quantity ?? 1) > 0,
  salesCount: doc.salesCount,
  sku: doc.sku,
  weight: doc.weight,
  origin: doc.origin,
  bestBefore: doc.bestBefore,
  dimensions: doc.dimensions,
});

export const listAllProducts = async () => {
  const products: ProductType[] = [];
  let offset = 0;
  let total = Infinity;

  while (products.length < total) {
    const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(PAGE_SIZE),
      Query.offset(offset),
    ]);

    products.push(...res.documents.map(mapProductDocument));
    total = res.total ?? products.length;

    if (res.documents.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return withReviewStats(products);
};

export const getProductById = async (id: string) => {
  const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
  const [product] = await withReviewStats([mapProductDocument(doc)]);
  return product;
};

const listAllReviewDocuments = async () => {
  const reviews: Array<{ productId?: string; rating?: number }> = [];
  let offset = 0;
  let total = Infinity;

  while (reviews.length < total) {
    const res = await databases.listDocuments(
      DATABASE_ID,
      REVIEWS_COLLECTION_ID,
      [Query.limit(PAGE_SIZE), Query.offset(offset)]
    );

    reviews.push(
      ...res.documents.map((doc) => ({
        productId: doc.productId,
        rating: Number(doc.rating ?? 0),
      }))
    );
    total = res.total ?? reviews.length;

    if (res.documents.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return reviews;
};

const withReviewStats = async (products: ProductType[]) => {
  if (!products.length) return products;

  try {
    const reviews = await listAllReviewDocuments();
    const stats = new Map<string, { total: number; count: number }>();

    for (const review of reviews) {
      if (!review.productId || !review.rating) continue;
      const current = stats.get(review.productId) ?? { total: 0, count: 0 };
      stats.set(review.productId, {
        total: current.total + review.rating,
        count: current.count + 1,
      });
    }

    return products.map((product) => {
      const productStats = stats.get(product.id);
      if (!productStats) return { ...product, averageRating: 0, reviewCount: 0 };

      return {
        ...product,
        averageRating: productStats.total / productStats.count,
        reviewCount: productStats.count,
      };
    });
  } catch (error) {
    console.warn('Unable to load product review stats:', error);
    return products.map((product) => ({
      ...product,
      averageRating: 0,
      reviewCount: 0,
    }));
  }
};
