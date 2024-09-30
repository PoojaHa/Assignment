const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables
const { connectDB } = require('./Config/db'); // Import the database connection utility

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// Connect to the database
connectDB();

// Routes
const User = require("./Routes/User");
const Item = require("./Routes/Item");
const Order = require("./Routes/Order");
app.use("/api", [User, Item, Order]);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {  // Only start the server if not in a test environment
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}

// Export the app for testing purposes
module.exports = app;
