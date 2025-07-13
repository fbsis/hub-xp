import { BookModel } from '../schemas/BookSchema';

export const bookSeedData = [
  {
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    isbn: '9780134494166',
    publishedYear: 2017,
    description: 'A comprehensive guide to building maintainable software architectures.',
    avgRating: 4.5,
    reviewCount: 125
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9780132350884',
    publishedYear: 2008,
    description: 'A handbook of agile software craftsmanship.',
    avgRating: 4.7,
    reviewCount: 248
  },
  {
    title: 'Design Patterns',
    author: 'Gang of Four',
    isbn: '9780201633610',
    publishedYear: 1994,
    description: 'Elements of reusable object-oriented software.',
    avgRating: 4.3,
    reviewCount: 89
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '9780134757599',
    publishedYear: 2019,
    description: 'Improving the design of existing code.',
    avgRating: 4.6,
    reviewCount: 67
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    isbn: '9780135957059',
    publishedYear: 2019,
    description: 'Your journey to mastery.',
    avgRating: 4.8,
    reviewCount: 156
  },
  {
    title: 'Effective Java',
    author: 'Joshua Bloch',
    isbn: '9780134685991',
    publishedYear: 2017,
    description: 'Best practices for the Java platform.',
    avgRating: 4.4,
    reviewCount: 93
  },
  {
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    isbn: '9781491904244',
    publishedYear: 2015,
    description: 'Deep dive into JavaScript fundamentals.',
    avgRating: 4.2,
    reviewCount: 78
  },
  {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    isbn: '9780321125217',
    publishedYear: 2003,
    description: 'Tackling complexity in the heart of software.',
    avgRating: 4.1,
    reviewCount: 54
  },
  {
    title: 'Microservices Patterns',
    author: 'Chris Richardson',
    isbn: '9781617294549',
    publishedYear: 2018,
    description: 'With examples in Java.',
    avgRating: 4.0,
    reviewCount: 41
  },
  {
    title: 'Building Microservices',
    author: 'Sam Newman',
    isbn: '9781491950357',
    publishedYear: 2015,
    description: 'Designing fine-grained systems.',
    avgRating: 4.3,
    reviewCount: 62
  }
];

export class BookSeeder {
  static async seedBooks(): Promise<void> {
    try {
      // Check if books already exist
      const existingBooks = await BookModel.countDocuments();
      
      if (existingBooks > 0) {
        console.log(`Database already has ${existingBooks} books. Skipping seed.`);
        return;
      }

      // Insert seed data
      const books = await BookModel.insertMany(bookSeedData);
      console.log(`Successfully seeded ${books.length} books to the database.`);
      
      // Log the seeded books
      books.forEach((book, index) => {
        console.log(`${index + 1}. ${book.title} by ${book.author} (${book.publishedYear})`);
      });

    } catch (error) {
      console.error('Error seeding books:', error);
      throw error;
    }
  }

  static async clearBooks(): Promise<void> {
    try {
      const result = await BookModel.deleteMany({});
      console.log(`Cleared ${result.deletedCount} books from the database.`);
    } catch (error) {
      console.error('Error clearing books:', error);
      throw error;
    }
  }

  static async reseedBooks(): Promise<void> {
    try {
      await this.clearBooks();
      await this.seedBooks();
      console.log('Books reseeded successfully.');
    } catch (error) {
      console.error('Error reseeding books:', error);
      throw error;
    }
  }
} 