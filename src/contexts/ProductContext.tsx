import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';

interface ProductContextType {
  products: Product[];
  addProduct: (product: ProductFormData) => boolean;
  updateProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  maxProducts: number;
  canAddMore: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Maximum number of products that can be stored
  const MAX_PRODUCTS = 100;
  
  // Initialize array with data from localStorage (max 100 products)
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('products');
    const parsedProducts = stored ? JSON.parse(stored) : [];
    // Ensure we don't exceed the maximum limit when loading
    return parsedProducts.slice(0, MAX_PRODUCTS);
  });

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: ProductFormData): boolean => {
    // Check if we've reached the maximum limit
    if (products.length >= MAX_PRODUCTS) {
      return false; // Cannot add more products
    }

    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setProducts(prev => [...prev, newProduct]);
    return true; // Successfully added
  };

  const updateProduct = (id: string, productData: ProductFormData) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...productData, updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        maxProducts: MAX_PRODUCTS,
        canAddMore: products.length < MAX_PRODUCTS,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
