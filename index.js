// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs'); // 引入路由
const config = require('./utils/config'); // 引入配置
const logger = require('./utils/logger'); // 引入日志工具

const app = express();

mongoose.connect(config.MONGO_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogsRouter); // 注册路由

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
