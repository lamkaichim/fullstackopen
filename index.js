// index.js
const http = require('http');
const app = require('./app'); // 引入实际的 Express 应用
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
