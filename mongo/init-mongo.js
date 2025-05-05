// This script initializes MongoDB with a database and user
db = db.getSiblingDB('appdb');

// Create a user for the application
db.createUser({
  user: 'mongo-user',
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: 'appdb',
    },
  ],
});

// Create some initial collections
db.createCollection('users');
db.createCollection('items');

// Insert some sample data
db.users.insertMany([
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    role: 'user',
    createdAt: new Date(),
  },
]);

db.items.insertMany([
  {
    name: 'Item 1',
    description: 'This is the first item',
    price: 19.99,
    createdAt: new Date(),
  },
  {
    name: 'Item 2',
    description: 'This is the second item',
    price: 29.99,
    createdAt: new Date(),
  },
]);