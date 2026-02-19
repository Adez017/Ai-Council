// hooks/useApiCall.js
import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing API calls with loading, error, and retry states.
 *
 * @param {Function} apiFunction - The async API function to call
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show a success toast on success
 * @param {string} options.successMessage - Custom success message
 * @param {boolean} options.showErrorToast - Show an error toast on failure (default: true)
 * @param {number} options.minLoadingMs - Minimum loading duration to prevent flicker (default: 300)
 */
export const useApiCall = (apiFunction, options = {}) => {
  const {
    showSuccessToast = false,
    successMessage = 'Done!',
    showErrorToast = true,
    minLoadingMs = 300,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const startTimeRef = useRef(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        startTimeRef.current = Date.now();

        const result = await apiFunction(...args);

        // Prevent loading flicker for very fast responses
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < minLoadingMs) {
          await new Promise((r) => setTimeout(r, minLoadingMs - elapsed));
        }

        setData(result);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        return result;
      } catch (err) {
        const status = err.response?.status;

        // Handle specific HTTP status codes
        if (status === 401) {
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
          return;
        }

        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'An error occurred';

        setError(errorMessage);

        if (showErrorToast) {
          if (!navigator.onLine) {
            toast.error('No internet connection. Please check your network.');
          } else if (status >= 500) {
            toast.error('Server error. Please try again later.');
          } else {
            toast.error(errorMessage);
          }
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, showSuccessToast, successMessage, showErrorToast, minLoadingMs]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

/**
 * Hook for fetching data on mount with refetch support.
 */
import { useEffect } from 'react';

export const useFetch = (apiFunction, deps = [], options = {}) => {
  const { data, loading, error, execute, reset } = useApiCall(apiFunction, {
    showErrorToast: true,
    ...options,
  });

  useEffect(() => {
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: execute, reset };
};

export default useApiCall;
