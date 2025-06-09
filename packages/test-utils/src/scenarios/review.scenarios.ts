// Test scenarios for common review operations
export const ReviewScenarios = {
  // Common test data scenarios
  EXCELLENT_REVIEW: {
    bookId: '507f1f77bcf86cd799439011',
    rating: 5,
    comment: 'Excellent book!',
    reviewerName: 'John Doe',
  },

  PAGINATION_DEFAULT: {
    page: 1,
    limit: 10,
    total: 1,
  },

  // Common error messages
  ERRORS: {
    REVIEW_NOT_FOUND: (id: string) => `Review with ID ${id} not found`,
    BOOK_NOT_FOUND: (id: string) => `Book with ID ${id} not found`,
    DATABASE_ERROR: 'Database error',
    VALIDATION_ERROR: 'Validation error',
  },

  // Common test IDs
  IDS: {
    REVIEW_ID: '507f1f77bcf86cd799439012',
    BOOK_ID: '507f1f77bcf86cd799439011',
  },

  // Common query scenarios
  QUERIES: {
    EMPTY: {},
    WITH_RATING: { page: 1, limit: 10, rating: '5' },
    WITH_PAGINATION: { page: 1, limit: 10 },
  },
}; 