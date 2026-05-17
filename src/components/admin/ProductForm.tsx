/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import type { ProductType } from '../data/products';
import { Upload } from 'lucide-react';

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

  const generateSku = () => {
    const base = [category, name]
      .filter(Boolean)
      .join('-')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 24);
    const suffix = Date.now().toString(36).toUpperCase();

    return `${base || 'PRODUCT'}-${suffix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image.trim() && (!imageFiles || imageFiles.length === 0)) {
      alert('Please add a primary image URL or upload at least one image.');
      return;
    }

    const payload: Partial<ProductType> & Record<string, any> = {
      name: name.trim(),
      price,
      category: category.trim(),
      type: type.trim(),
      quantity,
      image: image.trim(),
      images: images
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      desc: desc.trim(),
      inStock,
      sku: sku.trim() || generateSku(),
      weight: weight.trim(),
      origin: origin.trim(),
      bestBefore,
    };

    if (imageFiles && imageFiles.length) payload.imagesFiles = imageFiles;

    await onSubmit(payload);
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
    >
      {/* Basic Info Section */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Artisan Sourdough Bread"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (£) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity in Stock *
              </label>
              <input
                required
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <input
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Bakery"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type *
              </label>
              <input
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="e.g., Bread"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description & Images Section */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Description & Images
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your product..."
              className={`${inputClass} resize-none`}
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Primary Image URL or Upload *
            </label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Images
            </label>
            <input
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-2">
              Paste comma-separated image URLs or upload files below
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Images
            </label>
            <label className="flex items-center justify-center gap-2 w-full px-4 py-8 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:bg-green-50 transition">
              <Upload size={18} className="text-green-600" />
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setImageFiles(
                    e.target.files ? Array.from(e.target.files) : null
                  )
                }
                className="hidden"
              />
            </label>
            {imageFiles && imageFiles.length > 0 && (
              <p className="text-xs text-green-600 mt-2">
                ✓ {imageFiles.length} file(s) selected
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Details Section */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Details
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SKU
              </label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Leave blank to auto-generate"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight *
              </label>
              <input
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 500g"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Origin *
              </label>
              <input
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., Nigeria"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Best Before Date *
              </label>
              <input
                required
                type="date"
                value={bestBefore}
                onChange={(e) => setBestBefore(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-3 pb-1">
              <input
                id="inStock"
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
              />
              <label
                htmlFor="inStock"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                In Stock
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
        >
          {submitting ? 'Saving Product...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
