import { renderHook, act } from '@testing-library/react';
import { useApiCall } from '../hooks/useApiCall';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
}));

const toast = require('react-hot-toast').default;

describe('useApiCall', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('starts with initial state', () => {
    const { result } = renderHook(() => useApiCall(jest.fn()));
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading to true during execution', async () => {
    let resolvePromise;
    const apiFunc = () => new Promise((resolve) => { resolvePromise = resolve; });

    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    let executePromise;
    act(() => {
      executePromise = result.current.execute();
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise('data');
      await executePromise;
    });
    expect(result.current.loading).toBe(false);
  });

  it('stores returned data on success', async () => {
    const apiFunc = jest.fn().mockResolvedValue({ name: 'test' });
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual({ name: 'test' });
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    const apiFunc = jest.fn().mockRejectedValue(new Error('API failed'));
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0, showErrorToast: false }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });

    expect(result.current.error).toBe('API failed');
    expect(result.current.data).toBeNull();
  });

  it('shows success toast when configured', async () => {
    const apiFunc = jest.fn().mockResolvedValue('ok');
    const { result } = renderHook(() =>
      useApiCall(apiFunc, { showSuccessToast: true, successMessage: 'Success!', minLoadingMs: 0 })
    );

    await act(async () => {
      await result.current.execute();
    });

    expect(toast.success).toHaveBeenCalledWith('Success!');
  });

  it('shows error toast on failure by default', async () => {
    const apiFunc = jest.fn().mockRejectedValue(new Error('Oops'));
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Oops');
  });

  it('redirects to /login on 401 errors', async () => {
    const error = new Error('Unauthorized');
    error.status = 401;
    const apiFunc = jest.fn().mockRejectedValue(error);

    delete window.location;
    window.location = { href: '' };

    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });

    expect(window.location.href).toBe('/login');
    expect(toast.error).toHaveBeenCalledWith('Session expired. Please log in again.');
  });

  it('reset clears data, error, and loading', async () => {
    const apiFunc = jest.fn().mockResolvedValue('data');
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      await result.current.execute();
    });
    expect(result.current.data).toBe('data');

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('passes arguments to the api function', async () => {
    const apiFunc = jest.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      await result.current.execute('arg1', 'arg2');
    });

    expect(apiFunc).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('shows network error toast when offline', async () => {
    const originalOnLine = navigator.onLine;
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    const error = new Error('Network error');
    const apiFunc = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('No internet connection. Please check your network.');

    Object.defineProperty(navigator, 'onLine', { value: originalOnLine, writable: true });
  });

  it('shows server error toast for 500+ status', async () => {
    const error = new Error('Internal Server Error');
    error.status = 500;
    const apiFunc = jest.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useApiCall(apiFunc, { minLoadingMs: 0 }));

    await act(async () => {
      try {
        await result.current.execute();
      } catch (e) {
        // expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
  });
});
