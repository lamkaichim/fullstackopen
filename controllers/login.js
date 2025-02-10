const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  // 查找用户
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ error: '无效的用户名或密码' })
  }

  // 验证密码
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) {
    return res.status(401).json({ error: '无效的用户名或密码' })
  }

  // 生成 JWT 令牌
  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' }) // 令牌有效期 1 小时

  res.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
