import { useState } from 'react';
import { MapPin, Search, User, LogOut, ShoppingBag, Store } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import SearchOverlay from './SearchOverlay';
import LocationModal from './location/LocationModal';
import AuthModal from './auth/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  location?: string;
}

const Header = ({ location = "Bangalore, 560001" }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [defaultAuthTab, setDefaultAuthTab] = useState<'login' | 'signup' | 'retailer'>('login');
  const [currentLocation, setCurrentLocation] = useState({
    address: "Bangalore",
    city: "Bangalore",
    pincode: "560001"
  });
  const { user, isAuthenticated, isRetailer, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLocationSelect = (location: { address: string; city: string; pincode: string }) => {
    setCurrentLocation(location);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="font-bold text-xl text-primary mr-2">Wala</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3 ml-4">
              <button 
                id="location-btn" 
                className="flex items-center text-sm font-medium"
                onClick={() => setShowLocationModal(true)}
              >
                <MapPin className="text-primary mr-1 h-4 w-4" />
                <span>{currentLocation.address}, {currentLocation.pincode}</span>
                <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search for items..." 
                  className="w-full py-2 pl-10 pr-4 rounded-full bg-neutral border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                  onFocus={() => setShowSearch(true)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/orders">
                <div className="p-2 relative cursor-pointer">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </Link>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => navigate('/account')}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => navigate('/orders')}
                      className="cursor-pointer"
                    >
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => navigate('/retailer')}
                      className="cursor-pointer"
                    >
                      <Store className="mr-2 h-4 w-4" />
                      <span>Business Portal</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowAuthModal(true);
                      // Set the default tab to retailer login
                      setDefaultAuthTab('retailer');
                    }}
                    className="flex items-center gap-1 bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                  >
                    <Store className="h-4 w-4 mr-1" />
                    Business Login
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setShowAuthModal(true);
                      // Set the default tab to regular login
                      setDefaultAuthTab('login');
                    }}
                    className="flex items-center gap-1"
                  >
                    <User className="h-4 w-4 mr-1" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <LocationModal 
        isOpen={showLocationModal} 
        onClose={() => setShowLocationModal(false)} 
        onSelectLocation={handleLocationSelect}
        currentLocation={currentLocation}
      />
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab={defaultAuthTab}
      />
    </>
  );
};

export default Header;
