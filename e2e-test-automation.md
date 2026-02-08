# E2E Test Automation Guide
## AI Council Web Application

This guide provides instructions for setting up and running automated end-to-end tests using Playwright.

---

## Setup Instructions

### 1. Install Playwright

```bash
# In the frontend directory
cd frontend
npm install -D @playwright/test
npx playwright install
```

### 2. Create Playwright Configuration

Create `playwright.config.ts` in the frontend directory:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. Create Test Directory Structure

```
frontend/
  e2e/
    auth.spec.ts
    user-flow.spec.ts
    responsive.spec.ts
    keyboard.spec.ts
    accessibility.spec.ts
    error-handling.spec.ts
```

---

## Sample Test Files

### auth.spec.ts - Authentication Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should register new user', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.fill('input[name="name"]', 'Test User');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to API Key Wizard
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test('should login existing user', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Verify redirect to chat
    await expect(page).toHaveURL(/\/chat/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'WrongPassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/register');
    
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.fill('input[name="name"]', 'Test User');
    
    // Verify validation error
    await expect(page.locator('text=Invalid email format')).toBeVisible();
  });
});
```

### user-flow.spec.ts - Complete User Flow

```typescript
import { test, expect } from '@playwright/test';

test.describe('Complete User Flow', () => {
  test('should complete full journey: landing → register → wizard → chat → response', async ({ page }) => {
    // Step 1: Landing Page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AI Council');
    
    // Step 2: Click Get Started
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/\/register/);
    
    // Step 3: Register
    const timestamp = Date.now();
    await page.fill('input[name="email"]', `test${timestamp}@example.com`);
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.fill('input[name="name"]', 'Test User');
    await page.click('button[type="submit"]');
    
    // Step 4: API Key Wizard
    await expect(page).toHaveURL(/\/onboarding/);
    
    // Skip wizard for now (or configure if API keys available)
    await page.click('text=Skip for now');
    
    // Step 5: Chat Interface
    await expect(page).toHaveURL(/\/chat/);
    
    // Step 6: Submit Query
    await page.fill('textarea[placeholder*="Enter your query"]', 'Explain quantum computing');
    await page.click('button:has-text("Submit")');
    
    // Step 7: Verify Progress
    await expect(page.locator('text=Processing')).toBeVisible({ timeout: 10000 });
    
    // Step 8: Verify Response (with longer timeout)
    await expect(page.locator('[data-testid="response-content"]')).toBeVisible({ timeout: 60000 });
  });
});
```

### responsive.spec.ts - Responsive Design Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify mobile layout
    await expect(page.locator('nav button[aria-label="Menu"]')).toBeVisible();
    
    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test('should display correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Verify tablet layout
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should display correctly on desktop (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Verify desktop layout
    await expect(page.locator('nav')).toBeVisible();
  });
});
```

### keyboard.spec.ts - Keyboard Navigation Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation', () => {
  test('should navigate landing page with keyboard', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
    
    // Verify focus indicators are visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should submit form with Enter key', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    
    // Press Enter to submit
    await page.keyboard.press('Enter');
    
    // Verify form submission
    await expect(page).toHaveURL(/\/chat/, { timeout: 5000 });
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.goto('/chat');
    
    // Open help modal (if available)
    await page.keyboard.press('Control+/');
    
    // Close with Escape
    await page.keyboard.press('Escape');
    
    // Verify modal is closed
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('should support Ctrl+Enter shortcut in chat', async ({ page }) => {
    await page.goto('/chat');
    
    await page.fill('textarea', 'Test query');
    
    // Submit with Ctrl+Enter
    await page.keyboard.press('Control+Enter');
    
    // Verify submission
    await expect(page.locator('text=Processing')).toBeVisible({ timeout: 5000 });
  });
});
```

### accessibility.spec.ts - Accessibility Tests

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should not have accessibility violations on landing page', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on registration page', async ({ page }) => {
    await page.goto('/register');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should not have accessibility violations on chat page', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/\/chat/);
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA labels on interactive elements
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Verify only one h1
    const h1Count = await h1.count();
    expect(h1Count).toBe(1);
  });
});
```

