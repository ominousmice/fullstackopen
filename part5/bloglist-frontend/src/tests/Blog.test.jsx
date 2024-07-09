import { render, screen } from '@testing-library/react'
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