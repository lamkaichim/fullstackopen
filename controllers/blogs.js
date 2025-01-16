const express = require('express');
const Blog = require('../models/blog');

const blogsRouter = express.Router();

blogsRouter.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500).send({ error: 'Something went wrong' });
    }
});

blogsRouter.post('/', async (req,res)=>{
    try{
        const body=req.body
        if(!body.title || !body.url){
            return res.status(400).json({error : 'Title and URL are required'})
        }

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes || 0,
        })

        const savedBlog = await blog.save()
        res.status(201).json(savedBlog)
    } catch (error){
        res.status(500).json({error: 'something went wrong whiile saving the blog'})
    }
})

module.exports = blogsRouter;
