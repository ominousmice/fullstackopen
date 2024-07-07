import { useState } from 'react'

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  if (showDetails) {
    return (
      <div style={blogStyle}>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetails}>hide</button>
        <br></br>{blog.url}
        <br></br>{blog.likes} <button>like</button>
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