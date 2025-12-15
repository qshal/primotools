import React, { createContext, useContext, useState } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { HARDCODED_PRODUCTS, MAX_PRODUCTS } from '@/data/hardcodedProducts';

interface ProductContextType {
  products: Product[];
  addProduct: (product: ProductFormData) => boolean;
  updateProduct: (id: string, product: ProductFormData) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  importProducts: (products: Product[]) => boolean;
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
  // Initialize with hardcoded products from the code file
  const [products, setProducts] = useState<Product[]>(() => {
    // Load products from hardcoded array (max 150 products)
    return [...HARDCODED_PRODUCTS].slice(0, MAX_PRODUCTS);
  });

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
    
    // Log the new product for manual addition to hardcodedProducts.ts
    console.log('🚀 New Product Added - Copy this to hardcodedProducts.ts:');
    console.log(JSON.stringify(newProduct, null, 2));
    
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

  const importProducts = (newProducts: Product[]): boolean => {
    // Check if importing would exceed the maximum limit
    if (newProducts.length > MAX_PRODUCTS) {
      return false; // Cannot import more than max products
    }

    // Replace all products with the imported ones
    setProducts(newProducts);
    
    // Log the imported products for manual addition to hardcodedProducts.ts
    console.log('🚀 Products Imported - Copy this to hardcodedProducts.ts:');
    console.log(`export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(newProducts, null, 2)};`);
    
    return true; // Successfully imported
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        importProducts,
        maxProducts: MAX_PRODUCTS,
        canAddMore: products.length < MAX_PRODUCTS,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
