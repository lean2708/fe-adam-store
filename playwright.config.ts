import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  // Useful defaults
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

