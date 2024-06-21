export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  products: Product[];
  total: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
