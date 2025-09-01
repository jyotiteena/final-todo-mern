const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/project.route');
const todoRoutes = require('./routes/todo.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});