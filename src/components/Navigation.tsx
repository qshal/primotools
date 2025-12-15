import { Link, useLocation } from 'react-router-dom';
import { Package, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/80 backdrop-blur-xl border-b border-[#00d9b8]/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#00d9b8]/30 group-hover:shadow-[#00d9b8]/50 transition-all">
              <img 
                src="/primoboost-logo.jpg" 
                alt="PrimoBoost Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              Primo<span className="text-[#00d9b8]">Boost</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button
                variant={!isAdmin ? "default" : "ghost"}
                className={`gap-2 ${
                  !isAdmin
                    ? 'bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] shadow-lg shadow-[#00d9b8]/30'
                    : 'text-[#b8c5d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                User Portal
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={isAdmin ? "default" : "ghost"}
                className={`gap-2 ${
                  isAdmin
                    ? 'bg-[#00d9b8] hover:bg-[#00c4a6] text-[#0a1628] shadow-lg shadow-[#00d9b8]/30'
                    : 'text-[#b8c5d6] hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