### error-handling.spec.ts - Error Scenario Tests

```typescript
import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should handle network error gracefully', async ({ page, context }) => {
    await page.goto('/chat');
    
    // Simulate offline
    await context.setOffline(true);
    
    await page.fill('textarea', 'Test query');
    await page.click('button:has-text("Submit")');
    
    // Verify error message
    await expect(page.locator('text=Network error')).toBeVisible();
    
    // Restore connection
    await context.setOffline(false);
  });

  test('should handle invalid API key', async ({ page }) => {
    await page.goto('/settings');
    
    // Add invalid API key
    await page.click('text=Add API Key');
    await page.selectOption('select[name="provider"]', 'openai');
    await page.fill('input[name="apiKey"]', 'sk-invalid123');
    await page.click('button:has-text("Validate")');
    
    // Verify error message
    await expect(page.locator('text=Invalid API key')).toBeVisible();
  });

  test('should handle empty query submission', async ({ page }) => {
    await page.goto('/chat');
    
    // Try to submit empty query
    const submitButton = page.locator('button:has-text("Submit")');
    
    // Button should be disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should handle query exceeding character limit', async ({ page }) => {
    await page.goto('/chat');
    
    // Enter query > 5000 characters
    const longQuery = 'a'.repeat(5001);
    await page.fill('textarea', longQuery);
    
    // Verify error message
    await expect(page.locator('text=exceeds maximum length')).toBeVisible();
  });

  test('should handle session expiration', async ({ page }) => {
    await page.goto('/chat');
    
    // Clear localStorage to simulate expired session
    await page.evaluate(() => localStorage.clear());
    
    // Try to submit query
    await page.fill('textarea', 'Test query');
    await page.click('button:has-text("Submit")');
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=session expired')).toBeVisible();
  });
});
```

---

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test File

```bash
npx playwright test e2e/auth.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests in Headed Mode (See Browser)

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

### Generate Test Report

```bash
npx playwright show-report
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Install Playwright Browsers
        run: |
          cd frontend
          npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: |
          cd frontend
          npx playwright test
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 30
```

---

## Best Practices

### 1. Use Data Test IDs

Add `data-testid` attributes to important elements:

```tsx
<button data-testid="submit-query">Submit</button>
```

Then in tests:

```typescript
await page.click('[data-testid="submit-query"]');
```

### 2. Use Page Object Model

Create page objects for reusable logic:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('input[name="email"]', email);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }
}

// In test:
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('test@example.com', 'password');
```

### 3. Use Fixtures for Setup

```typescript
import { test as base } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
};

const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/chat/);
    
    await use(page);
  },
});

test('should submit query when authenticated', async ({ authenticatedPage }) => {
  await authenticatedPage.fill('textarea', 'Test query');
  await authenticatedPage.click('button:has-text("Submit")');
});
```

### 4. Handle Flaky Tests

```typescript
test('flaky test', async ({ page }) => {
  // Retry on failure
  test.setTimeout(60000);
  
  // Use waitFor with timeout
  await page.waitForSelector('[data-testid="result"]', { timeout: 30000 });
  
  // Use soft assertions for non-critical checks
  await expect.soft(page.locator('.optional-element')).toBeVisible();
});
```

---

## Troubleshooting

### Tests Timing Out

- Increase timeout: `test.setTimeout(120000)`
- Use longer waitFor timeouts
- Check if backend is running

### Elements Not Found

- Use `page.waitForSelector()` before interacting
- Check if element is in viewport
- Verify selector is correct

### WebSocket Tests Failing

- Ensure backend WebSocket server is running
- Check WebSocket URL configuration
- Verify authentication token is valid

### Screenshots Not Captured

- Ensure `screenshot: 'only-on-failure'` in config
- Check `playwright-report` directory
- Run with `--trace on` for detailed traces

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Accessibility Testing with Playwright](https://playwright.dev/docs/accessibility-testing)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

