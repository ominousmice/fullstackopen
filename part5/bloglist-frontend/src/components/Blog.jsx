import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {
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
    const updatedLikes = {
      likes: blog.likes + 1
    }
    blogService.update(blog.id, updatedLikes)
    blog.likes += 1
    setLikes(likes + 1)
  }

  if (showDetails) {
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
  <div style={blogStyle}>
    {blog.title} {blog.author}
    <button onClick={toggleShowDetails}>view</button>
  </div>  
)}

export default Blog