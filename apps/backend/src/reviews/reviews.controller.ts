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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from '@domain/core';
import { MongoExceptionFilter } from '../common/filters/mongo-exception.filter';

@ApiTags('reviews')
@Controller('reviews')
@UseFilters(MongoExceptionFilter)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({
    type: CreateReviewDto,
    description: 'Review data to create',
    examples: {
      example1: {
        summary: 'Book Review Example',
        value: {
          bookId: '6846130ff221d26b39d254d1',
          rating: 5,
          comment: 'Excellent book! Highly recommended.',
          reviewerName: 'John Doe'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async create(@Body(ValidationPipe) createReviewDto: CreateReviewDto) {
    try {
      return await this.reviewsService.create(createReviewDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews with filtering and pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiQuery({ name: 'bookId', required: false, description: 'Filter by book ID' })
  @ApiQuery({ name: 'rating', required: false, description: 'Filter by rating' })
  @ApiQuery({ name: 'reviewerName', required: false, description: 'Filter by reviewer name' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async findAll(@Query() query: any) {
    return await this.reviewsService.findAll(query);
  }

  @Get('book/:bookId')
  @ApiOperation({ summary: 'Get all reviews for a specific book' })
  @ApiParam({ name: 'bookId', description: 'Book ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Book reviews retrieved successfully' })
  async findByBook(@Param('bookId') bookId: string, @Query() query: any) {
    return await this.reviewsService.findByBook(bookId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async findOne(@Param('id') id: string) {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateReviewDto: UpdateReviewDto
  ) {
    try {
      const review = await this.reviewsService.update(id, updateReviewDto);
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return review;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'id', description: 'Review ID' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async remove(@Param('id') id: string) {
    const deleted = await this.reviewsService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
} 