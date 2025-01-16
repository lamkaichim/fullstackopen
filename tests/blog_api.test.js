const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); // 确保路径指向你的 Express 应用
const Blog = require('../models/blog'); // 确保路径指向你的 Blog 模型

const api = supertest(app);

const initialBlogs = [
    {
        title: 'First Blog',
        author: 'Author 1',
        url: 'http://example.com/1',
        likes: 5,
    },
    {
        title: 'Second Blog',
        author: 'Author 2',
        url: 'http://example.com/2',
        likes: 10,
    },
];

// 每次测试前清空数据库并插入初始数据
beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
});

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;

    blogs.forEach(blog => {
        expect(blog.id).toBeDefined(); // 确保 id 存在
        expect(blog._id).toBeUndefined(); // 确保 _id 不存在
    });
});

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'A New Blog',
        author: 'Test Author',
        url: 'http://testblog.com/new',
        likes: 15,
    };

    // 发送 POST 请求
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // 确保返回 201 Created
        .expect('Content-Type', /application\/json/);

    // 验证数据库中的博客总数是否增加了 1
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length + 1);

    // 验证新博客是否正确保存
    const titles = response.body.map(blog => blog.title);
    expect(titles).toContain('A New Blog');
});

test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
        title: 'Blog Without Likes',
        author: 'Test Author',
        url: 'http://testblog.com/nolikes',
    };

    // 发送 POST 请求
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201) // 确保返回状态码 201 Created
        .expect('Content-Type', /application\/json/);

    // 验证返回的博客对象中 likes 属性默认值为 0
    expect(response.body.likes).toBe(0);
});
test('blog without title is not added', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'http://testblog.com/notitle',
        likes: 10,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400); // 验证返回状态码为 400

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length); // 验证博客数量未增加
});

test('blog without url is not added', async () => {
    const newBlog = {
        title: 'Blog Without URL',
        author: 'Test Author',
        likes: 10,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400); // 验证返回状态码为 400

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length); // 验证博客数量未增加
});

test('a blog can be deleted', async () => {
    // 获取初始博客列表中的第一个博客的 ID
    const responseAtStart = await api.get('/api/blogs');
    const blogToDelete = responseAtStart.body[0];

    // 发送 DELETE 请求
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204); // 验证返回状态码为 204

    // 验证博客总数减少
    const responseAtEnd = await api.get('/api/blogs');
    expect(responseAtEnd.body).toHaveLength(responseAtStart.body.length - 1);

    // 验证已删除的博客不存在于数据库中
    const titles = responseAtEnd.body.map(blog => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
});

test('a blog\'s likes can be updated', async () => {
    // 获取初始博客
    const responseAtStart = await api.get('/api/blogs');
    const blogToUpdate = responseAtStart.body[0];

    const updatedData = { likes: blogToUpdate.likes + 10 }; // 增加点赞数

    // 发送 PUT 请求
    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedData)
        .expect(200) // 验证返回状态码为 200 OK
        .expect('Content-Type', /application\/json/); // 验证返回内容为 JSON 格式

    // 验证更新的内容
    expect(response.body.likes).toBe(blogToUpdate.likes + 10);

    // 验证数据库中内容已更新
    const responseAtEnd = await api.get('/api/blogs');
    const updatedBlog = responseAtEnd.body.find(blog => blog.id === blogToUpdate.id);
    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 10);
});


// 测试结束后关闭数据库连接
afterAll(async () => {
    await mongoose.connection.close();
});
