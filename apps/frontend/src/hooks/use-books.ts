import { useQuery } from "@tanstack/react-query";
import { booksApi } from "@/services/api";

export function useTopBooks(limit: number = 10) {
  return useQuery({
    queryKey: ["books", "top", limit],
    queryFn: () => booksApi.getTopBooks(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => booksApi.getBook(id),
    enabled: !!id,
  });
}

export function useBookReviews(bookId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["reviews", "book", bookId, page, limit],
    queryFn: () => booksApi.getBookReviews(bookId, page, limit),
    enabled: !!bookId,
  });
} 