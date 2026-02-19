import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/Errorboundary';

// Suppress console.error output during boundary tests
const originalConsoleError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = originalConsoleError; });

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows Try Again and Go Home buttons in fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
  });

  it('resets error state when Try Again is clicked', () => {
    let shouldThrowFlag = true;
    const Thrower = () => {
      if (shouldThrowFlag) throw new Error('Test error');
      return <div>No error</div>;
    };

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Stop throwing before clicking reset
    shouldThrowFlag = false;
    fireEvent.click(screen.getByText('Try Again'));

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('calls onReset prop when Try Again is clicked', () => {
    const onReset = jest.fn();
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    fireEvent.click(screen.getByText('Try Again'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('uses custom fallback when provided', () => {
    const fallback = (error, reset) => (
      <div>
        <span>Custom: {error.message}</span>
        <button onClick={reset}>Custom Reset</button>
      </div>
    );
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError shouldThrow />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom: Test error')).toBeInTheDocument();
    expect(screen.getByText('Custom Reset')).toBeInTheDocument();
  });
});
