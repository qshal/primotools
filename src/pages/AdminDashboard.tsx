import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { AdminProductCard } from '@/components/AdminProductCard';
import { ProductFormModal } from '@/components/ProductFormModal';
import { EmptyState } from '@/components/EmptyState';
import { AdminLogin } from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct, maxProducts, canAddMore } = useProducts();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingProductId(id);
  };

  const confirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully removed.',
      });
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast({
        title: 'Product updated',
        description: 'The product has been successfully updated.',
      });
    } else {
      const success = addProduct(data);
      if (success) {
        toast({
          title: 'Product added',
          description: 'The product has been successfully added to the catalog.',
        });
      } else {
        toast({
          title: 'Cannot add product',
          description: `Maximum limit of ${maxProducts} products reached.`,
          variant: 'destructive',
        });
        return; // Don't close the form if adding failed
      }
    }
    setEditingProduct(undefined);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-[#1affce]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00d9b8] to-[#1affce] flex items-center justify-center shadow-lg shadow-[#00d9b8]/30">
              <Package className="w-6 h-6 text-[#0a1628]" />
            </div>
            <h1 className="text-5xl font-display font-extrabold text-white text-glow">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[#b8c5d6] text-lg max-w-2xl">
            Manage your product catalog. Add new products, edit existing ones, or remove outdated items.
          </p>
          <p className="text-[#6b7a8f] text-sm mt-2">
            Products: {products.length}/{maxProducts} {!canAddMore && '(Maximum reached)'}
          </p>
        </motion.div>

        {/* Add Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Button
            onClick={() => setIsFormOpen(true)}
            disabled={!canAddMore}
            className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50 transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            {canAddMore ? 'Add New Product' : `Maximum ${maxProducts} Products`}
          </Button>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Yet"
            description="Get started by adding your first product to the catalog. Click the button above to begin."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <AdminProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingProductId} onOpenChange={() => setDeletingProductId(null)}>
        <AlertDialogContent className="glass-card border-[#00d9b8]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-bold text-white">
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#b8c5d6]">
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-[#b8c5d6] hover:text-white hover:bg-white/5 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white shadow-lg shadow-[#ff6b6b]/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Floating Action Button (Mobile) */}
      {canAddMore && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#00d9b8] to-[#1affce] shadow-2xl shadow-[#00d9b8]/40 flex items-center justify-center lg:hidden hover:scale-110 transition-transform z-50"
        >
          <Plus className="w-8 h-8 text-[#0a1628]" />
        </motion.button>
      )}
    </div>
  );
};
