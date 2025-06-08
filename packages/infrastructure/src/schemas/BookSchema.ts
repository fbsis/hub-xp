import { Schema, model, Document } from 'mongoose';
import { BookDocument } from '@domain/core';

export interface BookMongoDocument extends BookDocument, Document {
  _id: string;
}

const BookSchema = new Schema<BookMongoDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true
    },
    author: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true
    },
    isbn: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple null values
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow null/undefined
          // ISBN validation (10 or 13 digits, possibly with dashes/spaces)
          return /^(?:\d{10}|\d{13}|(?:\d{1,5}-){1,6}\d{1,7}|(?:\d{1,5}\s){1,6}\d{1,7})$/.test(v);
        },
        message: 'Invalid ISBN format'
      }
    },
    publishedYear: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear() + 1,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: ''
    },
    avgRating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
      index: true
    },
    reviewCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      index: true
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: 'books',
    versionKey: false
  }
);

// Indexes for better query performance
BookSchema.index({ title: 'text', author: 'text', description: 'text' }); // Text search
BookSchema.index({ avgRating: -1, reviewCount: -1 }); // Top books query
BookSchema.index({ createdAt: -1 }); // Recent books
BookSchema.index({ author: 1, publishedYear: -1 }); // Author + year queries

// Virtual for formatted ISBN
BookSchema.virtual('formattedIsbn').get(function(this: BookMongoDocument) {
  if (!this.isbn) return null;
  
  const cleanIsbn = this.isbn.replace(/[-\s]/g, '');
  if (cleanIsbn.length === 10) {
    return `${cleanIsbn.slice(0, 1)}-${cleanIsbn.slice(1, 4)}-${cleanIsbn.slice(4, 9)}-${cleanIsbn.slice(9)}`;
  } else if (cleanIsbn.length === 13) {
    return `${cleanIsbn.slice(0, 3)}-${cleanIsbn.slice(3, 4)}-${cleanIsbn.slice(4, 6)}-${cleanIsbn.slice(6, 12)}-${cleanIsbn.slice(12)}`;
  }
  return this.isbn;
});

// Ensure virtual fields are serialized
BookSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc: Document, ret: any) {
    delete ret.__v;
    return ret;
  }
});

export const BookModel = model<BookMongoDocument>('Book', BookSchema);
export { BookSchema }; 