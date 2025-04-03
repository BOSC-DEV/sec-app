
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { UseInfiniteQueryResult } from '@tanstack/react-query';
import FallbackUI from './FallbackUI';

interface InfinitePaginationProps<T> {
  query: UseInfiniteQueryResult<{ data: T[]; nextCursor?: string | number | null }, unknown>;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  className?: string;
  itemClassName?: string;
  loadMoreThreshold?: number;
  loadMoreButtonLabel?: string;
  showManualLoadMore?: boolean;
}

function InfinitePagination<T>({
  query,
  renderItem,
  emptyMessage = "No items found",
  errorMessage = "Failed to load items",
  loadingMessage = "Loading items...",
  className = "",
  itemClassName = "w-full",
  loadMoreThreshold = 400,
  loadMoreButtonLabel = "Load More",
  showManualLoadMore = false,
}: InfinitePaginationProps<T>) {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = query;

  // Create a function to handle intersection for infinite scrolling
  useEffect(() => {
    if (showManualLoadMore) return;

    const handleScroll = () => {
      if (isLoading || isFetchingNextPage || !hasNextPage) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const scrollThreshold = document.body.offsetHeight - loadMoreThreshold;

      if (scrollPosition >= scrollThreshold) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isLoading, isFetchingNextPage, loadMoreThreshold, showManualLoadMore]);

  // Handle error state
  if (isError) {
    return (
      <FallbackUI
        title="Error loading data"
        message={errorMessage}
        onRetry={() => query.refetch()}
        variant="error"
      />
    );
  }

  // Handle loading state (initial load)
  if (isLoading && !data) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Extract all items from pages safely
  // Handle both infinite query format (with pages) and single query format
  let allItems: T[] = [];
  
  if (data) {
    // Check if data has a pages property (infinite query result)
    if ('pages' in data && Array.isArray(data.pages)) {
      allItems = data.pages.flatMap(page => page.data || []);
    } else if ('data' in data && Array.isArray(data.data)) {
      // Single query result with data property
      allItems = data.data;
    }
  }

  // Handle empty state
  if (allItems.length === 0) {
    return (
      <FallbackUI
        title="No data found"
        message={emptyMessage}
        variant="empty"
        showRetry={false}
      />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-4">
        {allItems.map((item, index) => (
          <div key={index} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div className="w-full flex justify-center mt-8">
          {showManualLoadMore ? (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </span>
              ) : (
                loadMoreButtonLabel
              )}
            </button>
          ) : (
            isFetchingNextPage && (
              <div className="py-4 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default InfinitePagination;
