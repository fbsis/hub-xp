import React, { useState } from 'react';
import { CreateBookDto } from '@domain/core';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

interface BookFormProps {
  onSubmit: (data: CreateBookDto) => void;
  isLoading?: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export function BookForm({ onSubmit, isLoading = false }: BookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publishedYear: new Date().getFullYear(),
    description: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Convert validation errors from class-validator to our format
  const formatValidationErrors = (validationErrors: ValidationError[]): ValidationErrors => {
    const formatted: ValidationErrors = {};
    
    validationErrors.forEach(error => {
      if (error.constraints) {
        // Get the first constraint message
        const firstConstraintKey = Object.keys(error.constraints)[0];
        formatted[error.property] = error.constraints[firstConstraintKey];
      }
    });
    
    return formatted;
  };

  const validateForm = async (): Promise<boolean> => {
    // Create DTO instance
    const dto = plainToClass(CreateBookDto, {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn?.trim() || undefined,
      publishedYear: formData.publishedYear,
      description: formData.description?.trim() || undefined,
    });

    // Validate using class-validator
    const validationErrors = await validate(dto);
    
    if (validationErrors.length > 0) {
      const formattedErrors = formatValidationErrors(validationErrors);
      setErrors(formattedErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }

    // Create final DTO
    const dto = plainToClass(CreateBookDto, {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn?.trim() || undefined,
      publishedYear: formData.publishedYear,
      description: formData.description?.trim() || undefined,
    });

    onSubmit(dto);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    const newValue = name === 'publishedYear' ? parseInt(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const inputClassName = (fieldName: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      errors[fieldName] 
        ? 'border-red-300 focus:ring-red-500' 
        : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className={inputClassName('title')}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
          Author *
        </label>
        <input
          type="text"
          id="author"
          name="author"
          required
          value={formData.author}
          onChange={handleChange}
          className={inputClassName('author')}
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author}</p>
        )}
      </div>

      <div>
        <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
          ISBN
        </label>
        <input
          type="text"
          id="isbn"
          name="isbn"
          placeholder="e.g., 9780134494166 or 0134494164"
          value={formData.isbn}
          onChange={handleChange}
          className={inputClassName('isbn')}
        />
        {errors.isbn && (
          <p className="mt-1 text-sm text-red-600">{errors.isbn}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional. Enter 10 or 13 digit ISBN.
        </p>
      </div>

      <div>
        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-2">
          Published Year *
        </label>
        <input
          type="number"
          id="publishedYear"
          name="publishedYear"
          required
          value={formData.publishedYear}
          onChange={handleChange}
          className={inputClassName('publishedYear')}
        />
        {errors.publishedYear && (
          <p className="mt-1 text-sm text-red-600">{errors.publishedYear}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={inputClassName('description')}
          placeholder="A brief description of the book..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Optional. Maximum 1000 characters. 
          {formData.description ? ` ${formData.description.length}/1000` : ' 0/1000'}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Creating...' : 'Create Book'}
      </button>
    </form>
  );
} 