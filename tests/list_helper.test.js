const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 7,
      __v: 0,
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://example.com/2',
      likes: 10,
      __v: 0,
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://example.com/3',
      likes: 5,
      __v: 0,
    },
  ];

  const emptyBlogs = [];

  test('when list is empty, return null', () => {
    const result = listHelper.favoriteBlog(emptyBlogs);
    assert.strictEqual(result, null); // 空列表应该返回 null
  });

  test('when list has blogs, return the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    const expected = {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 10,
    };

    assert.deepStrictEqual(result, expected); // 比较对象值是否一致
  });
});
