import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';
import { Category } from '@shared/schema';

const CategoryScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <section className="py-4">
      <div className="px-4 mb-3">
        <h2 className="text-lg font-semibold font-sans">Categories</h2>
      </div>
      
      <div 
        ref={scrollRef} 
        className="horizontal-scroll flex overflow-x-auto px-4 gap-4 pb-2"
      >
        {isLoading ? 
          // Loading skeleton
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-16 text-center">
              <Skeleton className="w-16 h-16 rounded-full mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          )) : 
          
          // Categories list
          categories?.map((category: Category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <div className="flex-shrink-0 w-16 text-center cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-neutral p-3 mb-1 flex items-center justify-center hover:bg-neutral-dark transition-colors">
                  <img src={category.image} alt={category.name} className="w-10 h-10" />
                </div>
                <span className="text-xs">{category.name}</span>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default CategoryScroll;
