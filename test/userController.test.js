const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust the path to your Express app
const User = require('../Models/Customer.models');
const { connectDB, closeDB } = require('../Config/db'); // Import the connection module

beforeAll(async () => {
    await connectDB();
});

// Cleanup after all tests
afterAll(async () => {
    await User.deleteMany({}); // Clear users after tests
    await closeDB(); // Make sure this function exists
});

describe('User Controller', () => {
    describe('POST /users', () => {
        it('should create a new user and return user data', async () => {
            const newUser = {
                name: 'Jane Doe',
                email: 'jane@example.com',
                password: 'password123',
                deliveryAddress: {
                    street: '456 Elm St',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62701'
                }
            };

            const res = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(res.status).toBe(201); // Expect a 201 Created status
            expect(res.body).toHaveProperty('_id'); // Check if the user has an ID
            expect(res.body.name).toBe(newUser.name); // Validate user name
            expect(res.body.email).toBe(newUser.email); // Validate user email
        });
    });

    describe('GET /users', () => {
        it('should return all users', async () => {
            const res = await request(app)
                .get('/api/users');

            expect(res.status).toBe(200); // Expect a 200 OK status
            expect(Array.isArray(res.body)).toBe(true); // Validate that the response is an array
        });
    });

    describe('PUT /users/:id', () => {
        it('should update an existing user and return the updated user data', async () => {
            const existingUser = new User({
                name: 'Tom Smith',
                email: 'tom@example.com',
                password: 'password123',
                deliveryAddress: {
                    street: '789 Oak St',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62701'
                }
            });
            const savedUser = await existingUser.save(); // Save user to the database

            const updatedUser = {
                name: 'Tommy Smith',
                email: 'tommy@example.com',
            };

            const res = await request(app)
                .put(`/api/users/${savedUser._id}`)
                .send(updatedUser);

            expect(res.status).toBe(200); // Expect a 200 OK status
            expect(res.body.name).toBe(updatedUser.name); // Validate updated user name
            expect(res.body.email).toBe(updatedUser.email); // Validate updated user email
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user by ID', async () => {
            const userToDelete = new User({
                name: 'Delete Me',
                email: 'delete@example.com',
                password: 'password123',
                deliveryAddress: {
                    street: '111 Pine St',
                    city: 'Springfield',
                    state: 'IL',
                    zipCode: '62701'
                }
            });
            const savedUser = await userToDelete.save(); // Save user to the database

            const res = await request(app)
                .delete(`/api/users/${savedUser._id}`);

            expect(res.status).toBe(204); // Expect a 204 No Content status

            // Verify that the user is deleted
            const deletedUser = await User.findById(savedUser._id);
            expect(deletedUser).toBeNull(); // User should be null after deletion
        });
    });
});
