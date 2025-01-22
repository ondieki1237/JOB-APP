import React, { createContext, useContext, useState } from 'react';
import { Job } from '../types/job';

interface BookmarkContextType {
  bookmarkedJobs: string[];
  toggleBookmark: (jobId: string) => void;
  isBookmarked: (jobId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const isBookmarked = (jobId: string) => bookmarkedJobs.includes(jobId);

  return (
    <BookmarkContext.Provider value={{ bookmarkedJobs, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
} 