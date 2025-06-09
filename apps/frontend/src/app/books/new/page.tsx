"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookForm, BookFormDto } from "@components/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Simple API client
async function createBook(data: BookFormDto): Promise<any> {
  // Convert DTO to plain object for API call
  const plainData = {
    title: data.title,
    author: data.author,
    isbn: data.isbn,
    publishedYear: data.publishedYear,
    description: data.description,
  };

  const response = await fetch("http://localhost:3001/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plainData),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create book");
  }
  
  return response.json();
}

export default function NewBookPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      router.push("/");
    },
  });

  const handleSubmit = (data: BookFormDto) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Books
          </Link>
        </div>

        <BookForm 
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
        />

        {/* Status Messages */}
        {mutation.error && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❌</span>
                <p className="text-red-700">
                  <strong>Error:</strong> {mutation.error.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {mutation.isSuccess && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <p className="text-green-700">
                  <strong>Success!</strong> Book created successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 