import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormTogglableRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      // sort blogs from most liked to least liked
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sortedBlogs)
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      setUser(user)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLougout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreateBlog = (newBlog) => {
    try {
      blogFormTogglableRef.current.toggleVisibility()

      blogService.create(newBlog)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))

          setSuccessMessage(`A new blog ${returnedBlog.title} by ${returnedBlog.author} created`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)

        })
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleDeleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification.SuccessMessage message={successMessage}/>
        <Notification.ErrorMessage message={errorMessage}/>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>Blogs</h2>
      <Notification.SuccessMessage message={successMessage}/>
      <Notification.ErrorMessage message={errorMessage}/>
      <p>{user.name} logged in</p>
      <button onClick={handleLougout}>logout</button>

      <Togglable buttonLabel='create new blog' ref={blogFormTogglableRef}>
        <BlogForm createBlog={handleCreateBlog}/>
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} onDelete={handleDeleteBlog}/>
      )}
    </div>
  )
}

export default App