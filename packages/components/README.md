# @components/ui

Reusable UI components for the Book Reviews platform.

## Components

### Form Components (`./form/`)

All form components are located in the `form` directory and provide consistent styling and behavior.

#### Input
```tsx
import { Input } from '@components/ui';

<Input 
  type="text"
  value={value}
  onChange={handleChange}
  placeholder="Enter text"
  required
/>
```

**Props:**
- `type`: 'text' | 'number' | 'email' | 'password'
- `value`: string | number
- `onChange`: (e: React.ChangeEvent<HTMLInputElement>) => void
- `placeholder`: string
- `required`: boolean
- `disabled`: boolean

#### Label
```tsx
import { Label } from '@components/ui';

<Label htmlFor="input-id" required>
  Field Name
</Label>
```

**Props:**
- `htmlFor`: string
- `children`: React.ReactNode
- `required`: boolean (shows red asterisk *)

#### Button
```tsx
import { Button } from '@components/ui';

<Button 
  type="submit" 
  variant="primary"
  onClick={handleClick}
  disabled={loading}
>
  Submit
</Button>
```

**Props:**
- `type`: 'button' | 'submit' | 'reset'
- `variant`: 'primary' | 'secondary'
- `onClick`: () => void
- `disabled`: boolean
- `children`: React.ReactNode

#### Textarea
```tsx
import { Textarea } from '@components/ui';

<Textarea 
  value={description}
  onChange={handleChange}
  rows={4}
  placeholder="Enter description"
/>
```

**Props:**
- `value`: string
- `onChange`: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
- `rows`: number
- `placeholder`: string
- `required`: boolean
- `disabled`: boolean

### BookForm
Complete form component for creating books with validation using class-validator.

```tsx
import { BookForm, BookFormDto } from '@components/ui';

const handleSubmit = (data: BookFormDto) => {
  // Submit book data
};

<BookForm onSubmit={handleSubmit} isLoading={false} />
```

### BookCard
Component for displaying book information with ratings.

```tsx
import { BookCard } from '@components/ui';

<BookCard book={bookWithStats} />
```

## Development

### Building
```bash
pnpm build
```

### Testing
```bash
# Install test dependencies first
pnpm install

# Run tests (when test dependencies are installed)
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Test Files
Each component has corresponding test files:
- `Input.spec.tsx` - Tests for Input component
- `Label.spec.tsx` - Tests for Label component  
- `Button.spec.tsx` - Tests for Button component
- `Textarea.spec.tsx` - Tests for Textarea component

Tests are excluded from the build process but are available for development.

## Architecture

- **Form Components**: Reusable form elements with consistent styling
- **Validation**: BookForm uses class-validator for robust validation
- **TypeScript**: Full type safety across all components
- **Styling**: Inline styles for simplicity and portability 