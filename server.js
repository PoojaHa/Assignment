const express = require('express');
const app = express();
const port = 8000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS

// MongoDB Connection
const dbUri = process.env.DB_URI; // Use the DB_URI from .env file

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error(`Error connecting to the database: ${err}`);
    });

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
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
