import { useState } from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { Link } from 'wouter';
import SearchOverlay from './SearchOverlay';

interface HeaderProps {
  location?: string;
}

const Header = ({ location = "Bangalore, 560001" }: HeaderProps) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button id="location-btn" className="flex items-center text-sm font-medium">
                <MapPin className="text-primary mr-1 h-4 w-4" />
                <span>{location}</span>
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
            
            <div>
              <Link href="/account">
                <button id="user-btn" className="p-2 relative">
                  <User className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Header;
