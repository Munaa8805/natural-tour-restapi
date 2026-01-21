

import app from "./app.js";

const PORT = process.env.PORT || 6050;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}, ${err.name}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}, ${err.name}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});