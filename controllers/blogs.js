const express = require('express');
const Blog = require('../models/blog');
const mongoose = require('mongoose');


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


// 路由中打印调试信息
blogsRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Attempting to delete blog with ID: ${id}`);

        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            console.log('Blog not found');
            return res.status(404).json({ error: 'Blog not found' });
        }

        console.log('Blog deleted successfully');
        res.status(204).end();
    } catch (error) {
        console.error('Error deleting blog:', error.message);
        res.status(400).json({ error: 'Invalid blog ID' });
    }
});

blogsRouter.put('/:id', async (req,res) => {
    try{
        const {id}= req.params
        const {likes} = req.body
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({error: 'Invalid blog ID format'})
        }
        const updateBlog = await Blog.findByIdAndUpdate(
            id,
            {likes},
            {new:true, runValidators:true}
        )

        if(!updateBlog){
            return res.status(404).json({error:'Blog not found'}
            )
        }
        res.json(updateBlog)
    }catch (error){
        console.error('Error updating blog:', error.message)
        res.status(400).json({error: 'An error occurred while updating the blog'})
    }
})

module.exports = blogsRouter;
