// Config/db.js
//DB_URI=mongodb+srv://phaveri:UxHAQmfoALMdvm51@cluster0.3c2joza.mongodb.net/Order?retryWrites=true&w=majority

const mongoose = require('mongoose');

const connectDB = async () => {
    const dbUri = process.env.DB_URI; 
    await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to database');
};

// Close the database connection
const closeDB = async () => {
    await mongoose.connection.close();
};

module.exports = { connectDB, closeDB };
