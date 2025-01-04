const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper'); // 引入被测试模块

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ];

  const blogsList = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 10,
      __v: 0,
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://example.com/2',
      likes: 7,
      __v: 0,
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'Blog 3',
      author: 'Author 3',
      url: 'http://example.com/3',
      likes: 3,
      __v: 0,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5); // 只有一个博客，喜欢数应该是 5
  });

  test('when list has multiple blogs, equals the sum of likes', () => {
    const result = listHelper.totalLikes(blogsList);
    assert.strictEqual(result, 20); // 总喜欢数为 10 + 7 + 3 = 20
  });

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0); // 空数组喜欢数为 0
  });
});
