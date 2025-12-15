import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { AdminProductCard } from '@/components/AdminProductCard';
import { ProductFormModal } from '@/components/ProductFormModal';
import { EmptyState } from '@/components/EmptyState';
import { AdminLogin } from '@/components/AdminLogin';
import { DevHelper } from '@/components/DevHelper';
import { CodeImportModal } from '@/components/CodeImportModal';
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
import { Plus, Package, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct, importProducts, maxProducts, canAddMore } = useProducts();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCodeImportOpen, setIsCodeImportOpen] = useState(false);
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

  const handleCodeImport = (newProducts: Product[]) => {
    const success = importProducts(newProducts);
    if (success) {
      toast({
        title: 'Products imported successfully',
        description: `${newProducts.length} products have been imported to your catalog.`,
      });
    } else {
      toast({
        title: 'Import failed',
        description: `Cannot import more than ${maxProducts} products.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 sm:top-40 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#00d9b8]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 sm:bottom-40 left-4 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-[#1affce]/10 rounded-full blur-[60px] sm:blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-xl bg-gradient-to-br from-[#00d9b8] to-[#1affce] flex items-center justify-center shadow-lg shadow-[#00d9b8]/30">
              <Package className="w-4 sm:w-6 h-4 sm:h-6 text-[#0a1628]" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-display font-extrabold text-white text-glow">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-[#b8c5d6] text-sm sm:text-base lg:text-lg max-w-2xl">
            Manage your product catalog. Add new products, edit existing ones, or remove outdated items.
          </p>
          <p className="text-[#6b7a8f] text-xs sm:text-sm mt-2">
            Products: {products.length}/{maxProducts} {!canAddMore && '(Maximum reached)'}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => setIsFormOpen(true)}
              disabled={!canAddMore}
              className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50 transition-all gap-2 disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
              size="lg"
            >
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm sm:text-base">
                {canAddMore ? 'Add New Product' : `Maximum ${maxProducts} Products`}
              </span>
            </Button>
            
            <Button
              onClick={() => setIsCodeImportOpen(true)}
              variant="outline"
              className="border-[#00d9b8]/30 text-[#00d9b8] hover:bg-[#00d9b8]/10 hover:border-[#00d9b8]/50 transition-all gap-2 flex-1 sm:flex-none"
              size="lg"
            >
              <Code className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="text-sm sm:text-base">Import from Code</span>
            </Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Products Yet"
            description="Get started by adding your first product to the catalog. Click the button above to begin."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Code Import Modal */}
      <CodeImportModal
        open={isCodeImportOpen}
        onClose={() => setIsCodeImportOpen(false)}
        onImport={handleCodeImport}
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
          className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 w-14 sm:w-16 h-14 sm:h-16 rounded-full bg-gradient-to-br from-[#00d9b8] to-[#1affce] shadow-2xl shadow-[#00d9b8]/40 flex items-center justify-center sm:hidden hover:scale-110 transition-transform z-50"
        >
          <Plus className="w-6 sm:w-8 h-6 sm:h-8 text-[#0a1628]" />
        </motion.button>
      )}

      {/* Developer Helper - only shows in development */}
      <DevHelper />
    </div>
  );
};
