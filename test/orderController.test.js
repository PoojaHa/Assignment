// const request = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../server'); // Adjust the path to your Express app
// const Item = require('../Models/Item.models');
// const Order = require('../Models/Order.models');
// const User = require('../Models/Customer.models');
// const { connectDB, closeDB } = require('../Config/db'); // Import the connection module

// beforeAll(async () => {
//     await connectDB();
// });

// afterAll(async () => {
//     await Item.deleteMany({});
//     await User.deleteMany({});
//     await closeDB();
// });

// describe('Order Controller', () => {
//     let userId;
//     const itemIds = ['66f99b52d4aa04dbca4c3b63', '66f99b58d4aa04dbca4c3b66'];

//     beforeAll(async () => {
//         // Create a test user for the order
//         const user = new User({
//             name: 'Test User',
//             email: 'testuser@example.com',
//             deliveryAddress: {
//                 street: '123 Test St',
//                 city: 'Test City',
//                 state: 'Test State',
//                 zipCode: '12345',
//             },
//         });
//         await user.save();
//         userId = user._id;

//         // Create test items for the order
//         const items = [
//             { _id: itemIds[0], price: 10, quantity: 1, name: 'Item 1' },
//             { _id: itemIds[1], price: 15, quantity: 1, name: 'Item 2' },
//         ];
//         await Item.insertMany(items);
//     });

//     describe('POST /order', () => {
//         it('should create a new order and return the order data', async () => {
//             const orderData = {
//                 name: 'Test User',
//                 email: 'testuser@example.com',
//                 deliveryAddress: {
//                     street: '123 Test St',
//                     city: 'Test City',
//                     state: 'Test State',
//                     zipCode: '12345',
//                 },
//                 items: itemIds,
//             };

//             const { status, body } = await request(app)
//                 .post('/order') 
//                 .send(orderData);

//             // Log the body to inspect the data
//             console.log('Response:', body);

//             // Assertions
//             expect(status).toBe(201); // Expect a 201 Created status
//             expect(body).toHaveProperty('order'); // Check if the order has been created
//             expect(body.order).toHaveProperty('_id'); // Check if the order has an ID
//             expect(body.order.userId.toString()).toBe(userId.toString()); // Validate user ID
//             expect(body.order.items).toEqual(itemIds); // Validate items in the order
//             expect(body.order.totalAmount).toBeGreaterThan(0); // Validate total amount is greater than 0
//         });
//     });

//     describe('GET /orders', () => {
//         it('should return all orders', async () => {
//             const { status, body } = await request(app)
//                 .get('/orders');

//             expect(status).toBe(200);
//             expect(body).toHaveLength(1); // Assuming we created one order in the previous test
//         });
//     });

    
// });
