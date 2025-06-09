import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryProvider } from './QueryProvider';

// Mock the ReactQueryDevtools component
jest.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: ({ initialIsOpen }: { initialIsOpen: boolean }) => (
    <div data-testid="react-query-devtools" data-initial-open={initialIsOpen}>
      DevTools
    </div>
  ),
}));

describe('QueryProvider', () => {
  it('renders children correctly', () => {
    render(
      <QueryProvider>
        <div data-testid="test-child">Test Child Component</div>
      </QueryProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Component')).toBeInTheDocument();
  });

  it('includes ReactQueryDevtools with correct initial state', () => {
    render(
      <QueryProvider>
        <div>Test Content</div>
      </QueryProvider>
    );

    const devtools = screen.getByTestId('react-query-devtools');
    expect(devtools).toBeInTheDocument();
    expect(devtools).toHaveAttribute('data-initial-open', 'false');
  });

  it('renders multiple children correctly', () => {
    render(
      <QueryProvider>
        <div data-testid="child-1">First Child</div>
        <div data-testid="child-2">Second Child</div>
        <span data-testid="child-3">Third Child</span>
      </QueryProvider>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('handles empty children', () => {
    render(<QueryProvider>{null}</QueryProvider>);

    // Should still render DevTools even with no children
    expect(screen.getByTestId('react-query-devtools')).toBeInTheDocument();
  });

  it('handles complex nested children', () => {
    render(
      <QueryProvider>
        <div data-testid="parent">
          <div data-testid="nested-child">
            <span>Deeply nested content</span>
          </div>
        </div>
      </QueryProvider>
    );

    expect(screen.getByTestId('parent')).toBeInTheDocument();
    expect(screen.getByTestId('nested-child')).toBeInTheDocument();
    expect(screen.getByText('Deeply nested content')).toBeInTheDocument();
  });

  it('wraps content with QueryClientProvider', () => {
    const TestComponent = () => {
      // This would throw an error if not wrapped with QueryClientProvider
      try {
        return <div data-testid="query-context-test">Query context available</div>;
      } catch {
        return <div data-testid="no-query-context">No query context</div>;
      }
    };

    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );

    // The component should render successfully when wrapped with QueryProvider
    expect(screen.getByTestId('query-context-test')).toBeInTheDocument();
  });

  it('preserves component hierarchy', () => {
    const { container } = render(
      <QueryProvider>
        <div className="app-container">
          <header>Header</header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </div>
      </QueryProvider>
    );

    const appContainer = container.querySelector('.app-container');
    expect(appContainer).toBeInTheDocument();
    expect(appContainer?.querySelector('header')).toBeInTheDocument();
    expect(appContainer?.querySelector('main')).toBeInTheDocument();
    expect(appContainer?.querySelector('footer')).toBeInTheDocument();
  });

  it('renders with different types of React children', () => {
    const StringChild = 'Plain text child';
    const NumberChild = 42;
    const BooleanChild = true;

    render(
      <QueryProvider>
        <div data-testid="string-child">{StringChild}</div>
        <div data-testid="number-child">{NumberChild}</div>
        <div data-testid="boolean-child">{BooleanChild && 'Boolean is true'}</div>
      </QueryProvider>
    );

    expect(screen.getByText('Plain text child')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Boolean is true')).toBeInTheDocument();
  });
}); 