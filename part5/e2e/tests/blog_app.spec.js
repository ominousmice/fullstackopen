const { test, expect, beforeEach, describe, request } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    const apiRequest = await request.newContext();
    await apiRequest.post('/api/testing/reset')
    await apiRequest.post('/api/users', {
      data: {
        name: 'Test User',
        username: 'test-user',
        password: 'test-password'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.locator('.login-form')).toBeVisible();
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('test-user')
      await page.getByTestId('password').fill('test-password')
      await page.getByRole('button', { name: 'login' }).click()

      // wait for the log out button to be displayed, which means log in is complete
      await page.getByText('logout').waitFor()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      page.getByTestId('username').fill('test-user')
      page.getByTestId('password').fill('wrong-password')
      page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })
})