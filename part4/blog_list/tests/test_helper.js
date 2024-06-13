const Blog = require('../models/blog')

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

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Will delete soon',
        author: ' ',
        url: ' ',
    })
    await blog.save()
    await blog.deleteOne()

    return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}