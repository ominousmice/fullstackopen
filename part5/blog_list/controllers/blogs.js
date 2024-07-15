const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { usersInDb } = require('../tests/test_helper')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { blogs: 0 })
    // { blogs: 0} is how you exclude the blogs property of the user from being shown
    return response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).send({ error: "blog doesn't exist" })
    }
    
    return response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: request.user.id
    })

    if (!blog.title || !blog.url) {
        return response.status(400).send({ error: 'title and url required' })
    }

    const savedBlog = await blog.save()

    request.user.blogs = request.user.blogs.concat(savedBlog.id)
    await request.user.save()
    
    return response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if ( blog.user.toString() === request.user._id.toString() ) {
        await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).end()
    }

    return response.status(401).json({ error: 'invalid user' })
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const newInfo = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newInfo, { new: true })
    return response.json(updatedBlog)
})

module.exports = blogsRouter