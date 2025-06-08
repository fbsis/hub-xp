import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  Rating, 
  ISBN, 
  BookTitle, 
  Author, 
  PublishedYear, 
  Description,
  AverageRating,
  ReviewCount,
  BookId,
  Comment,
  ReviewerName
} from '@domain/core';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Returns welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ 
    status: 200, 
    description: 'API health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        message: { type: 'string', example: 'Book Reviews API is running' },
        domainTest: { type: 'object' }
      }
    }
  })
  getHealth() {
    // Test all domain value objects
    const rating = new Rating(5);
    const isbn = new ISBN('978-3-16-148410-0');
    const bookTitle = new BookTitle('Clean Architecture');
    const author = new Author('Robert C. Martin');
    const publishedYear = new PublishedYear(2017);
    const description = new Description('A comprehensive guide to software architecture.');
    const avgRating = new AverageRating(4.7);
    const reviewCount = new ReviewCount(42);
    const bookId = new BookId('507f1f77bcf86cd799439011');
    const comment = new Comment('Excellent book on software architecture!');
    const reviewerName = new ReviewerName('John Doe');
    
    return { 
      status: 'ok', 
      message: 'Book Reviews API is running',
      domainTest: {
        valueObjects: {
          rating: rating.getValue(),
          isbn: isbn.getFormatted(),
          bookTitle: bookTitle.getValue(),
          author: author.getValue(),
          publishedYear: publishedYear.getValue(),
          description: description.getValue(),
          avgRating: avgRating.getValue(),
          reviewCount: reviewCount.getValue(),
          bookId: bookId.getValue(),
          comment: comment.getValue(),
          reviewerName: reviewerName.getValue()
        },
        validations: {
          isValidRating: Rating.isValid(4),
          isValidISBN: ISBN.isValid('0-306-40615-2'),
          isValidBookTitle: BookTitle.isValid('Valid Title'),
          isValidAuthor: Author.isValid('Valid Author'),
          isValidPublishedYear: PublishedYear.isValid(2023),
          isValidBookId: BookId.isValid('507f1f77bcf86cd799439011')
        }
      }
    };
  }
}
