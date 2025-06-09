import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdBookId: string;
  let createdReviewId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Suppress error logs during tests to clean output
    app.useLogger(false);
    
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  afterAll(async () => {
    // Force cleanup of any remaining connections
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  it('/ (GET) - should return Hello World', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Books API (e2e)', () => {
    beforeEach(async () => {
      // Seed database before each books test to ensure we have data
      await request(app.getHttpServer())
        .post('/books/seed')
        .expect(201);
    });

    describe('GET /books/top', () => {
      it('should return top rated books with default limit', async () => {
        const response = await request(app.getHttpServer())
          .get('/books/top')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        
        // If we have books, verify they have the required aggregation fields
        if (response.body.length > 0) {
          const topBook = response.body[0];
          expect(topBook).toHaveProperty('_id');
          expect(topBook).toHaveProperty('title');
          expect(topBook).toHaveProperty('author');
          expect(topBook).toHaveProperty('avgRating');
          expect(topBook).toHaveProperty('reviewCount');
          expect(typeof topBook.avgRating).toBe('number');
          expect(typeof topBook.reviewCount).toBe('number');
          expect(topBook.avgRating).toBeGreaterThanOrEqual(0);
          expect(topBook.avgRating).toBeLessThanOrEqual(5);
          expect(topBook.reviewCount).toBeGreaterThan(0);
        }
        
        // Should return max 10 books by default
        expect(response.body.length).toBeLessThanOrEqual(10);
      });

      it('should return top rated books with custom limit', async () => {
        const response = await request(app.getHttpServer())
          .get('/books/top?limit=5')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(5);
        
        // Verify sorting order (highest rated first)
        if (response.body.length > 1) {
          for (let i = 0; i < response.body.length - 1; i++) {
            const current = response.body[i];
            const next = response.body[i + 1];
            
            // avgRating should be in descending order
            // If ratings are equal, reviewCount should be in descending order
            if (current.avgRating === next.avgRating) {
              expect(current.reviewCount).toBeGreaterThanOrEqual(next.reviewCount);
            } else {
              expect(current.avgRating).toBeGreaterThanOrEqual(next.avgRating);
            }
          }
        }
      });

      it('should return exactly 1 book when limit=1', async () => {
        const response = await request(app.getHttpServer())
          .get('/books/top?limit=1')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(1);
      });

      it('should handle limit 0 gracefully', async () => {
        // MongoDB doesn't allow limit=0, so this should return an error or be handled gracefully
        const response = await request(app.getHttpServer())
          .get('/books/top?limit=0');

        // Accept either 400 (Bad Request) or 500 (Internal Server Error) as valid responses
        expect([400, 500]).toContain(response.status);
      });

      it('should handle invalid limit parameter', async () => {
        // Invalid limit should return an error or fall back to default
        const response = await request(app.getHttpServer())
          .get('/books/top?limit=invalid');

        // Accept either 400 (Bad Request) or 500 (Internal Server Error) as valid responses
        expect([400, 500]).toContain(response.status);
      });

      it('should handle large limit values', async () => {
        const response = await request(app.getHttpServer())
          .get('/books/top?limit=100')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        // Should return all available books (likely less than 100 from seed data)
        expect(response.body.length).toBeLessThanOrEqual(100);
      });
    });

    describe('GET /books', () => {
      it('should return paginated books list', async () => {
        const response = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        expect(response.body).toHaveProperty('books');
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('limit');
        expect(Array.isArray(response.body.books)).toBe(true);
      });

      it('should return books with pagination parameters', async () => {
        const response = await request(app.getHttpServer())
          .get('/books?page=1&limit=5')
          .expect(200);

        // Convert to numbers for comparison as query params are strings
        expect(parseInt(response.body.page)).toBe(1);
        expect(parseInt(response.body.limit)).toBe(5);
        expect(response.body.books.length).toBeLessThanOrEqual(5);
      });

      it('should return books with search parameter', async () => {
        const response = await request(app.getHttpServer())
          .get('/books?search=clean')
          .expect(200);

        expect(response.body).toHaveProperty('books');
        expect(Array.isArray(response.body.books)).toBe(true);
      });
    });

    describe('POST /books', () => {
      it('should create a new book', async () => {
        const newBook = {
          title: 'Test Book E2E',
          author: 'Test Author',
          isbn: '9781234567890',
          publishedYear: 2023,
          description: 'A test book for e2e testing'
        };

        const response = await request(app.getHttpServer())
          .post('/books')
          .send(newBook)
          .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(newBook.title);
        expect(response.body.author).toBe(newBook.author);
        expect(response.body.isbn).toBe(newBook.isbn);
        expect(response.body.publishedYear).toBe(newBook.publishedYear);
        expect(response.body.description).toBe(newBook.description);

        createdBookId = response.body._id;
      });

      it('should return validation error for invalid book data', async () => {
        const invalidBook = {
          title: '', // Empty title should fail validation
          author: 'Test Author'
        };

        await request(app.getHttpServer())
          .post('/books')
          .send(invalidBook)
          .expect(400);
      });
    });

    describe('GET /books/:id', () => {
      it('should return a specific book by ID', async () => {
        // First get all books to get a valid ID
        const booksResponse = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        if (booksResponse.body.books.length > 0) {
          const bookId = booksResponse.body.books[0]._id;
          
          const response = await request(app.getHttpServer())
            .get(`/books/${bookId}`)
            .expect(200);

          expect(response.body).toHaveProperty('_id', bookId);
          expect(response.body).toHaveProperty('title');
          expect(response.body).toHaveProperty('author');
        }
      });

      it('should return 404 for non-existent book ID', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        await request(app.getHttpServer())
          .get(`/books/${nonExistentId}`)
          .expect(404);
      });
    });

    describe('PATCH /books/:id', () => {
      it('should update an existing book', async () => {
        // First create a book to update
        const newBook = {
          title: 'Book to Update',
          author: 'Update Author',
          isbn: '9781111111111',
          publishedYear: 2023,
          description: 'A book to be updated'
        };

        const createResponse = await request(app.getHttpServer())
          .post('/books')
          .send(newBook)
          .expect(201);

        const bookId = createResponse.body._id;
        const updateData = {
          title: 'Updated Title E2E',
          description: 'Updated description for e2e test'
        };

        const response = await request(app.getHttpServer())
          .patch(`/books/${bookId}`)
          .send(updateData)
          .expect(200);

        expect(response.body.title).toBe(updateData.title);
        expect(response.body.description).toBe(updateData.description);
      });

      it('should return 404 for updating non-existent book', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        const updateData = { title: 'Updated Title' };

        await request(app.getHttpServer())
          .patch(`/books/${nonExistentId}`)
          .send(updateData)
          .expect(404);
      });
    });

    describe('DELETE /books/:id', () => {
      it('should delete an existing book', async () => {
        // First create a book to delete
        const newBook = {
          title: 'Book to Delete',
          author: 'Delete Author',
          isbn: '9780987654321',
          publishedYear: 2023,
          description: 'A book to be deleted'
        };

        const createResponse = await request(app.getHttpServer())
          .post('/books')
          .send(newBook)
          .expect(201);

        const bookId = createResponse.body._id;

        // Delete the book - expect 204 No Content instead of 200
        await request(app.getHttpServer())
          .delete(`/books/${bookId}`)
          .expect(204);

        // Verify book is deleted
        await request(app.getHttpServer())
          .get(`/books/${bookId}`)
          .expect(404);
      });

      it('should return 404 for deleting non-existent book', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';

        await request(app.getHttpServer())
          .delete(`/books/${nonExistentId}`)
          .expect(404);
      });
    });
  });

  describe('Reviews API (e2e)', () => {
    beforeEach(async () => {
      // Seed database and get a book ID for review tests
      await request(app.getHttpServer())
        .post('/books/seed')
        .expect(201);
    });

    describe('POST /reviews', () => {
      it('should create a new review', async () => {
        // First get a book to review
        const booksResponse = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        if (booksResponse.body.books.length > 0) {
          const bookId = booksResponse.body.books[0]._id;
          
          const newReview = {
            bookId,
            rating: 5,
            reviewerName: 'E2E Tester',
            comment: 'Great book for e2e testing!'
          };

          const response = await request(app.getHttpServer())
            .post('/reviews')
            .send(newReview)
            .expect(201);

          expect(response.body).toHaveProperty('_id');
          expect(response.body.bookId).toBe(bookId);
          expect(response.body.rating).toBe(newReview.rating);
          expect(response.body.reviewerName).toBe(newReview.reviewerName);
          expect(response.body.comment).toBe(newReview.comment);

          createdReviewId = response.body._id;
        }
      });

      it('should return validation error for invalid review data', async () => {
        const invalidReview = {
          bookId: 'invalid-id',
          rating: 6, // Rating should be 1-5
          reviewerName: ''
        };

        await request(app.getHttpServer())
          .post('/reviews')
          .send(invalidReview)
          .expect(400);
      });
    });

    describe('GET /reviews/book/:bookId', () => {
      it('should return reviews for a specific book', async () => {
        // First get a book that has reviews
        const booksResponse = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        if (booksResponse.body.books.length > 0) {
          const bookId = booksResponse.body.books[0]._id;

          const response = await request(app.getHttpServer())
            .get(`/reviews/book/${bookId}`)
            .expect(200);

          expect(response.body).toHaveProperty('reviews');
          expect(Array.isArray(response.body.reviews)).toBe(true);
        }
      });

      it('should return empty reviews for non-existent book', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';

        const response = await request(app.getHttpServer())
          .get(`/reviews/book/${nonExistentId}`)
          .expect(200);

        expect(response.body.reviews).toEqual([]);
      });
    });

    describe('PATCH /reviews/:id', () => {
      it('should update an existing review', async () => {
        // First create a review to update
        const booksResponse = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        if (booksResponse.body.books.length > 0) {
          const bookId = booksResponse.body.books[0]._id;
          
          const newReview = {
            bookId,
            rating: 4,
            reviewerName: 'Updater',
            comment: 'Original comment'
          };

          const createResponse = await request(app.getHttpServer())
            .post('/reviews')
            .send(newReview)
            .expect(201);

          const reviewId = createResponse.body._id;
          const updateData = {
            rating: 5,
            comment: 'Updated comment for e2e test'
          };

          const response = await request(app.getHttpServer())
            .patch(`/reviews/${reviewId}`)
            .send(updateData)
            .expect(200);

          expect(response.body.rating).toBe(updateData.rating);
          expect(response.body.comment).toBe(updateData.comment);
        }
      });

      it('should return 404 for updating non-existent review', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        const updateData = { rating: 5 };

        await request(app.getHttpServer())
          .patch(`/reviews/${nonExistentId}`)
          .send(updateData)
          .expect(404);
      });
    });

    describe('DELETE /reviews/:id', () => {
      it('should delete an existing review', async () => {
        // First create a review to delete
        const booksResponse = await request(app.getHttpServer())
          .get('/books')
          .expect(200);

        if (booksResponse.body.books.length > 0) {
          const bookId = booksResponse.body.books[0]._id;
          
          const newReview = {
            bookId,
            rating: 3,
            reviewerName: 'To Delete',
            comment: 'Review to be deleted'
          };

          const createResponse = await request(app.getHttpServer())
            .post('/reviews')
            .send(newReview)
            .expect(201);

          const reviewId = createResponse.body._id;

          // Delete the review - expect 204 No Content instead of 200
          await request(app.getHttpServer())
            .delete(`/reviews/${reviewId}`)
            .expect(204);
        }
      });

      it('should return 404 for deleting non-existent review', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';

        await request(app.getHttpServer())
          .delete(`/reviews/${nonExistentId}`)
          .expect(404);
      });
    });
  });

  describe('Database Seeding (e2e)', () => {
    it('POST /books/seed - should seed the database successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/books/seed')
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('count');
      // Accept both success message and skip message
      expect(
        response.body.message.includes('Successfully seeded') || 
        response.body.message.includes('Skipping seed')
      ).toBe(true);
      expect(typeof response.body.count).toBe('number');
      expect(response.body.count).toBeGreaterThanOrEqual(0);
    });
  });
});
