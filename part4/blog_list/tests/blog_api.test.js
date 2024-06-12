const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'Discovering Asia',
        author: 'Lisa Farwell',
        url: 'www.discoveringasia.com',
        likes: 244,
    },
    {
        title: 'Computer Science Tutorials',
        author: 'Zari Gupta',
        url: 'www.computersciencetutorials.com',
        likes: 1535,
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
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

    assert.strictEqual(response.body.length, initialBlogs.length)
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

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    const authors = response.body.map(r => r.author)
    const urls = response.body.map(r => r.url)
    const likes = response.body.map(r => r.likes)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes('Writing prompts'))
    assert(authors.includes('Reba Johnson'))
    assert(urls.includes('www.writingprompts.com'))
    assert(likes.includes(470))
})

after(async () => {
  await mongoose.connection.close()
})