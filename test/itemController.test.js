const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const app = require('../app'); // Adjust the path to your Express app
const Item = require('../Models/Item.models');
const User = require('../Models/Customer.models');

chai.use(chaiHttp);
const { expect } = chai;

describe('Item Routes', () => {
  // Clear the database before running tests
  before(async () => {
    await mongoose.connect(process.env.DB_URI || 'mongodb://localhost/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /items', () => {
    it('should create a new item', async () => {
      const userId = new mongoose.Types.ObjectId(); // Create a new user ID
      const itemData = { name: 'Item 1', price: 10, quantity: 5, userId };

      const res = await chai.request(app)
        .post('/api/items') // Ensure the correct endpoint is used
        .send(itemData);

      expect(res).to.have.status(201);
      expect(res.body).to.include(itemData);
    });

    it('should return 400 if item creation fails', async () => {
      const res = await chai.request(app)
        .post('/api/items') // Ensure the correct endpoint is used
        .send({}); // Sending empty data to cause a failure

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message', 'Failed to create item');
    });
  });

  describe('GET /items', () => {
    it('should return all items', async () => {
      const res = await chai.request(app)
        .get('/api/items'); // Ensure the correct endpoint is used

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  });

  describe('GET /items/:id', () => {
    it('should return items for a specific user', async () => {
      const userId = new mongoose.Types.ObjectId();
      const itemData = { name: 'Item 1', price: 10, quantity: 5, userId };
      await chai.request(app).post('/api/items').send(itemData); // Create an item for the user

      const res = await chai.request(app)
        .get(`/api/items/user/${userId}`); // Ensure the correct endpoint is used

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 404 if the user does not have any items', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const res = await chai.request(app)
        .get(`/api/items/user/${nonExistentUserId}`);

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'No items found for this user');
    });
  });

  describe('PUT /items/:id', () => {
    it('should update an item', async () => {
      const itemData = { name: 'Item 1', price: 10, quantity: 5 };
      const createResponse = await chai.request(app)
        .post('/api/items')
        .send(itemData);
      const itemId = createResponse.body._id;

      const res = await chai.request(app)
        .put(`/api/items/${itemId}`) // Ensure the correct endpoint is used
        .send({ name: 'Updated Item' });

      expect(res).to.have.status(200);
      expect(res.body.name).to.equal('Updated Item');
    });

    it('should return 404 if the item is not found', async () => {
      const res = await chai.request(app)
        .put(`/api/items/${new mongoose.Types.ObjectId()}`) // Use a new ID
        .send({ name: 'Nonexistent Item' });

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('message', 'Item not found');
    });
  });
});
