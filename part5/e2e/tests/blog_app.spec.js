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
    await apiRequest.post('/api/users', {
      data: {
        name: 'Test User 2',
        username: 'test-user-2',
        password: 'test-password-2'
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
      await page.getByTestId('logout-button').waitFor({ timeout: 60000 })

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('test-user')
      await page.getByTestId('password').fill('wrong-password')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('test-user')
      await page.getByTestId('password').fill('test-password')
      await page.getByRole('button', { name: 'login' }).click()

      // wait for the log out button to be displayed, which means log in is complete
      await page.getByTestId('logout-button').waitFor({ timeout: 60000 })

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByTestId('title').fill('title example')
      await page.getByTestId('author').fill('author example')
      await page.getByTestId('url').fill('url example')
      await page.getByRole('button', { name: 'create' }).click()

      // wait for the create blog button to be displayed, which means creation is complete
      await page.getByText('create new blog').waitFor({ timeout: 60000 })

      await expect(page.getByText('title example author example')).toBeVisible()
    })

    describe('When there is a blog saved', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('title example')
        await page.getByTestId('author').fill('author example')
        await page.getByTestId('url').fill('url example')
        await page.getByRole('button', { name: 'create' }).click()

        // wait for the create blog button to be displayed, which means creation is complete
        await page.getByText('create new blog').waitFor({ timeout: 60000 })
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.getByText('1')).toBeVisible()
      })

      test('blog owner can delete blog', async ({ page }) => {
        // Delete the blog
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

        page.on('dialog', async dialog => {
          await dialog.accept(); // Accept the dialog
        });

        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByText('title example author example')).not.toBeVisible()
      })

      test('if not blog owner, cannot delete blog', async ({ page }) => {
        // Log out
        await page.getByRole('button', { name: 'logout' }).click()

        // Log in as Test User 2
        await page.getByTestId('username').fill('test-user-2')
        await page.getByTestId('password').fill('test-password-2')
        await page.getByRole('button', { name: 'login' }).click()

        // wait for the log out button to be displayed, which means log in is complete
        await page.getByTestId('logout-button').waitFor({ timeout: 60000 })

        // Fail to delete the blog
        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })
    })
  })
})