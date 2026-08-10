import { assets } from "./assets.js";

export const products = [
  {
    id: 1,
    name: "Men's T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear.",
    price: 25,
    images: [assets.product1, assets.product1_2, assets.product1_3],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["S", "M", "L", "XL"],
    date: Date.now(),
    bestseller: true,
  },

  {
    id: 2,
    name: "Women's Dress",
    description: "Elegant dress suitable for casual occasions.",
    price: 40,
    images: [assets.product2, assets.product2_2, assets.product2_3],
    category: "Women",
    subCategory: "Dress",
    sizes: ["S", "M", "L"],
    date: Date.now(),
    bestseller: false,
  },

  {
    id: 3,
    name: "Casual Shirt",
    description: "Classic casual shirt with a comfortable fit.",
    price: 30,
    images: [assets.product3, assets.product3_2, assets.product3_3],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: Date.now(),
    bestseller: true,
  },
];
