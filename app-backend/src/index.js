
require('dotenv').config();
const app = require('./app');

// Define the port (from environment or use default)
const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 