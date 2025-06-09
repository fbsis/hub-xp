"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StarRating, Input, Label, Button, Textarea } from "@components/ui";
import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  publishedYear: number;
  description?: string;
}

interface Review {
  _id: string;
  bookId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
  createdAt: string;
}

interface CreateReviewData {
  bookId: string;
  rating: number;
  comment?: string;
  reviewerName: string;
}

// API functions
async function fetchBook(id: string): Promise<Book> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/books/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }
  return response.json();
}

async function fetchBookReviews(bookId: string): Promise<Review[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/reviews/book/${bookId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = await response.json();
  return data.reviews || [];
}

async function createReview(reviewData: CreateReviewData): Promise<Review> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  });
  
  if (!response.ok) {
    throw new Error("Failed to create review");
  }
  
  return response.json();
}

export default function BookReviewPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookId = params.id as string;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  // Fetch book details
  const { data: book, isLoading: bookLoading, error: bookError } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBook(bookId),
  });

  // Fetch existing reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", bookId],
    queryFn: () => fetchBookReviews(bookId),
  });

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["reviews", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["top-books"] });
      
      // Reset form
      setRating(0);
      setComment("");
      setReviewerName("");
      
      alert("Review added successfully! 🎉");
    },
    onError: (error) => {
      alert(`Error adding review: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    if (!reviewerName.trim()) {
      alert("Please enter your name");
      return;
    }

    createReviewMutation.mutate({
      bookId,
      rating,
      comment: comment.trim() || undefined,
      reviewerName: reviewerName.trim(),
    });
  };

  if (bookLoading) {
    return (
      <div className="p-5 text-center">
        <div className="text-lg text-gray-600">Loading book...</div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="p-5">
        <div className="text-red-600 p-5 bg-red-50 rounded-md mb-5 border border-red-200">
          Error loading book: {bookError?.message || "Book not found"}
        </div>
        <Link href="/books" className="text-blue-600 hover:text-blue-800 no-underline">
          ← Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/books" 
          className="text-blue-600 hover:text-blue-800 no-underline text-sm mb-2 inline-block"
        >
          ← Back to Books
        </Link>
        <h1 className="text-2xl font-bold mb-2">📝 Write a Review</h1>
        <p className="text-gray-600 m-0">
          Share your thoughts about this book
        </p>
      </div>

      {/* Book Information */}
      <div className="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{book.title}</h2>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        <p className="text-gray-600 text-sm mb-2">
          Published: {book.publishedYear}
        </p>
        {book.description && (
          <p className="text-gray-700 text-sm mt-2">
            {book.description}
          </p>
        )}
      </div>

      {/* Review Form */}
      <div className="bg-white p-8 rounded-lg border border-gray-200 mb-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Add Your Review</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-5">
            <Label required>Rating</Label>
            <div className="mt-2">
              <StarRating 
                value={rating} 
                onChange={setRating}
                size="large"
              />
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="mb-5">
            <Label htmlFor="reviewerName" required>Your Name</Label>
            <Input
              id="reviewerName"
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Comment */}
          <div className="mb-8">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows={5}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? "Submitting..." : "✅ Submit Review"}
            </Button>
            
            <Link href="/books">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      {/* Existing Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-5 text-gray-800">
          📚 Existing Reviews ({reviews.length})
        </h3>
        
        {reviewsLoading ? (
          <div className="text-center p-5 text-gray-600">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-10 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
            No reviews yet. Be the first to review this book!
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-gray-800">
                      {review.reviewerName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StarRating value={review.rating} readonly size="small" />
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed m-0">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 