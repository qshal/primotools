import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Code, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';

export const CodeImporter = () => {
  const [importCode, setImportCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { products } = useProducts();
  const { toast } = useToast();

  const handleImportProducts = async () => {
    if (!importCode.trim()) {
      toast({
        title: 'No code provided',
        description: 'Please paste the products code to import.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Extract the products array from the pasted code
      const arrayMatch = importCode.match(/\[[\s\S]*\]/);
      if (!arrayMatch) {
        throw new Error('Could not find products array in the code');
      }

      const productsArray = JSON.parse(arrayMatch[0]) as Product[];
      
      if (!Array.isArray(productsArray)) {
        throw new Error('Invalid products array format');
      }

      // Validate that each item has required Product properties
      const isValidProducts = productsArray.every(product => 
        product.id && 
        product.name && 
        product.description && 
        product.usageInstructions && 
        product.externalLink
      );

      if (!isValidProducts) {
        throw new Error('Some products are missing required fields');
      }

      // Create a downloadable file with the updated hardcodedProducts.ts
      const updatedCode = `import { Product } from '@/types/product';

// Hardcoded product storage - can hold up to 150 products
// This array is stored directly in the code and will be available on all devices
export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(productsArray, null, 2)};

// Maximum number of products that can be stored
export const MAX_PRODUCTS = 150;`;

      // Download the updated file
      const blob = new Blob([updatedCode], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hardcodedProducts.ts';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Code processed successfully!',
        description: `Found ${productsArray.length} products. Updated hardcodedProducts.ts file downloaded. Replace the file in your project and redeploy.`,
      });

      setImportCode('');
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Invalid code format',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateCurrentCode = () => {
    const currentCode = `export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
    setImportCode(currentCode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="glass-card border-[#00d9b8]/30">
        <CardHeader>
          <CardTitle className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-[#00d9b8]" />
            Code Manager
          </CardTitle>
          <CardDescription className="text-[#b8c5d6]">
            Import products from code or export current products to update the hardcoded file.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-3 bg-[#0a1628]/50 rounded-lg border border-[#00d9b8]/20">
            <div>
              <p className="text-white text-sm font-medium">Current Products</p>
              <p className="text-[#b8c5d6] text-xs">Products in memory: {products.length}/150</p>
            </div>
            <Button
              onClick={generateCurrentCode}
              variant="outline"
              size="sm"
              className="text-[#00d9b8] border-[#00d9b8]/30 hover:bg-[#00d9b8]/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Export Current
            </Button>
          </div>

          {/* Code Input */}
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">
              Paste Products Code
            </label>
            <Textarea
              value={importCode}
              onChange={(e) => setImportCode(e.target.value)}
              placeholder="Paste the products array code here...
Example:
export const HARDCODED_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'Product Name',
    description: 'Product description',
    usageInstructions: 'How to use',
    externalLink: 'https://example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];"
              className="min-h-[200px] bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 font-mono text-xs"
            />
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-200 text-xs font-medium">Important</p>
              <p className="text-amber-300/80 text-xs">
                This will generate an updated hardcodedProducts.ts file. You need to replace the file in your project and redeploy to make changes permanent across all devices.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleImportProducts}
              disabled={isLoading || !importCode.trim()}
              className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30"
            >
              {isLoading ? 'Processing...' : 'Generate Updated File'}
            </Button>
            <Button
              onClick={() => setImportCode('')}
              variant="outline"
              className="text-[#b8c5d6] border-white/20 hover:bg-white/5"
            >
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};