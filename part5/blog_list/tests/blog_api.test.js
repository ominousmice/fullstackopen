const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

// Command to run tests: npm test -- tests/blog_api.test.js

describe('when there are some blogs saved initially', () => {
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

    describe('retrieving a specific blog', () => {
        test('get a valid blog', async () => {
            const blogs = await helper.blogsInDb()
            const id = blogs[0].id

            await api
                .get('/api/blogs/' + id)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(helper.initialBlogs[0].title, blogs[0].title)
            assert.strictEqual(helper.initialBlogs[0].author, blogs[0].author)
            assert.strictEqual(helper.initialBlogs[0].url, blogs[0].url)
            assert.strictEqual(helper.initialBlogs[0].likes, blogs[0].likes)
        })

        test('404 if the blog does not exist', async () => {
            const id = await helper.nonExistingId()
            
            await api
                .get('/api/blogs/' + id)
                .expect(404)
        })
    })

    describe('adding a new blog', () => {
        test('a valid blog can be added ', async () => {
            const newBlog = {
                title: 'Writing prompts',
                author: 'Reba Johnson',
                url: 'www.writingprompts.com',
                likes: 470,
            }

            const user = {
                username: 'root',
                password: 'secret'
            }

            const loginResponse = await api
                .post('/api/login')
                .send(user)

            const authorization = 'Bearer ' + loginResponse.body.token

            await api
                .post('/api/blogs')
                .set('Authorization', authorization)
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
            const newBlog = {
                title: 'Cocktail recipes',
                author: 'Pepito Juarez',
                url: 'www.cocktailrecipes.com',
            }

            const user = {
                username: 'root',
                password: 'secret'
            }

            const loginResponse = await api
                .post('/api/login')
                .send(user)

            const authorization = 'Bearer ' + loginResponse.body.token

            const response = await api
                .post('/api/blogs')
                .set('Authorization', authorization)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const newBlogId = response.body.id
            const retrievedBlog = await Blog.findById(newBlogId)

            assert.strictEqual(retrievedBlog.likes, 0)
        })

        test('missing title gets 400 bad request', async () => {
            const newBlog = {
                author: 'Someone',
                url: 'www.something.com',
            }

            const user = {
                username: 'root',
                password: 'secret'
            }

            const loginResponse = await api
                .post('/api/login')
                .send(user)

            const authorization = 'Bearer ' + loginResponse.body.token

            await api
                .post('/api/blogs')
                .set('Authorization', authorization)
                .send(newBlog)
                .expect(400)
        })

        test('missing url gets 400 bad request', async () => {
            const newBlog = {
                title: 'Something',
                author: 'Someone'
            }

            const user = {
                username: 'root',
                password: 'secret'
            }

            const loginResponse = await api
                .post('/api/login')
                .send(user)

            const authorization = 'Bearer ' + loginResponse.body.token

            await api
                .post('/api/blogs')
                .set('Authorization', authorization)
                .send(newBlog)
                .expect(400)
        })
    })

    describe('deleting a blog', () => {
        test('delete blog returns 204', async () => {
            // First we create the blog we will delete
            const newBlog = {
                title: 'Writing prompts',
                author: 'Reba Johnson',
                url: 'www.writingprompts.com',
                likes: 470,
            }

            const user = {
                username: 'root',
                password: 'secret'
            }

            const loginResponse = await api
                .post('/api/login')
                .send(user)

            const authorization = 'Bearer ' + loginResponse.body.token

            const postResponse = await api
                .post('/api/blogs')
                .set('Authorization', authorization)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const id = postResponse.body.id

            await api
                .delete('/api/blogs/' + id)
                .set('Authorization', authorization)
                .expect(204)
        })
    })

    describe('updating a blog', () => {
        test('updates blog correctly', async () => {
            const blogs = await helper.blogsInDb()

            const id = blogs[0].id

            const updatedInfo = {
                title: 'New Title',
                likes: 140,
            }

            await api
                .put('/api/blogs/' + id)
                .send(updatedInfo)
                .expect(200)

            const updatedBlog = await Blog.findById(id)

            console.log(updatedBlog)

            assert.strictEqual(updatedBlog.title, 'New Title')
            assert.strictEqual(updatedBlog.likes, 140)
        })
    })
})

after(async () => {
  await mongoose.connection.close()
})