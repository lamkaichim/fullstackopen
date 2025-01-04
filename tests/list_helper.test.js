const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

describe('most likes', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Blog 1',
      author: 'Robert C. Martin',
      url: 'http://example.com/1',
      likes: 5,
      __v: 0,
    },
    {
      _id: '2',
      title: 'Blog 2',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com/2',
      likes: 7,
      __v: 0,
    },
    {
      _id: '3',
      title: 'Blog 3',
      author: 'Robert C. Martin',
      url: 'http://example.com/3',
      likes: 2,
      __v: 0,
    },
    {
      _id: '4',
      title: 'Blog 4',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com/4',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5',
      title: 'Blog 5',
      author: 'Robert C. Martin',
      url: 'http://example.com/5',
      likes: 1,
      __v: 0,
    },
  ];

  const emptyBlogs = [];

  test('when list is empty, return null', () => {
    const result = listHelper.mostLikes(emptyBlogs);
    assert.strictEqual(result, null); // 空列表应返回 null
  });

  test('when list has blogs, return the author with most likes', () => {
    const result = listHelper.mostLikes(blogs);
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    };

    assert.deepStrictEqual(result, expected); // 比较返回的对象值是否一致
  });
});
