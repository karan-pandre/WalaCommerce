import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ArrowLeft, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import { Product } from '@shared/schema';

const SearchPage = () => {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Extract search query from URL
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    setSearchQuery(q);
  }, [location]);
  
  // Search products
  const { data: products, isLoading } = useQuery({
    queryKey: [`/api/products?search=${searchQuery}`],
    enabled: searchQuery.length > 0,
  });

  // Handle search input
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    if (inputValue.trim()) {
      window.history.pushState(
        {}, 
        '', 
        `/search?q=${encodeURIComponent(inputValue)}`
      );
      setSearchQuery(inputValue);
    }
  };

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-1">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            
            <form onSubmit={handleSearch} className="flex-1 relative">
              <input 
                type="text"
                name="search" 
                placeholder="Search for items..." 
                autoFocus
                defaultValue={searchQuery}
                className="w-full py-2 pl-10 pr-4 rounded-full bg-neutral border border-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
            
            <button className="p-1">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        {searchQuery && (
          <h2 className="text-lg font-semibold mb-4">
            {isLoading ? 'Searching...' : 
              products?.length > 0 
                ? `Search results for "${searchQuery}"` 
                : `No results for "${searchQuery}"`
            }
          </h2>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <Skeleton className="w-full aspect-square" />
                <div className="p-2">
                  <Skeleton className="h-3 w-12 mb-1" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-7 w-7 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery && products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-neutral rounded-full p-5 mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              We couldn't find any products matching your search.
              <br />Try different keywords or browse categories.
            </p>
            <Link href="/">
              <button className="px-4 py-2 bg-primary text-white rounded-md">
                Browse Categories
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-neutral rounded-full p-5 mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Search for products</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Type in the search box above to find products.
            </p>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default SearchPage;
