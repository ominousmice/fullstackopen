const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        assert(blog.id !== undefined)
        assert.strictEqual(blog._id, undefined)
    });
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Writing prompts',
        author: 'Reba Johnson',
        url: 'www.writingprompts.com',
        likes: 470,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(r => r.title)
    const authors = blogsAtEnd.map(r => r.author)
    const urls = blogsAtEnd.map(r => r.url)
    const likes = blogsAtEnd.map(r => r.likes)

    assert(titles.includes('Writing prompts'))
    assert(authors.includes('Reba Johnson'))
    assert(urls.includes('www.writingprompts.com'))
    assert(likes.includes(470))
})

test('missing likes defaults to 0', async () => {
    const newBlogId = await helper.nonExistingId()

    const newBlog = {
        title: 'Cocktail recipes',
        author: 'Pepito Juarez',
        url: 'www.cocktailrecipes.com',
        _id: newBlogId,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    
    const retrievedBlog = blogs.find(blog => blog.id === newBlogId)

    assert.strictEqual(retrievedBlog.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})