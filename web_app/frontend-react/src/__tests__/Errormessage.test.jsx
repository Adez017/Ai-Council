import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage, InlineError } from '../components/Errormessage';

describe('ErrorMessage', () => {
  it('renders default error when no statusCode is provided', () => {
    render(<ErrorMessage error="Something failed" />);
    expect(screen.getByText('Something failed')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders 401 config when statusCode is 401', () => {
    render(<ErrorMessage statusCode={401} />);
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByText('You need to be logged in to access this resource.')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders 403 config', () => {
    render(<ErrorMessage statusCode={403} />);
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('renders 404 config', () => {
    render(<ErrorMessage statusCode={404} />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders 500 config', () => {
    render(<ErrorMessage statusCode={500} />);
    expect(screen.getByText('Server Error')).toBeInTheDocument();
  });

  it('shows retry button when onRetry is provided', () => {
    const onRetry = jest.fn();
    render(<ErrorMessage error="fail" onRetry={onRetry} />);
    const btn = screen.getByText('Try Again');
    fireEvent.click(btn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not show retry button when onRetry is not provided', () => {
    render(<ErrorMessage error="fail" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ErrorMessage error="fail" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles error object with message property', () => {
    render(<ErrorMessage error={{ message: 'Object error msg' }} />);
    expect(screen.getByText('Object error msg')).toBeInTheDocument();
  });

  it('handles error object with status property for config lookup', () => {
    render(<ErrorMessage error={{ status: 404, message: 'Not here' }} />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });
});

describe('InlineError', () => {
  it('renders message when provided', () => {
    render(<InlineError message="Inline error" />);
    expect(screen.getByText('Inline error')).toBeInTheDocument();
  });

  it('renders nothing when message is falsy', () => {
    const { container } = render(<InlineError message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when message is undefined', () => {
    const { container } = render(<InlineError />);
    expect(container.firstChild).toBeNull();
  });
});
