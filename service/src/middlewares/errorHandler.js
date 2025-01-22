module.exports = (err, req, res, next) => {
    console.error('Error:', err);
  
    // Log the full error in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';
  
    // Custom error handling logic can go here, such as logging to a service, sending alerts, etc.
  
    res.status(statusCode).json({
      success: false,
      message: message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  };