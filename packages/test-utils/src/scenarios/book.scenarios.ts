// Test scenarios for common book operations
export const BookScenarios = {
  // Common test data scenarios
  CLEAN_CODE_BOOK: {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publishedYear: 2008,
    description: 'A handbook of agile software craftsmanship.',
  },

  SEED_RESPONSE: {
    message: 'Successfully seeded 10 books',
    count: 10,
  },

  PAGINATION_DEFAULT: {
    page: 1,
    limit: 10,
    total: 1,
  },

  // Common error messages
  ERRORS: {
    BOOK_NOT_FOUND: (id: string) => `Book with ID ${id} not found`,
    INVALID_DATA: 'Invalid data',
    DATABASE_ERROR: 'Database error',
    SEEDING_FAILED: 'Seeding failed',
    VALIDATION_ERROR: 'Validation error',
  },

  // Common test IDs
  IDS: {
    BOOK_ID: '507f1f77bcf86cd799439011',
    BOOK_ID_2: '507f1f77bcf86cd799439012',
  },
}; 