/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import type { ProductType } from '../data/products';

interface Props {
  initial?: Partial<ProductType>;
  onSubmit: (payload: Partial<ProductType>) => Promise<void>;
  submitting?: boolean;
}

const ProductForm = ({ initial = {}, onSubmit, submitting }: Props) => {
  const [name, setName] = useState(initial.name ?? '');
  const [price, setPrice] = useState<number>(initial.price ?? 0);
  const [category, setCategory] = useState(initial.category ?? '');
  const [type, setType] = useState(initial.type ?? '');
  const [quantity, setQuantity] = useState<number>(initial.quantity ?? 1);
  const [image, setImage] = useState(initial.image ?? '');
  const [images, setImages] = useState(
    (initial.images ?? []).join?.(',') ?? ''
  );
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const [desc, setDesc] = useState(initial.desc ?? '');
  const [inStock, setInStock] = useState<boolean>(initial.inStock ?? true);
  const [sku, setSku] = useState((initial as any).sku ?? '');
  const [weight, setWeight] = useState((initial as any).weight ?? '');
  const [origin, setOrigin] = useState((initial as any).origin ?? '');
  const [bestBefore, setBestBefore] = useState(
    (initial as any).bestBefore ?? ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<ProductType> & Record<string, any> = {
      name,
      price,
      category,
      type,
      quantity,
      image,
      images: images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      desc,
      inStock,
      sku,
      weight,
      origin,
      bestBefore,
    };

    if (imageFiles && imageFiles.length) payload.imagesFiles = imageFiles;

    await onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-lg border border-gray-100"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full p-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            required
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            required
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Image (URL)
        </label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 w-full p-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Images (comma separated)
        </label>
        <input
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="mt-1 w-full p-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-2">
          Or upload files below (they will be uploaded to Cloudinary)
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setImageFiles(e.target.files ? Array.from(e.target.files) : null)
          }
          className="mt-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="mt-1 w-full p-2 border rounded-lg"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weight
          </label>
          <input
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Origin
          </label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Best Before
          </label>
          <input
            type="date"
            value={bestBefore}
            onChange={(e) => setBestBefore(e.target.value)}
            className="mt-1 w-full p-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="inStock"
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label htmlFor="inStock" className="text-sm">
            In stock
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={submitting}
          className={`px-4 py-2 rounded-lg text-white ${submitting ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'}`}
        >
          {submitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
