const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  // 使用 Lodash 按作者分组并统计博客数
  const authorCounts = _.countBy(blogs, 'author');
  const topAuthor = _.maxBy(Object.entries(authorCounts), ([, count]) => count);

  return {
    author: topAuthor[0],
    blogs: topAuthor[1],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
