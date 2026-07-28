require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");
const { validateConfig } = require("./src/utils/config.validator");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Validate required environment variables
    validateConfig();

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();