import { useState } from 'react';
import { Product } from '@/types/product';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Code, Upload, AlertTriangle, CheckCircle } from 'lucide-react';

interface CodeImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (products: Product[]) => void;
}

export const CodeImportModal = ({ open, onClose, onImport }: CodeImportModalProps) => {
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Clean the input - remove export statement and variable declaration
      let cleanedCode = codeInput.trim();
      
      // Remove export statement if present
      cleanedCode = cleanedCode.replace(/export\s+const\s+HARDCODED_PRODUCTS\s*:\s*Product\[\]\s*=\s*/, '');
      
      // Remove any trailing semicolon
      cleanedCode = cleanedCode.replace(/;?\s*$/, '');
      
      // Try to parse the JSON array
      const products = JSON.parse(cleanedCode);
      
      // Validate that it's an array
      if (!Array.isArray(products)) {
        throw new Error('Input must be an array of products');
      }
      
      // Validate each product has required fields
      for (const product of products) {
        if (!product.id || !product.name || !product.description || !product.usageInstructions || !product.externalLink) {
          throw new Error('Each product must have id, name, description, usageInstructions, and externalLink');
        }
      }
      
      // Check if we exceed the limit
      if (products.length > 150) {
        throw new Error('Cannot import more than 150 products');
      }
      
      setSuccess(`Successfully parsed ${products.length} products`);
      
      // Import the products after a short delay to show success message
      setTimeout(() => {
        onImport(products);
        setCodeInput('');
        setSuccess('');
        onClose();
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCodeInput('');
    setError('');
    setSuccess('');
    onClose();
  };

  const exampleCode = `[
  {
    "id": "product-1",
    "name": "Example Product",
    "description": "This is an example product",
    "usageInstructions": "How to use this product",
    "externalLink": "https://example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]`;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-card border-[#00d9b8]/30 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-[#00d9b8]" />
            Import Products from Code
          </DialogTitle>
          <DialogDescription className="text-[#b8c5d6]">
            Paste your hardcoded products array here to import multiple products at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Instructions */}
          <Alert className="bg-[#00d9b8]/10 border-[#00d9b8]/30">
            <AlertTriangle className="h-4 w-4 text-[#00d9b8]" />
            <AlertDescription className="text-[#b8c5d6]">
              <strong className="text-white">Instructions:</strong>
              <br />
              1. Copy the products array from your hardcodedProducts.ts file
              <br />
              2. Paste it in the text area below (with or without the export statement)
              <br />
              3. Click Import to add all products to your catalog
            </AlertDescription>
          </Alert>

          {/* Code Input */}
          <div>
            <label className="text-white font-heading text-sm mb-2 block">
              Products Array Code
            </label>
            <Textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder={`Paste your products array here, for example:\n\n${exampleCode}`}
              rows={12}
              className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 resize-none font-mono text-sm"
            />
          </div>

          {/* Error Message */}
          {error && (
            <Alert className="bg-[#ff6b6b]/10 border-[#ff6b6b]/30">
              <AlertTriangle className="h-4 w-4 text-[#ff6b6b]" />
              <AlertDescription className="text-[#ff6b6b]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {success && (
            <Alert className="bg-[#00d9b8]/10 border-[#00d9b8]/30">
              <CheckCircle className="h-4 w-4 text-[#00d9b8]" />
              <AlertDescription className="text-[#00d9b8]">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1 text-[#b8c5d6] hover:text-white hover:bg-white/5"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!codeInput.trim() || isLoading}
              className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50 transition-all"
            >
              {isLoading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Products
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};