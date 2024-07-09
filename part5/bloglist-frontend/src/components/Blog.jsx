import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, user, onDelete, onLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = () => {
    if (onLike) {
      onLike()
    } else {
      const updatedLikes = {
        likes: blog.likes + 1
      }
      blogService.update(blog.id, updatedLikes)
      blog.likes += 1
      setLikes(likes + 1)
    }
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.deleteBlog(blog.id, user.token)
      onDelete(blog.id)
    }
  }

  if (showDetails) {
    if (user.username === blog.user.username) {
      return (
        <div style={blogStyle}>
          {blog.title} {blog.author}
          <button onClick={toggleShowDetails}>hide</button>
          <br></br>{blog.url}
          <br></br>{likes} <button onClick={handleLike}>like</button>
          <br></br>{blog.user.name}
          <br></br> <button onClick={handleDelete}>delete</button>
        </div>
      )
    }
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetails}>hide</button>
        <br></br>{blog.url}
        <br></br>{likes} <button onClick={handleLike}>like</button>
        <br></br>{blog.user.name}
      </div>
    )
  }
  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleShowDetails}>view</button>
    </div>
  )
}

export default Blog