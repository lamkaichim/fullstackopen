const express = require('express')
const Blog = require('../models/blog')
const User = require('../models/user') 
const jwt = require('jsonwebtoken')  

const blogsRouter = express.Router()

// 🟢 获取 Token 的方法
const getTokenFrom = (req) => {
    const auth = req.get('Authorization')
    if (auth && auth.startsWith('Bearer ')) {
        return auth.substring(7) // 直接去掉 "Bearer "
    }
    return null
}

// 🟢 获取所有博客
blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
        res.json(blogs)
    } catch (error) {
        console.error('Error fetching blogs:', error.message)
        res.status(500).json({ error: '无法获取博客' })
    }
})

blogsRouter.post('/', async (req, res) => {
    const { title, author, url, likes } = req.body
    const user = req.user // 🟢 直接从 `request.user` 获取用户

    // 🟢 用户必须存在
    if (!user) {
        return res.status(401).json({ error: '未认证的用户' })
    }

    // 创建新博客
    const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: user._id // 🟢 直接使用 `user._id`
    })

    const savedBlog = await blog.save()

    // 关联博客到用户
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
})


blogsRouter.delete('/:id', async (req, res) => {
    const user = req.user // 🟢 直接从 `request.user` 获取用户
    if (!user) {
        return res.status(401).json({ error: '未认证的用户' })
    }

    // 查找要删除的博客
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        return res.status(404).json({ error: '博客未找到' })
    }

    // 🟢 仅博客创建者可删除
    if (blog.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: '无权限删除此博客' }) // 403 Forbidden
    }

    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
})



// 🟢 更新博客（仅允许修改点赞数）
blogsRouter.put('/:id', async (req, res) => {
    const { likes } = req.body

    if (!likes || typeof likes !== 'number') {
        return res.status(400).json({ error: '点赞数必须是一个数字' })
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { likes },
            { new: true, runValidators: true }
        )

        if (!updatedBlog) {
            return res.status(404).json({ error: '博客未找到' })
        }

        res.json(updatedBlog)
    } catch (error) {
        console.error('Error updating blog:', error.message)
        res.status(400).json({ error: '更新博客时出错' })
    }
})

module.exports = blogsRouter
        