import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CategoryScroll from '@/components/CategoryScroll';
import ProductCard from '@/components/ProductCard';
import { Product } from '@shared/schema';

const Home = () => {
  // Fetch popular products
  const { data: popularProducts, isLoading: loadingPopular } = useQuery<Product[]>({
    queryKey: ['/api/products/popular'],
  });

  // Fetch new arrivals
  const { data: newProducts, isLoading: loadingNew } = useQuery<Product[]>({
    queryKey: ['/api/products/new'],
  });

  return (
    <div className="pb-16">
      <Header />
      
      <main>
        {/* Hero Banner */}
        <section className="relative">
          <div className="relative overflow-hidden rounded-b-xl w-full h-40 md:h-64">
            <img 
              src="https://images.unsplash.com/photo-1604719312566-8912e9c8a213?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Fresh groceries delivered fast" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10 flex items-center">
              <div className="px-6 py-4 text-white">
                <h1 className="text-2xl md:text-3xl font-bold font-sans">Groceries in <span className="text-primary">Minutes</span></h1>
                <p className="text-sm md:text-base mt-2 max-w-md">Fast delivery from our store to your door. Use code WELCOME20 for 20% off!</p>
                <button className="mt-3 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Delivery Time */}
        <section className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="text-primary mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm font-medium">Delivery in <span className="text-primary font-semibold">10-15 mins</span></span>
            </div>
            <div>
              <button className="text-accent text-sm font-medium">
                Change Time
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <CategoryScroll />

        {/* Deals */}
        <section className="py-4">
          <div className="px-4 mb-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold font-sans">Today's Deals</h2>
            <Link href="/deals">
              <div className="text-sm text-accent cursor-pointer">View All</div>
            </Link>
          </div>
          <div className="horizontal-scroll flex overflow-x-auto px-4 gap-3 pb-2">
            <div className="flex-shrink-0 w-40">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Fresh Orange Juice Deal" 
                  className="w-40 h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <span className="text-white text-xs font-medium">Up to 30% OFF</span>
                </div>
              </div>
              <div className="text-sm font-medium">Fresh Juices</div>
            </div>
            <div className="flex-shrink-0 w-40">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Snacks Deal" 
                  className="w-40 h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <span className="text-white text-xs font-medium">Buy 1 Get 1 Free</span>
                </div>
              </div>
              <div className="text-sm font-medium">Snacks & Chips</div>
            </div>
            <div className="flex-shrink-0 w-40">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Fresh Fruits Deal" 
                  className="w-40 h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <span className="text-white text-xs font-medium">20% OFF</span>
                </div>
              </div>
              <div className="text-sm font-medium">Fresh Fruits</div>
            </div>
            <div className="flex-shrink-0 w-40">
              <div className="relative rounded-lg overflow-hidden mb-2">
                <img 
                  src="https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Dairy Products Deal" 
                  className="w-40 h-40 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <span className="text-white text-xs font-medium">15% OFF</span>
                </div>
              </div>
              <div className="text-sm font-medium">Dairy Products</div>
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section className="py-4">
          <div className="px-4 mb-3">
            <h2 className="text-lg font-semibold font-sans">Popular Items</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
            {loadingPopular ? 
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
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
              )) : 
              
              // Product cards
              popularProducts && popularProducts.length > 0 
                ? popularProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : <div className="col-span-2 md:col-span-4 text-center py-8 text-gray-500">No popular products found</div>}
          </div>
        </section>

        {/* Recently Added */}
        <section className="py-4">
          <div className="px-4 mb-3 flex justify-between items-center">
            <h2 className="text-lg font-semibold font-sans">Recently Added</h2>
            <Link href="/new-arrivals">
              <div className="text-sm text-accent cursor-pointer">View All</div>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
            {loadingNew ? 
              // Loading skeleton
              Array(4).fill(0).map((_, index) => (
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
              )) : 
              
              // Product cards
              newProducts && newProducts.length > 0 
                ? newProducts.map((product: Product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                : <div className="col-span-2 md:col-span-4 text-center py-8 text-gray-500">No new products found</div>}
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Home;
