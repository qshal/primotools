import { useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Code, Upload, Download, Sync, AlertCircle, CheckCircle } from 'lucide-react';
import { Product } from '@/types/product';

export const CodeSyncPanel = () => {
  const { products, updateProductsFromCode } = useProducts();
  const [codeInput, setCodeInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const generateCurrentCode = () => {
    return `export const HARDCODED_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};`;
  };

  const handlePasteCode = () => {
    try {
      // Extract the products array from the pasted code
      const match = codeInput.match(/HARDCODED_PRODUCTS:\s*Product\[\]\s*=\s*(\[[\s\S]*?\]);/);
      if (!match) {
        throw new Error('Invalid code format. Please paste the complete HARDCODED_PRODUCTS array.');
      }

      const productsArrayString = match[1];
      const parsedProducts: Product[] = JSON.parse(productsArrayString);

      // Validate the products
      if (!Array.isArray(parsedProducts)) {
        throw new Error('Products must be an array.');
      }

      // Validate each product has required fields
      for (const product of parsedProducts) {
        if (!product.id || !product.name || !product.description) {
          throw new Error('Each product must have id, name, and description.');
        }
      }

      // Update the products
      updateProductsFromCode(parsedProducts);
      
      setStatus('success');
      setMessage(`Successfully updated ${parsedProducts.length} products!`);
      setCodeInput('');
      
      // Auto-close after success
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
        setMessage('');
      }, 2000);

    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to parse code');
    }
  };

  const copyCurrentCode = () => {
    const code = generateCurrentCode();
    navigator.clipboard.writeText(code);
    setStatus('success');
    setMessage('Code copied to clipboard!');
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-[#00d9b8] border-[#00d9b8]/30 hover:bg-[#00d9b8]/10"
        >
          <Code className="w-4 h-4" />
          Code Sync
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-card border-[#00d9b8]/30 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Sync className="w-6 h-6 text-[#00d9b8]" />
            Code Sync Panel
          </DialogTitle>
          <DialogDescription className="text-[#b8c5d6]">
            Sync your products with the hardcoded array. Copy the current products or paste updated code.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Message */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              status === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Current Products Info */}
          <Card className="glass-card border-[#00d9b8]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-[#00d9b8]" />
                Current Products ({products.length}/150)
              </CardTitle>
              <CardDescription className="text-[#b8c5d6]">
                Copy the current products array to paste into your hardcodedProducts.ts file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  value={generateCurrentCode()}
                  readOnly
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white font-mono text-xs h-32 resize-none"
                />
                <Button
                  onClick={copyCurrentCode}
                  className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Copy Current Products Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Paste New Code */}
          <Card className="glass-card border-[#00d9b8]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#00d9b8]" />
                Update Products from Code
              </CardTitle>
              <CardDescription className="text-[#b8c5d6]">
                Paste the updated HARDCODED_PRODUCTS array here to sync your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Paste your HARDCODED_PRODUCTS code here...

Example:
export const HARDCODED_PRODUCTS: Product[] = [
  {
    id: 'product-1',
    name: 'My Product',
    description: 'Product description',
    usageInstructions: 'How to use',
    externalLink: 'https://example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];"
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white font-mono text-xs h-48 resize-none"
                />
                <Button
                  onClick={handlePasteCode}
                  disabled={!codeInput.trim()}
                  className="bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] w-full disabled:opacity-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Update Products from Code
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="glass-card border-[#00d9b8]/20">
            <CardHeader>
              <CardTitle className="text-white text-lg">How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-[#b8c5d6] text-sm space-y-2">
                <p><strong className="text-[#00d9b8]">Method 1 - Copy Current:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Click "Copy Current Products Code"</li>
                  <li>Paste into your hardcodedProducts.ts file</li>
                  <li>Commit and push to Git</li>
                </ol>
                
                <p className="pt-2"><strong className="text-[#00d9b8]">Method 2 - Paste Updated:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Get updated code from another device/developer</li>
                  <li>Paste the complete HARDCODED_PRODUCTS array above</li>
                  <li>Click "Update Products from Code"</li>
                  <li>Products will be instantly updated!</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};