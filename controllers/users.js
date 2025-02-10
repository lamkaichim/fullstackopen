const bcrypt = require('bcryptjs') // 如果使用 bcryptjs，则改为 require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// 获取所有用户
// 获取所有用户，并显示其创建的博客
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 }) // 仅返回博客的 title, author, url
  res.json(users)
})

// 创建新用户
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码是必填项' })
  }

  // 验证用户名和密码的最小长度
  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: '用户名和密码必须至少3个字符长' })
  }

  // 检查用户名是否唯一
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: '用户名已存在，请选择其他用户名' })
  }
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
