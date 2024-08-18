import expressAsyncHandler from "express-async-handler"; // Import the async handler to manage asynchronous errors
import jwt from "jsonwebtoken"; // Import the JSON Web Token library

// Middleware to validate JSON Web Token (JWT)
const validateToken = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Get the Authorization header from the request
  // Handle both capitalized and lowercase 'authorization' headers
  const authHeader = req.headers.Authorization || req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer'
  if (authHeader && authHeader.startsWith("Bearer")) {
    // Extract the token part of the 'Bearer' token
    token = authHeader.split(" ")[1];

    // Verify the token using the secret key from environment variables
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        // If token verification fails, send a 401 Unauthorized response
        res.status(401);
        throw new Error("User is not authorized");
      }

      // Attach the decoded user information to the request object
      req.user = decoded.user;

      // Move to the next middleware function or route handler
      next();
    });
  } else {
    // If no token is provided or it does not start with 'Bearer', send a 401 Unauthorized response
    res.status(401);
    throw new Error("Token not provided or invalid");
  }
});

export { validateToken }; // Export the middleware to be used in the application
