export type Product = {
  id: string;
  userId: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  createdAt: string;
};

export type FetchingProductData = {
  items: Product[];
  total: number;
};

export type ProductCreateForm = {
  name: string;
  category: string;
  price: number;
  description?: string;
};
