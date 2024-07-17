const { test, expect, beforeEach, describe, request } = require('@playwright/test');
const { before } = require('node:test');

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

    describe('When there are many blogs saved', () => {
      beforeEach(async ({ page }) => {
        // Create 3 blogs

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('title example')
        await page.getByTestId('author').fill('author example')
        await page.getByTestId('url').fill('url example')
        await page.getByRole('button', { name: 'create' }).click()

        // wait for the create blog button to be displayed, which means creation is complete
        await page.waitForTimeout(1000)
        await page.getByText('create new blog').waitFor({ timeout: 60000 })

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('title example 2')
        await page.getByTestId('author').fill('author example 2')
        await page.getByTestId('url').fill('url example 2')
        await page.getByRole('button', { name: 'create' }).click()

        // wait for the create blog button to be displayed, which means creation is complete
        await page.waitForTimeout(1000)
        await page.getByText('create new blog').waitFor({ timeout: 60000 })

        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('title example 3')
        await page.getByTestId('author').fill('author example 3')
        await page.getByTestId('url').fill('url example 3')
        await page.getByRole('button', { name: 'create' }).click()

        // wait for the create blog button to be displayed, which means creation is complete
        await page.waitForTimeout(1000)
        await page.getByText('create new blog').waitFor({ timeout: 60000 })

        // Simulating likes
        async function clickAllViewButtons() {
          let viewButtons = await page.getByRole('button', { name: 'view' }).all();
          while (viewButtons.length > 0) {
            // Click the first button in the list
            await viewButtons[0].waitFor({ state: 'visible', timeout: 60000 }); // Increase timeout to 60 seconds
            await viewButtons[0].click();
        
            // Re-fetch the buttons after clicking
            viewButtons = await page.getByRole('button', { name: 'view' }).all();
          }
        }
        
        await clickAllViewButtons();
        
        const likeButtons = await page.getByRole('button', { name: 'like' }).all()
        // first blog has 3 likes
        await likeButtons[0].click()
        await likeButtons[0].click()
        await likeButtons[0].click()

        // 2nd blog has 1 likes
        await likeButtons[1].click()
        
        // 3d blog has 2 likes
        await likeButtons[2].click()
        await likeButtons[2].click()

        await page.waitForTimeout(1000)
      })

      test('blogs are in desc order by likes', async ({ page }) => {
        // reload the page so the blogs will be in the correct order
        await page.goto('/')
        await page.waitForTimeout(1000)

        const blogs = await page.locator('.blog').all()
        
        expect(await blogs[0].locator('[data-testid="title and author"]').textContent()).toBe('title example author example')
        expect(await blogs[1].locator('[data-testid="title and author"]').textContent()).toBe('title example 3 author example 3')
        expect(await blogs[2].locator('[data-testid="title and author"]').textContent()).toBe('title example 2 author example 2')
      })
    })
  })
})