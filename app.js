// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs'); // 引入路由
const config = require('./utils/config'); // 引入配置
const logger = require('./utils/logger'); // 引入日志工具

const app = express();

// 连接到 MongoDB
mongoose.connect(config.MONGO_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

// 使用中间件
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter); // 注册路由

module.exports = app;
