import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { productService } from '@/services/productService';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: ProductFormData) => Promise<boolean>;
  updateProduct: (id: string, product: ProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  refreshProducts: () => Promise<void>;
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
  const MAX_PRODUCTS = 150;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from Supabase on mount
  useEffect(() => {
    refreshProducts();
  }, []);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: ProductFormData): Promise<boolean> => {
    try {
      // Check if we've reached the maximum limit
      if (products.length >= MAX_PRODUCTS) {
        return false;
      }

      setError(null);
      const newProduct = await productService.addProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
      console.error('Error adding product:', err);
      return false;
    }
  };

  const updateProduct = async (id: string, productData: ProductFormData) => {
    try {
      setError(null);
      const updatedProduct = await productService.updateProduct(id, productData);
      setProducts(prev =>
        prev.map(product => product.id === id ? updatedProduct : product)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setError(null);
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        refreshProducts,
        maxProducts: MAX_PRODUCTS,
        canAddMore: products.length < MAX_PRODUCTS,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
