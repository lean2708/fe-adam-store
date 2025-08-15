import { Page } from '@playwright/test';

/**
 * Mock admin dashboard API responses
 */
export async function mockAdminDashboardAPIs(page: Page) {
  // Mock ALL API calls to prevent real network requests
  await page.route('**/v1/**', async route => {
    const url = route.request().url();

    if (url.includes('/v1/admin/statistics/orders/summary')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 200,
          result: {
            totalOrders: 150,
            totalRevenue: 50000000,
            pendingOrders: 25,
            completedOrders: 125
          }
        })
      });
    } else if (url.includes('/v1/admin/statistics/revenues/monthly')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 200,
          result: [
            { month: 1, year: 2024, totalAmount: 10000000 },
            { month: 2, year: 2024, totalAmount: 15000000 },
            { month: 3, year: 2024, totalAmount: 25000000 },
            { month: 4, year: 2024, totalAmount: 20000000 }
          ]
        })
      });
    } else if (url.includes('/v1/admin/statistics/products/top-selling')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 200,
          result: [
            {
              productId: 1,
              productName: 'Premium T-Shirt',
              totalSold: 100,
              status: 'ACTIVE',
              revenue: 5000000
            },
            {
              productId: 2,
              productName: 'Classic Jeans',
              totalSold: 85,
              status: 'ACTIVE',
              revenue: 4250000
            },
            {
              productId: 3,
              productName: 'Summer Dress',
              totalSold: 70,
              status: 'ACTIVE',
              revenue: 3500000
            }
          ]
        })
      });
    } else if (url.includes('/v1/admin/orders/search')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 200,
          result: {
            items: [
              {
                id: 1,
                totalPrice: 500000,
                orderDate: '2024-01-15T10:30:00Z',
                status: 'COMPLETED',
                customer: {
                  name: 'John Doe',
                  email: 'john@test.com',
                  avatarUrl: null
                }
              },
              {
                id: 2,
                totalPrice: 750000,
                orderDate: '2024-01-14T15:45:00Z',
                status: 'PENDING',
                customer: {
                  name: 'Jane Smith',
                  email: 'jane@test.com',
                  avatarUrl: null
                }
              }
            ],
            totalElements: 2,
            totalPages: 1
          }
        })
      });
    } else {
      // Default mock for any other API calls
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 200,
          result: {}
        })
      });
    }
  });
}

/**
 * Mock API errors for testing error states
 */
export async function mockAPIErrors(page: Page) {
  await page.route('**/v1/**', async route => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 500,
        message: 'Internal server error'
      })
    });
  });
}

/**
 * Mock slow API responses for testing loading states
 */
export async function mockSlowAPIs(page: Page, delayMs: number = 2000) {
  await page.route('**/v1/**', async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 200,
        result: {}
      })
    });
  });
}
