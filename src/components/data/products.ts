export interface ProductType {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  type: string;
  quantity?: number;
  desc?: string;
  images?: string[];
  liked?: boolean;
  inStock?: boolean;
  salesCount?: number;
}

export const products: ProductType[] = [
  {
    id: '1',
    name: 'Mix Meat',
    price: 2.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055813/mix-meat_kefnxl.webp',
    category: 'Recently Added',
    type: 'meat',
    quantity: 1,
    desc: 'A delicious mix of various meats, perfect for stews and grills.',
  },
  {
    id: '2',
    name: 'Turkey',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/turkey_p5ntox.webp',
    category: 'Recently Added',
    type: 'meat',
    quantity: 1,
    desc: 'Fresh turkey meat, ideal for roasting or making hearty soups.',
  },
  {
    id: '3',
    name: 'Fresh Ugu Branch',
    price: 1.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055813/ugu_ueeex2.webp',
    category: 'Recently Added',
    type: 'vegetable',
    quantity: 1,
    desc: 'Fresh and organic ugu leaves, perfect for soups and stews.',
  },
  {
    id: '4',
    name: 'Yam Tuber',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/yam_omvvl4.webp',
    category: 'Recently Added',
    type: 'tuber',
    quantity: 1,
    desc: 'Fresh and organic yam tubers, perfect for boiling, frying, or baking.',
  },
  {
    id: '24',
    name: 'Yam Tuber',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/yam_omvvl4.webp',
    category: 'Recently Added',
    type: 'tuber',
    quantity: 1,
    desc: 'Fresh and organic yam tubers, perfect for boiling, frying, or baking.',
  },
  {
    id: '5',
    name: 'Mix Meat',
    price: 2.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055813/mix-meat_kefnxl.webp',
    category: 'Most Popular',
    type: 'meat',
    quantity: 1,
    desc: 'A delicious mix of various meats, perfect for stews and grills.',
  },
  {
    id: '6',
    name: 'Turkey',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/turkey_p5ntox.webp',
    category: 'Most Popular',
    type: 'meat',
    quantity: 1,
    desc: 'Fresh turkey meat, ideal for roasting or making hearty soups.',
  },
  {
    id: '7',
    name: 'Fresh Ugu Branch',
    price: 1.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055813/ugu_ueeex2.webp',
    category: 'Most Popular',
    type: 'vegetable',
    quantity: 1,
    desc: 'Fresh and organic ugu leaves, perfect for soups and stews.',
  },
  {
    id: '8',
    name: 'Yam Tuber',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/yam_omvvl4.webp',
    category: 'Most Popular',
    type: 'tuber',
    quantity: 1,
    desc: 'Fresh and organic yam tubers, perfect for boiling, frying, or baking.',
  },
  {
    id: '38',
    name: 'Yam Tuber',
    price: 5.99,
    image:
      'https://res.cloudinary.com/di07k6tjo/image/upload/v1761055812/yam_omvvl4.webp',
    category: 'Most Popular',
    type: 'tuber',
    quantity: 1,
    desc: 'Fresh and organic yam tubers, perfect for boiling, frying, or baking.',
  },
];
