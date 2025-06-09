import React, { useState } from 'react';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BookFormDto } from './BookFormDto';

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
        <label htmlFor="title" style={{display: 'block', marginBottom: '5px'}}>Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.title && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.title}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="author" style={{display: 'block', marginBottom: '5px'}}>Author</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.author && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.author}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="isbn" style={{display: 'block', marginBottom: '5px'}}>ISBN</label>
        <input
          type="text"
          id="isbn"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.isbn && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.isbn}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="publishedYear" style={{display: 'block', marginBottom: '5px'}}>Published Year</label>
        <input
          type="number"
          id="publishedYear"
          name="publishedYear"
          value={formData.publishedYear}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        {errors.publishedYear && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.publishedYear}</p>}
      </div>

      <div style={{marginBottom: '10px'}}>
        <label htmlFor="description" style={{display: 'block', marginBottom: '5px'}}>Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '60px'
          }}
        />
        {errors.description && <p style={{color: 'red', margin: '5px 0 0 0'}}>{errors.description}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Creating...' : 'Create Book'}
      </button>
    </form>
  );
} 