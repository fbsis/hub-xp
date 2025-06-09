import { UpdateBookDto } from './UpdateBookDto';

describe('UpdateBookDto', () => {
  const currentYear = new Date().getFullYear();

  describe('constructor and properties', () => {
    it('should create DTO with all undefined by default', () => {
      const dto = new UpdateBookDto();
      
      expect(dto.title).toBeUndefined();
      expect(dto.author).toBeUndefined();
      expect(dto.isbn).toBeUndefined();
      expect(dto.publishedYear).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });

    it('should allow setting individual properties', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        title: 'Updated Title'
      });
      
      expect(dto.title).toBe('Updated Title');
      expect(dto.author).toBeUndefined();
    });
  });

  describe('property validation compatibility', () => {
    it('should accept valid title', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        title: 'Clean Architecture'
      });
      
      expect(dto.title).toBe('Clean Architecture');
    });

    it('should accept valid author', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        author: 'Robert C. Martin'
      });
      
      expect(dto.author).toBe('Robert C. Martin');
    });

    it('should accept valid ISBN formats', () => {
      const validISBNs = [
        '9780134494166',  // 13 digits
        '0134494164',     // 10 digits
        '978-0-13-449416-6', // 13 with dashes
        '0-13-449416-4',  // 10 with dashes
        '978 0 13 449416 6', // 13 with spaces
        '0 13 449416 4'   // 10 with spaces
      ];
      
      validISBNs.forEach(isbn => {
        const dto = Object.assign(new UpdateBookDto(), { isbn });
        expect(dto.isbn).toBe(isbn);
      });
    });

    it('should accept valid published year', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        publishedYear: 2020
      });
      
      expect(dto.publishedYear).toBe(2020);
    });

    it('should accept valid description', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        description: 'A comprehensive guide to software architecture and clean code principles.'
      });
      
      expect(dto.description).toBe('A comprehensive guide to software architecture and clean code principles.');
    });
  });

  describe('partial updates', () => {
    it('should allow updating only title', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        title: 'New Book Title'
      });
      
      expect(dto.title).toBe('New Book Title');
      expect(dto.author).toBeUndefined();
      expect(dto.isbn).toBeUndefined();
      expect(dto.publishedYear).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });

    it('should allow updating multiple fields', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        title: 'Updated Title',
        author: 'Updated Author',
        publishedYear: 2023
      });
      
      expect(dto.title).toBe('Updated Title');
      expect(dto.author).toBe('Updated Author');
      expect(dto.publishedYear).toBe(2023);
      expect(dto.isbn).toBeUndefined();
      expect(dto.description).toBeUndefined();
    });

    it('should allow updating all fields', () => {
      const updateData = {
        title: 'Complete Updated Title',
        author: 'Complete Updated Author',
        isbn: '9780134494166',
        publishedYear: 2022,
        description: 'Complete updated description'
      };
      
      const dto = Object.assign(new UpdateBookDto(), updateData);
      
      expect(dto.title).toBe(updateData.title);
      expect(dto.author).toBe(updateData.author);
      expect(dto.isbn).toBe(updateData.isbn);
      expect(dto.publishedYear).toBe(updateData.publishedYear);
      expect(dto.description).toBe(updateData.description);
    });
  });

  describe('edge cases', () => {
    it('should handle minimum valid year', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        publishedYear: 1000
      });
      
      expect(dto.publishedYear).toBe(1000);
    });

    it('should handle current year', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        publishedYear: currentYear
      });
      
      expect(dto.publishedYear).toBe(currentYear);
    });

    it('should handle maximum title length', () => {
      const maxTitle = 'a'.repeat(200);
      const dto = Object.assign(new UpdateBookDto(), {
        title: maxTitle
      });
      
      expect(dto.title).toBe(maxTitle);
    });

    it('should handle maximum author length', () => {
      const maxAuthor = 'a'.repeat(100);
      const dto = Object.assign(new UpdateBookDto(), {
        author: maxAuthor
      });
      
      expect(dto.author).toBe(maxAuthor);
    });

    it('should handle maximum description length', () => {
      const maxDescription = 'a'.repeat(1000);
      const dto = Object.assign(new UpdateBookDto(), {
        description: maxDescription
      });
      
      expect(dto.description).toBe(maxDescription);
    });

    it('should handle empty description', () => {
      const dto = Object.assign(new UpdateBookDto(), {
        description: ''
      });
      
      expect(dto.description).toBe('');
    });
  });

  describe('optional field behavior', () => {
    it('should allow resetting fields to undefined', () => {
      // Simulate updating a field and then removing it
      const dto = Object.assign(new UpdateBookDto(), {
        title: 'Initial Title',
        description: 'Initial Description'
      });
      
      // Simulate partial update removing description
      const updatedDto = Object.assign(new UpdateBookDto(), {
        title: 'Updated Title'
        // description intentionally omitted
      });
      
      expect(updatedDto.title).toBe('Updated Title');
      expect(updatedDto.description).toBeUndefined();
    });
  });
}); 