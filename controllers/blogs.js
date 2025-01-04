// controllers/blogs.js
const express = require('express');
const Blog = require('../models/blog'); // 引入 Blog 模型

const blogsRouter = express.Router();

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  });
});

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then(result => {
    response.status(201).json(result);
  });
});

module.exports = blogsRouter;
