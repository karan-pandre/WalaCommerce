import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@shared/schema';

const CategoryPage = () => {
  const [, params] = useRoute('/category/:id');
  const categoryId = params?.id ? parseInt(params.id) : 0;
  
  // Fetch category details
  const { data: category, isLoading: loadingCategory } = useQuery({
    queryKey: [`/api/categories/${categoryId}`],
    enabled: categoryId > 0,
  });

  // Fetch products by category
  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: [`/api/products?categoryId=${categoryId}`],
    enabled: categoryId > 0,
  });

  return (
    <div className="pb-16">
      <Header />
      
      <div className="sticky top-16 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <button className="mr-3">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          {loadingCategory ? (
            <Skeleton className="h-6 w-24" />
          ) : (
            <h1 className="text-lg font-semibold">{category?.name}</h1>
          )}
        </div>
        <button className="p-2">
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-4">
        {loadingProducts ? (
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
        ) : products?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="bg-neutral rounded-full p-5 mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">We couldn't find any products in this category.</p>
            <Link href="/">
              <button className="px-4 py-2 bg-primary text-white rounded-md">
                Browse Other Categories
              </button>
            </Link>
          </div>
        )}
      </div>
      
      <BottomNav />
    </div>
  );
};

export default CategoryPage;
