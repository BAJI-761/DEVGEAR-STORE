export function errorHandler(error, _req, res, _next) {
  console.error(error);

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Something went wrong'
    }
  });
}