import { useState, useMemo } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserPortal = () => {
  const { products } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#1affce]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-12 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00d9b8]/10 border border-[#00d9b8]/30 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00d9b8] animate-pulse" />
            <span className="text-[#00d9b8] text-sm font-medium">Discover Products</span>
          </div>
          
          <h1 className="text-6xl lg:text-7xl font-display font-extrabold text-white mb-6 text-glow">
            Explore Our
            <br />
            <span className="text-[#00d9b8]">Product Catalog</span>
          </h1>
          
          <p className="text-[#b8c5d6] text-lg max-w-2xl mx-auto mb-8">
            Browse through our curated collection of products. Search, discover, and learn more about each offering.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6b7a8f]" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 focus:glow-teal rounded-xl text-lg"
            />
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#b8c5d6] text-sm mt-3 text-center"
            >
              Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </motion.p>
          )}
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery ? 'No Products Found' : 'No Products Available'}
            description={
              searchQuery
                ? 'Try adjusting your search terms or browse all products.'
                : 'Check back later for new products.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
