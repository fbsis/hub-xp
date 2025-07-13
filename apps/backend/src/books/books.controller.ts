import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseFilters,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto, GetBooksDto, BookMapper } from '@domain/core';
import { MongoExceptionFilter } from '../common/filters/mongo-exception.filter';

@ApiTags('books')
@Controller('books')
@UseFilters(MongoExceptionFilter)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({
    type: CreateBookDto,
    description: 'Book data to create',
    examples: {
      example1: {
        summary: 'Clean Architecture Example',
        value: {
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          isbn: '9780134494166',
          publishedYear: 2017,
          description: 'A comprehensive guide to building maintainable software architectures.'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body(ValidationPipe) createBookDto: CreateBookDto) {
    try {
      // Convert DTO to domain entity
      const bookEntity = BookMapper.fromCreateDto(createBookDto);
      return await this.booksService.create(bookEntity);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('seed')
  @ApiOperation({ summary: 'Seed the database with sample books' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 400, description: 'Seeding error' })
  async seedBooks() {
    try {
      return await this.booksService.seedDatabase();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search in title, author, description' })
  @ApiQuery({ name: 'author', required: false, description: 'Filter by author' })
  @ApiQuery({ name: 'publishedYear', required: false, description: 'Filter by published year' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating filter' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field (default: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order: asc|desc (default: desc)' })
  @ApiResponse({ status: 200, description: 'Books retrieved successfully' })
  async findAll(@Query(ValidationPipe) query: GetBooksDto) {
    return await this.booksService.findAll(query);
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top-rated books' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of books to return (default: 10)' })
  @ApiResponse({ status: 200, description: 'Top books retrieved successfully' })
  async getTopBooks(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return await this.booksService.getTopRated(parsedLimit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateBookDto: UpdateBookDto
  ) {
    try {
      // Convert DTO to domain entity (partial)
      const bookEntity = BookMapper.fromUpdateDto(updateBookDto);
      const book = await this.booksService.update(id, bookEntity);
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string) {
    const deleted = await this.booksService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
} 