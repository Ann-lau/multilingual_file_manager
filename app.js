const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const multer = require('multer');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB Connection mongoose.connect('mongodb://localhost/myfilemanager', {
useNewUrlParser: true,
useUnifiedTopology: true,
});

// Redis Connection
const redisClient = redis.createClient({
host: process.env.REDIS_HOST || 'localhost',
port: process.env.REDIS_PORT || 6379, });
app.use(express.json());

// File Upload Configuration
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/'); },
filename: function (req, file, cb) {
cb(null, Date.now() + '-' + file.originalname);
},
});
const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));
// Routes
app.use('/files', fileRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
