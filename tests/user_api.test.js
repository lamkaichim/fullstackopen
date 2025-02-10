const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // 确保引入你的 Express 服务器
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({}) // 清空数据库
})

describe('创建用户 API 测试', () => {
  test('成功创建用户', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'mypassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.username).toBe(newUser.username)

    const users = await User.find({})
    expect(users).toHaveLength(1)
  })

  test('拒绝创建用户名太短的用户', async () => {
    const newUser = {
      username: 'ab',
      name: 'Test User',
      password: 'mypassword'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('用户名和密码必须至少3个字符长')
  })

  test('拒绝创建密码太短的用户', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Test User',
      password: '12'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(response.body.error).toBe('用户名和密码必须至少3个字符长')
  })

  test('拒绝创建重复用户名的用户', async () => {
    const existingUser = {
      username: 'uniqueuser',
      name: 'User One',
      password: 'securepassword'
    }

    await api.post('/api/users').send(existingUser)

    const duplicateUser = {
      username: 'uniqueuser',
      name: 'User Two',
      password: 'anotherpassword'
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    expect(response.body.error).toBe('用户名已存在，请选择其他用户名')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
