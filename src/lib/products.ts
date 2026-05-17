/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'appwrite';
import type { ProductType } from '../components/data/products';
import { databases } from './appwrite';

const DATABASE_ID = import.meta.env.VITE_DB_ID;
const COLLECTION_ID = 'products';
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
  inStock: doc.inStock,
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

  return products;
};

export const getProductById = async (id: string) => {
  const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
  return mapProductDocument(doc);
};
