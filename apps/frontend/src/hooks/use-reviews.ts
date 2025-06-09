import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/services/api";
import { CreateReviewDto } from "@/types/api";

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (review: CreateReviewDto) => reviewsApi.createReview(review),
    onSuccess: (newReview) => {
      // Invalidate and refetch book reviews
      queryClient.invalidateQueries({
        queryKey: ["reviews", "book", newReview.bookId],
      });
      
      // Invalidate top books to refresh ratings
      queryClient.invalidateQueries({
        queryKey: ["books", "top"],
      });
    },
  });
} 