export interface ProductType {
  id: number;
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
}

export const products: ProductType[] = [
  {
    id: 1,
    name: "Mix Meat",
    price: 2.99,
    image: "/assets/mix-meat.webp",
    category: "Recently Added",
    type: "meat",
    quantity: 1,
    desc: "A delicious mix of various meats, perfect for stews and grills.",
  },
  {
    id: 2,
    name: "Turkey",
    price: 5.99,
    image: "/assets/turkey.webp",
    category: "Recently Added",
    type: "meat",
    quantity: 1,
    desc: "Fresh turkey meat, ideal for roasting or making hearty soups.",
  },
  {
    id: 3,
    name: "Fresh Ugu Branch",
    price: 1.99,
    image: "/assets/ugu.webp",
    category: "Recently Added",
    type: "vegetable",
    quantity: 1,
    desc: "Fresh and organic ugu leaves, perfect for soups and stews.",
  },
  {
    id: 4,
    name: "Yam Tuber",
    price: 5.99,
    image: "/assets/yam.webp",
    category: "Recently Added",
    type: "tuber",
    quantity: 1,
    desc: "Fresh and organic yam tubers, perfect for boiling, frying, or baking.",
  },
  {
    id: 24,
    name: "Yam Tuber",
    price: 5.99,
    image: "/assets/yam.webp",
    category: "Recently Added",
    type: "tuber",
    quantity: 1,
    desc: "Fresh and organic yam tubers, perfect for boiling, frying, or baking.",
  },
  {
    id: 5,
    name: "Mix Meat",
    price: 2.99,
    image: "/assets/mix-meat.webp",
    category: "Most Popular",
    type: "meat",
    quantity: 1,
    desc: "A delicious mix of various meats, perfect for stews and grills.",
  },
  {
    id: 6,
    name: "Turkey",
    price: 5.99,
    image: "/assets/turkey.webp",
    category: "Most Popular",
    type: "meat",
    quantity: 1,
    desc: "Fresh turkey meat, ideal for roasting or making hearty soups.",
  },
  {
    id: 7,
    name: "Fresh Ugu Branch",
    price: 1.99,
    image: "/assets/ugu.webp",
    category: "Most Popular",
    type: "vegetable",
    quantity: 1,
    desc: "Fresh and organic ugu leaves, perfect for soups and stews.",
  },
  {
    id: 8,
    name: "Yam Tuber",
    price: 5.99,
    image: "/assets/yam.webp",
    category: "Most Popular",
    type: "tuber",
    quantity: 1,
    desc: "Fresh and organic yam tubers, perfect for boiling, frying, or baking.",
  },
  {
    id: 38,
    name: "Yam Tuber",
    price: 5.99,
    image: "/assets/yam.webp",
    category: "Most Popular",
    type: "tuber",
    quantity: 1,
    desc: "Fresh and organic yam tubers, perfect for boiling, frying, or baking.",
  },
];
