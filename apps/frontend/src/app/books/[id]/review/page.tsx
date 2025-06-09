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
  const response = await fetch(`http://localhost:3001/books/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }
  return response.json();
}

async function fetchBookReviews(bookId: string): Promise<Review[]> {
  const response = await fetch(`http://localhost:3001/reviews/book/${bookId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = await response.json();
  return data.reviews || [];
}

async function createReview(reviewData: CreateReviewData): Promise<Review> {
  const response = await fetch("http://localhost:3001/reviews", {
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
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading book...</div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div style={{ padding: "20px" }}>
        <div style={{
          color: "red",
          padding: "20px",
          backgroundColor: "#ffe6e6",
          borderRadius: "6px",
          marginBottom: "20px"
        }}>
          Error loading book: {bookError?.message || "Book not found"}
        </div>
        <Link href="/books" style={{ color: "#007bff", textDecoration: "none" }}>
          ← Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "30px" }}>
        <Link 
          href="/books" 
          style={{ 
            color: "#007bff", 
            textDecoration: "none",
            fontSize: "14px",
            marginBottom: "10px",
            display: "inline-block"
          }}
        >
          ← Back to Books
        </Link>
        <h1 style={{ margin: "0 0 8px 0" }}>📝 Write a Review</h1>
        <p style={{ margin: 0, color: "#666" }}>
          Share your thoughts about this book
        </p>
      </div>

      {/* Book Information */}
      <div style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #e9ecef"
      }}>
        <h2 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>{book.title}</h2>
        <p style={{ margin: "0 0 8px 0", color: "#6c757d" }}>by {book.author}</p>
        <p style={{ margin: "0 0 8px 0", color: "#6c757d", fontSize: "14px" }}>
          Published: {book.publishedYear}
        </p>
        {book.description && (
          <p style={{ margin: "8px 0 0 0", color: "#495057", fontSize: "14px" }}>
            {book.description}
          </p>
        )}
      </div>

      {/* Review Form */}
      <div style={{
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
        marginBottom: "30px"
      }}>
        <h3 style={{ margin: "0 0 20px 0", color: "#2c3e50" }}>Add Your Review</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div style={{ marginBottom: "20px" }}>
            <Label required>Rating</Label>
            <div style={{ marginTop: "8px" }}>
              <StarRating 
                value={rating} 
                onChange={setRating}
                size="large"
              />
            </div>
          </div>

          {/* Reviewer Name */}
          <div style={{ marginBottom: "20px" }}>
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
          <div style={{ marginBottom: "30px" }}>
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
          <div style={{ display: "flex", gap: "12px" }}>
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
        <h3 style={{ margin: "0 0 20px 0", color: "#2c3e50" }}>
          📚 Existing Reviews ({reviews.length})
        </h3>
        
        {reviewsLoading ? (
          <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: "#666",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            No reviews yet. Be the first to review this book!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}
              >
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "start",
                  marginBottom: "10px"
                }}>
                  <div>
                    <div style={{ fontWeight: "500", color: "#2c3e50" }}>
                      {review.reviewerName}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6c757d" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <StarRating value={review.rating} readonly size="small" />
                </div>
                
                {review.comment && (
                  <p style={{ 
                    margin: 0, 
                    color: "#495057",
                    lineHeight: "1.5"
                  }}>
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