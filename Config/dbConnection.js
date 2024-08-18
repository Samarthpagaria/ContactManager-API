import mongoose from "mongoose"; // Import the mongoose library to interact with MongoDB

// Function to connect to the database
const connectdb = async () => {
  try {
    // Attempt to connect to the MongoDB database using the connection string from environment variables
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
  } catch (err) {
    // If there's an error during connection, log the error and exit the process with a failure code (1)
    console.log(err);
    process.exit(1);
  }
};

export { connectdb }; // Export the connectdb function so it can be used in other parts of the application
