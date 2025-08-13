import { test, expect } from '@playwright/test';
import { authenticateRealAdmin } from './helpers/auth';

test.describe('Admin Routes Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Use environment-based authentication (no hardcoded credentials)
    const authResult = await authenticateRealAdmin(page);

    if (!authResult.success) {
      throw new Error(`Authentication failed: ${authResult.error}`);
    }

    const roles = Array.isArray(authResult.session?.user.roles)
      ? authResult.session.user.roles.map((r: { name: string }) => r.name).join(', ')
      : 'Unknown roles';
    console.log(`Authenticated as: ${authResult.session?.user.email} with roles: ${roles}`);
  });

  test('should access admin dashboard', async ({ page }) => {
    await page.goto('/en/admin');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin/);
    await page.waitForLoadState('networkidle');

    // Check for admin dashboard elements
    await expect(page.locator('h1, h2, [data-testid="admin-dashboard"]')).toBeVisible({ timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
  });

  test('should access admin products page', async ({ page }) => {
    await page.goto('/en/admin/products');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin\/products/);
    await page.waitForLoadState('networkidle');

    // Log what's actually rendered
    const pageContent = await page.evaluate(() => {
      const productElements = document.querySelectorAll('table tbody tr, [class*="ProductVariantsTable"], [class*="product-card"]');

      return {
        userCount: productElements.length,
        list: Array.from(productElements).map(el => el.textContent?.substring(0, 100))
      };
    });

    console.log('Products loaded:', JSON.stringify(pageContent, null, 2));

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-products.png', fullPage: true });
  });

  test('should access admin users page', async ({ page }) => {
    await page.goto('/en/admin/users');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin\/users/);
    await page.waitForLoadState('networkidle');

    // Check for users management elements
    const hasUsersContent = await page.evaluate(() => {
      const userElements = document.querySelectorAll('table tbody tr, [class*="UserTable"], [class*="user-card"]');
      return {
        userCount: userElements.length,
        list: Array.from(userElements).map(el => el.textContent?.substring(0, 100))
      };
    });
    console.log('Users page content:', hasUsersContent);

    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-users.png', fullPage: true });
  });

  test('should access admin orders page', async ({ page }) => {
    await page.goto('/en/admin/orders');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin\/orders/);
    await page.waitForLoadState('networkidle');

    // Set currentPage state to page 1 (if pagination exists)
    const page2Button = page.locator('li[data-slot="pagination-item"] button[data-slot="button"]', {
      hasText: /^2$/
    });
    if (await page2Button.isVisible()) {
      await page2Button.click();
      console.log('✅ Clicked page 2 button');
    } else {
      console.log('⚠️ Page 2 button not found or not visible');
    }


    // Check for orders management elements
    await page.waitForSelector(
      'table tbody tr, [class*="OrderTable"], [class*="order-card"]',
      { state: 'visible', timeout: 5000 }
    );

    // Check for orders content
    const hasOrdersContent = await page.evaluate(() => {
      const orderElements = document.querySelectorAll(
        'table tbody tr, [class*="OrderTable"], [class*="order-card"]'
      );
      return {
        userCount: orderElements.length,
        currentPage:
          Array.from(document.querySelectorAll('button'))
            .find(btn => btn.className.includes('variant-default') || btn.className.includes('bg-primary'))
            ?.textContent || 'unknown',
        list: Array.from(orderElements).map(el =>
          el.textContent?.substring(0, 100)
        )
      };
    });

    console.log('Orders page content:', hasOrdersContent);

    await page.screenshot({ path: 'test-results/admin-orders.png', fullPage: true });
  });

  test('should access admin categories page', async ({ page }) => {
    await page.goto('/en/admin/categories');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin\/categories/);
    await page.waitForLoadState('networkidle');

    // Check for categories management elements
    const hasCategoriesContent = await page.evaluate(() => {
      const categoryElements = document.querySelectorAll('table tbody tr, [class*="CategoryTable"], [class*="category-card"]');
      return {
        userCount: categoryElements.length,
        list: Array.from(categoryElements).map(el => el.textContent?.substring(0, 100))
      };
    });

    console.log('Categories page content:', hasCategoriesContent);

    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-categories.png', fullPage: true });
  });

  test('should access admin chat page', async ({ page }) => {
    await page.goto('/en/admin/chat');

    // Wait for the page to load
    await expect(page).toHaveURL(/.*\/admin\/chat/);
    await page.waitForLoadState('networkidle');

    // Check for chat interface elements
    const hasChatContent = await page.evaluate(() => {
      const chatElements = document.querySelectorAll('[class*="chat"], [class*="Chat"], [class*="conversation"], [class*="Conversation"], input[type="text"], textarea');
      return {
        userCount: chatElements.length,
        list: Array.from(chatElements).map(el => el.textContent?.substring(0, 100))
      };
    });

    console.log('Chat page content:', hasChatContent);

    // Take screenshot
    await page.screenshot({ path: 'test-results/admin-chat.png', fullPage: true });
  });
});
