const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Read Redis password from secrets file
let redisPassword;
try {
  redisPassword = fs.readFileSync('/run/secrets/redis_password', 'utf8').trim();
} catch (error) {
  console.error('Error reading Redis password:', error);
  redisPassword = process.env.REDIS_PASSWORD || 'default_password';
}

// Connect to Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: redisPassword
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!' });
});

// Example route with Redis caching
app.get('/items', async (req, res) => {
  try {
    // Check if data exists in cache
    redisClient.get('items', async (err, cachedItems) => {
      if (err) console.error('Redis error:', err);
      
      if (cachedItems) {
        console.log('Returning cached data');
        return res.json(JSON.parse(cachedItems));
      }
      
      // If not in cache, get from database
      const items = await mongoose.connection.db.collection('items').find({}).toArray();
      
      // Store in cache for 5 minutes
      redisClient.setex('items', 300, JSON.stringify(items));
      
      res.json(items);
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});