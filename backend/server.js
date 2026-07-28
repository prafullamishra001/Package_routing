require("dotenv").config();
const app=require('./src/app');
const connectDB=require('./src/db/db');
const { validateConfig } = require('./src/utils/config.validator');

try {
  validateConfig();
  connectDB();

  app.listen(3000,()=>{
            console.log('Server is running on port 3000');
  });
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}