import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

test('renders title and author, but not details', () => {
  const blog = {
    title: 'On being a nun',
    author: 'Lola Dolores',
    url: 'www.onbeinganun.com',
    likes: 12
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('On being a nun')
  expect(div).toHaveTextContent('Lola Dolores')
  expect(div).not.toHaveTextContent('www.onbeinganun.com')
  expect(div).not.toHaveTextContent('12')
})

test('clicking the button shows the details', async () => {
  const blog = {
    title: 'On being a nun',
    author: 'Lola Dolores',
    url: 'www.onbeinganun.com',
    likes: 12,
    user: { username: 'blogCreator' }
  }

  const test_user = {
    username: 'testUser',
    password: 'testPassword',
    name: 'test user\'s name'
  }

  const { container } = render(<Blog blog={blog} user={test_user}/>)

  const div = container.querySelector('.blog')

  const user = userEvent.setup()
  const button = div.querySelector('button')
  await user.click(button)

  expect(div).toHaveTextContent('www.onbeinganun.com')
  expect(div).toHaveTextContent('12')
})