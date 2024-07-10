import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('Form calls event handler with right details', async () => {
  const newBlog = {
    title: 'On being a nun',
    author: 'Lola Dolores',
    url: 'www.onbeinganun.com'
  }

  const mockHandler = vi.fn()
  const { container } = render(<BlogForm createBlog={mockHandler}></BlogForm>)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('url')

  const button = container.querySelector('button')

  const user = userEvent.setup()
  await userEvent.type(titleInput, newBlog.title)
  await userEvent.type(authorInput, newBlog.author)
  await userEvent.type(urlInput, newBlog.url)
  await userEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})