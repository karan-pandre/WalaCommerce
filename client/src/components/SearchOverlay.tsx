import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, History } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [, navigate] = useLocation();
  
  // Get recent searches from localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches));
    }
  }, []);

  // Popular searches
  const popularSearches = [
    'Milk', 'Vegetables', 'Fruits', 'Snacks', 'Beverages'
  ];

  // Search results query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: [`/api/products?search=${searchQuery}`],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      
      const response = await apiRequest('GET', `/api/products?search=${encodeURIComponent(searchQuery)}`);
      return response.json();
    },
    enabled: searchQuery.length >= 2
  });

  // Handle search submission
  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updatedSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
      
      // Navigate to search results
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  // Handle search item click
  const handleSearchItemClick = (query: string) => {
    setSearchQuery(query);
    // Add to recent searches
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Navigate to search results
    navigate(`/search?q=${encodeURIComponent(query)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-white z-50 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'} transition-transform duration-300`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center mb-4">
          <button className="mr-3" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search for items..." 
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full py-2 pl-10 pr-4 rounded-full bg-neutral border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        {searchQuery.length >= 2 && searchResults && searchResults.length > 0 ? (
          <div className="py-2">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((product: any) => (
                <div 
                  key={product.id} 
                  className="flex items-center py-2 border-b border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.unitValue} {product.unitType}</div>
                  </div>
                  <div className="text-sm font-bold">₹{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {recentSearches.length > 0 && (
              <div className="py-2">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Searches</h3>
                {recentSearches.map((search, index) => (
                  <div 
                    key={index} 
                    className="flex items-center py-2 border-b border-gray-100 cursor-pointer"
                    onClick={() => handleSearchItemClick(search)}
                  >
                    <History className="text-gray-400 mr-3 h-4 w-4" />
                    <span>{search}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-neutral rounded-full text-sm cursor-pointer hover:bg-neutral-dark transition-colors"
                    onClick={() => handleSearchItemClick(search)}
                  >
                    {search}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchOverlay;
