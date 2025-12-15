import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminLoginProps {
  onAuthenticated?: () => void;
}

export const AdminLogin = ({ onAuthenticated }: AdminLoginProps) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = login(passcode);
    
    if (success) {
      setIsLoading(false);
      if (onAuthenticated) {
        onAuthenticated();
      }
    } else {
      setError('Incorrect passcode. Please try again.');
      setPasscode('');
      setIsLoading(false);
      // Focus the input field for retry
      const input = document.getElementById('passcode-input') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-40 left-20 w-96 h-96 bg-[#00d9b8]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#1affce]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-6 relative z-10"
      >
        <Card className="glass-card border-[#00d9b8]/30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00d9b8] to-[#1affce] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00d9b8]/30">
              <Lock className="w-8 h-8 text-[#0a1628]" />
            </div>
            <CardTitle className="text-2xl font-display font-bold text-white text-glow">
              Admin Access
            </CardTitle>
            <CardDescription className="text-[#b8c5d6]">
              Enter the passcode to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="passcode-input"
                  type="password"
                  placeholder="Enter passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-[#0a1628]/50 border-[#00d9b8]/20 text-white placeholder:text-[#6b7a8f] focus:border-[#00d9b8] focus:ring-[#00d9b8]/30 focus:glow-teal"
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#ff6b6b] text-sm mt-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1 text-[#b8c5d6] hover:text-white hover:bg-white/5 border-white/10"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] font-semibold shadow-lg shadow-[#00d9b8]/30 hover:shadow-[#00d9b8]/50"
                  disabled={isLoading || !passcode.trim()}
                >
                  {isLoading ? 'Verifying...' : 'Access Dashboard'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};