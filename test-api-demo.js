// Demo script to test API without database connection
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 4000;

// Middleware
app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Mock data for demonstration
let users = [];
let trips = [];
let notifications = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Trek Tribe API is running (Demo Mode - No Database)',
    features: {
      userAuth: 'Mock implementation',
      tripManagement: 'Mock implementation',
      notifications: 'Mock implementation',
      realTimeNotifications: 'Available with Socket.IO',
      emailNotifications: 'Available with SMTP config'
    }
  });
});

// Mock auth endpoints
app.post('/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    name,
    role: role || 'traveler',
    createdAt: new Date()
  };
  
  users.push(user);
  
  res.status(201).json({
    message: 'User registered successfully',
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token: 'mock-jwt-token-' + user.id
  });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token: 'mock-jwt-token-' + user.id
  });
});

app.get('/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  const userId = token.replace('mock-jwt-token-', '');
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

// Mock trip endpoints
app.get('/trips', (req, res) => {
  res.json(trips);
});

app.post('/trips', (req, res) => {
  const { title, description, destination, capacity, price, startDate, endDate } = req.body;
  
  if (!title || !description || !destination) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const trip = {
    id: Date.now().toString(),
    title,
    description,
    destination,
    capacity: capacity || 10,
    price: price || 0,
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
    participants: [],
    organizerId: 'mock-organizer-id',
    createdAt: new Date()
  };
  
  trips.push(trip);
  
  res.status(201).json({
    message: 'Trip created successfully',
    trip
  });
});

// Mock notification endpoints
app.get('/notifications', (req, res) => {
  res.json({
    success: true,
    notifications: notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    pagination: { page: 1, limit: 20, total: notifications.length }
  });
});

app.get('/notifications/unread-count', (req, res) => {
  res.json({
    success: true,
    unreadCount: notifications.filter(n => !n.read).length
  });
});

app.post('/notifications/test', (req, res) => {
  const testNotification = {
    id: Date.now().toString(),
    type: 'system',
    title: 'Test Notification',
    message: 'This is a test notification to verify the system is working correctly.',
    read: false,
    createdAt: new Date()
  };
  
  notifications.push(testNotification);
  
  res.json({
    success: true,
    message: 'Test notification created successfully',
    notification: testNotification
  });
});

// Start server
app.listen(port, () => {
  console.log('🚀 Trek Tribe Demo API Server Started!');
  console.log(`📡 Server running on: http://localhost:${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log('');
  console.log('✨ Features Available (Demo Mode):');
  console.log('   • User Registration & Login (Mock)');
  console.log('   • Trip Management (Mock)');
  console.log('   • Notification System (Mock)');
  console.log('   • CORS enabled for React frontend');
  console.log('   • Cookie support');
  console.log('');
  console.log('🗄️ To use with real database:');
  console.log('   • Set up MongoDB Atlas or local MongoDB');
  console.log('   • Update environment variables in services/api/.env');
  console.log('   • Run: cd services/api && npm run dev');
  console.log('');
  console.log('🌐 Frontend available at: http://localhost:3000');
  console.log('   • Run: cd web && npm start');
});
