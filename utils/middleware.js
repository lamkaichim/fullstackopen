const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const auth = request.get('Authorization')

    if (auth && auth.startsWith('Bearer ')) {
        request.token = auth.replace('Bearer ', '') // 🟢 提取 token 并存入 request.token
    } else {
        request.token = null // 🟢 如果没有令牌，设为 null
    }

    next() // 继续执行下一个中间件
}

const userExtractor = async (request, response, next) => {
    const token = request.token // 🟢 由 `tokenExtractor` 提供
    
    if (!token) {
        return response.status(401).json({ error: '未认证的用户' }) // ✅ 这里改成 "未认证的用户"
    }
    let decodedToken
    try {
        if (token) {
            decodedToken = jwt.verify(token, process.env.SECRET)
        }
    } catch (error) {
        console.error('JWT Error:', error.message)
        return response.status(401).json({ error: '无效的令牌' })
    }

    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: '令牌无效或已过期' })
    }

    // 🟢 查找用户并存入 `request.user`
    request.user = await User.findById(decodedToken.id)
    if (!request.user) {
        return response.status(400).json({ error: '用户不存在' })
    }

    next()
}

module.exports = {
    tokenExtractor, userExtractor
}
