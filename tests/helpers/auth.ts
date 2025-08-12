import { Page } from '@playwright/test';
import { signInApi, getMyInfoApi } from '@/lib/data/auth';
import type { TokenResponse, UserResponse } from '@/api-client/models';

// Extend Window interface for test globals
declare global {
  interface Window {
    axios?: {
      defaults: {
        headers: {
          common: Record<string, string>;
        };
      };
    };
    __REAL_SESSION__?: unknown;
    __MOCK_SESSION__?: unknown;
  }
}


export interface RealAuthCredentials {
  email?: string;
  password?: string;
}

/**
 * Real authentication using your API client and admin credentials
 * Reads credentials from environment variables if not provided
 */
export async function authenticateRealAdmin(page: Page, credentials: RealAuthCredentials = {}) {
  // Get credentials from environment variables or use provided ones
  const email = credentials.email || process.env.TEST_ADMIN_EMAIL;
  const password = credentials.password || process.env.TEST_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Admin credentials not provided. Please set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables or pass credentials directly.'
    );
  }

  try {
    // Step 1: Get real tokens from your API
    const tokenResponse: TokenResponse = await signInApi({
      email,
      password,
    });

    if (!tokenResponse?.accessToken) {
      throw new Error('Failed to get access token from API');
    }

    // Step 2: Get user info using the access token
    const userInfo: UserResponse = await getMyInfoApi(tokenResponse.accessToken);

    if (!userInfo) {
      throw new Error('Failed to get user info from API');
    }

    // Step 3: Create session object matching NextAuth format
    const realSession = {
      user: {
        id: String(userInfo.id || 0),
        email: userInfo.email || email,
        name: userInfo.name || 'Admin User',
        roles: userInfo.roles || [{ name: 'ADMIN' }],
        accessToken: tokenResponse.accessToken,
        status: userInfo.status,
        avatarUrl: userInfo.avatarUrl,
        dob: userInfo.dob,
        gender: userInfo.gender,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
      accessToken: tokenResponse.accessToken,
    };

    // Step 4: Set up authentication in parallel
    await Promise.all([
      // Mock NextAuth session API
      page.route('**/api/auth/session', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(realSession)
        });
      }),

      // Set up browser storage and axios interceptors
      page.addInitScript((session) => {
        window.localStorage.setItem('next-auth.session-token', session.accessToken);

        if (window.axios) {
          window.axios.defaults.headers.common['Authorization'] = `Bearer ${session.accessToken}`;
        }

        window.__REAL_SESSION__ = session;
      }, realSession),

      // Store refresh token in httpOnly cookie if available
      ...(tokenResponse.refreshToken ? [
        page.context().addCookies([{
          name: 'refresh_token',
          value: tokenResponse.refreshToken,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax' as const,
          expires: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        }])
      ] : [])
    ]);

    return {
      success: true,
      session: realSession,
      tokens: {
        accessToken: tokenResponse.accessToken,
        refreshToken: tokenResponse.refreshToken
      }
    };

  } catch (error) {
    console.error('Real authentication failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

export interface MockUser {
  id: string;
  email: string;
  name: string;
  roles: Array<{ name: string }>;
  accessToken: string;
}

export interface MockSession {
  user: MockUser;
  accessToken: string;
}

/**
 * Mock an authenticated admin session for testing (fallback method)
 */
export async function mockAdminSession(page: Page) {
  const mockSession: MockSession = {
    user: {
      id: '1',
      email: 'admin@gmail.com',
      name: 'Admin User',
      roles: [{ name: 'ADMIN' }],
      accessToken: 'mock-admin-token'
    },
    accessToken: 'mock-admin-token'
  };

  await page.route('**/api/auth/session', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    });
  });

  await page.addInitScript((session) => {
    window.localStorage.setItem('next-auth.session-token', session.accessToken);
    window.__MOCK_SESSION__ = session;
  }, mockSession);
}

/**
 * Mock an authenticated regular user session for testing
 */
export async function mockUserSession(page: Page) {
  const mockSession: MockSession = {
    user: {
      id: '2',
      email: 'user@test.com',
      name: 'Regular User',
      roles: [{ name: 'USER' }],
      accessToken: 'mock-user-token'
    },
    accessToken: 'mock-user-token'
  };

  await page.route('**/api/auth/session', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    });
  });

  await page.addInitScript((session) => {
    window.localStorage.setItem('next-auth.session-token', session.accessToken);
    window.__MOCK_SESSION__ = session;
  }, mockSession);
}

/**
 * Mock unauthenticated session (no user)
 */
export async function mockUnauthenticatedSession(page: Page) {
  await page.route('**/api/auth/session', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({})
    });
  });

  await page.addInitScript(() => {
    window.localStorage.removeItem('next-auth.session-token');
    delete window.__MOCK_SESSION__;
  });
}

/**
 * Login using NextAuth credentials provider with real API
 * Reads credentials from environment variables if not provided
 */
export async function loginWithCredentials(page: Page, credentials: RealAuthCredentials = {}) {
  // Get credentials from environment variables or use provided ones
  const email = credentials.email || process.env.TEST_ADMIN_EMAIL;
  const password = credentials.password || process.env.TEST_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Admin credentials not provided. Please set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables or pass credentials directly.'
    );
  }

  // Navigate to login page
  await page.goto('/en/login');

  // Wait for form to be visible
  await page.waitForSelector('input[id="email"]');

  // Fill in the login form using the correct selectors
  await page.fill('input[id="email"]', email);
  await page.fill('input[id="password"]', password);

  // Submit the form
  await page.click('button[type="submit"]');

  // Wait for successful login (redirect to home page first)
  await page.waitForURL(/\/en\/?$/, { timeout: 10000 });

  // Then navigate to admin area
  await page.goto('/en/admin');

  // Verify we can access admin (should not redirect to login)
  await page.waitForURL(/\/en\/admin/, { timeout: 10000 });

  return {
    success: true,
    message: 'Login successful'
  };
}
