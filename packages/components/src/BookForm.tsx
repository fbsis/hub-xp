import React, { useState } from 'react';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BookFormDto } from './BookFormDto';
import { Input, Label, Button, Textarea } from './form';

interface BookFormProps {
  onSubmit: (data: BookFormDto) => void;
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

  const formatValidationErrors = (validationErrors: ValidationError[]): ValidationErrors => {
    const formatted: ValidationErrors = {};
    
    validationErrors.forEach(error => {
      if (error.constraints) {
        const firstConstraintKey = Object.keys(error.constraints)[0];
        formatted[error.property] = error.constraints[firstConstraintKey];
      }
    });
    
    return formatted;
  };

  const validateForm = async (): Promise<boolean> => {
    const dto = plainToClass(BookFormDto, {
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn?.trim() || undefined,
      publishedYear: formData.publishedYear,
      description: formData.description?.trim() || undefined,
    });

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

    const dto = plainToClass(BookFormDto, {
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{marginBottom: '10px'}}>
        <Label htmlFor="title" required>Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.title}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <Label htmlFor="author" required>Author</Label>
        <Input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        {errors.author && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.author}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <Label htmlFor="isbn">ISBN</Label>
        <Input
          type="text"
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
        />
        {errors.isbn && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.isbn}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <Label htmlFor="publishedYear" required>Published Year</Label>
        <Input
          type="number"
          id="publishedYear"
          name="publishedYear"
          value={formData.publishedYear}
          onChange={handleChange}
        />
        {errors.publishedYear && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.publishedYear}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.description}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        variant="primary"
      >
        {isLoading ? 'Creating...' : 'Create Book'}
      </Button>
    </form>
  );
} 