export function getApiErrorMessage(error, fallback = 'The request could not be completed') {
  if (error && typeof error === 'object' && 'status' in error) {
    const data = error.data;
    if (data && typeof data === 'object') {
      if (typeof data.error === 'string') return data.error;
      if (typeof data.message === 'string') return data.message;
    }
    if (error.status === 'FETCH_ERROR') return 'Could not reach the server. Check your connection.';
    if (error.status === 'TIMEOUT_ERROR') return 'The request timed out. Please try again.';
  }

  if (error && typeof error === 'object' && 'message' in error
    && typeof error.message === 'string' && error.message) {
    return error.message;
  }
  return fallback;
}
