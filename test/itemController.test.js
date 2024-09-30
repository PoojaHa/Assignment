const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your Express app
const Item = require('../Models/Item.models');
const User = require('../Models/Customer.models');
const { connectDB, closeDB } = require('../Config/db'); // Import the connection module

beforeAll(async () => {
    await connectDB();
});

// Cleanup after all tests
afterAll(async () => {
    await Item.deleteMany({});
    await User.deleteMany({});
    await closeDB(); // Make sure this function exists
});

describe('Order Controller', () => {
  beforeAll(async () => {
      // Create test items to be included in the order
      await Item.create([
          { _id: '66f99b52d4aa04dbca4c3b63', name: 'Pizza', price: 12.99, quantity: 1 },
          { _id: '66f99b58d4aa04dbca4c3b66', name: 'Burger', price: 10.99, quantity: 1 },
      ]);
  });

  afterAll(async () => {
      // Clean up the database
      await Order.deleteMany({});
      await Item.deleteMany({});
      await User.deleteMany({});
  });

  describe('POST /orders', () => {
      it('should create a new order and return the order data', async () => {
          // Create a new user with the required fields
          const newUser = new User({
              name: 'Jane Doe',
              email: 'jane@example.com',
              password: 'password123',
              deliveryAddress: {
                  street: '456 Elm St',
                  city: 'Springfield',
                  state: 'IL',
                  zipCode: '62701'
              }
          });
          const savedUser = await newUser.save(); // Save user to the database

          const orderData = {
              userId: savedUser._id, // Use the saved user's ID
              items: ['66f99b52d4aa04dbca4c3b63', '66f99b58d4aa04dbca4c3b66'] // Use the created items
          };

          // Send the request and store the response
          const res = await request(app)
              .post('/orders') // Adjust the route as necessary
              .send(orderData);

          console.log('Response:', res.body); // Log the response to inspect the data

          expect(res.status).toBe(201); 
          expect(res.body).toHaveProperty('_id'); 
          expect(res.body.user.toString()).toBe(savedUser._id.toString());
          expect(res.body.items).toEqual(orderData.items); 
          expect(res.body.totalAmount).toBe(23.98); 
      });
  });
});


