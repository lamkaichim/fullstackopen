// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs'); // 引入路由
const config = require('./utils/config'); // 引入配置
const logger = require('./utils/logger'); // 引入日志工具
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

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
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter); // 注册路由
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app;
