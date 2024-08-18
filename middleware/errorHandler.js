import { constants } from "../constant.js"; // Importing constants that define various error codes

// Middleware function to handle errors
const errorHandler = (err, req, res, next) => {
  // Get the current status code or default to 500 if not set
  const statusCode = res.statusCode ? res.statusCode : 500;

  // Switch based on the status code to handle different types of errors
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      // Handle validation errors (e.g., invalid input)
      res.json({
        title: "Validation Failed !!",
        message: err.message, // Error message
        stackTrace: err.stack, // Stack trace for debugging
      });
      break;

    case constants.NOT_FOUND:
      // Handle not found errors (e.g., resource not found)
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.UNAUTHORIZED:
      // Handle unauthorized errors (e.g., invalid credentials)
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.FORBIDDEN:
      // Handle forbidden errors (e.g., lack of permissions)
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case constants.SERVER_ERROR:
      // Handle server errors (e.g., unexpected issues)
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      // Handle any other errors
      res.json({
        title: "Error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
  }
};

export { errorHandler }; // Export the error handler to be used in the Express app
