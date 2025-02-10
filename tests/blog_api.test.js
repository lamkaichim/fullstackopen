const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

let token = '' // 🟢 用于存储 `token`

beforeAll(async () => {
    await User.deleteMany({})

    // 🟢 创建测试用户
    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'mypassword'
    }

    await api.post('/api/users').send(newUser)

    // 🟢 登录获取 `token`
    const loginRes = await api.post('/api/login').send({
        username: 'testuser',
        password: 'mypassword'
    })
    token = loginRes.body.token // 🟢 保存 token
})

beforeEach(async () => {
    await Blog.deleteMany({})
})

describe('添加博客的测试', () => {
    test('成功添加博客（带有效 token）', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Alice',
            url: 'https://testblog.com',
            likes: 10
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // 🟢 发送 token
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.title).toBe(newBlog.title)

        const blogsAfter = await Blog.find({})
        expect(blogsAfter).toHaveLength(1)
    })

    test('失败（无 token），返回 401 Unauthorized', async () => {
        const newBlog = {
            title: 'Unauthorized Blog',
            author: 'Bob',
            url: 'https://unauthorized.com',
            likes: 5
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401) // 🟢 确保返回 401 Unauthorized

        expect(response.body.error).toBe('未认证的用户')

        const blogsAfter = await Blog.find({})
        expect(blogsAfter).toHaveLength(0) // 🟢 确保数据库里没有新博客
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
