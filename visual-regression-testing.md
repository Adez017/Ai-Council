# Visual Regression Testing Guide
## AI Council Web Application

This guide provides instructions for visual regression testing to catch unintended UI changes.

---

## Overview

Visual regression testing compares screenshots of your application against baseline images to detect visual changes. This helps catch:
- Unintended layout changes
- CSS regressions
- Responsive design issues
- Cross-browser rendering differences

---

## Setup with Playwright

### 1. Install Dependencies

```bash
cd frontend
npm install -D @playwright/test
```

### 2. Create Visual Test Directory

```
frontend/
  e2e/
    visual/
      landing.visual.spec.ts
      chat.visual.spec.ts
      responsive.visual.spec.ts
```

---

## Visual Test Examples

### landing.visual.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Landing Page Visual Tests', () => {
  test('should match landing page screenshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot and compare
    await expect(page).toHaveScreenshot('landing-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hero = page.locator('[data-testid="hero-section"]');
    await expect(hero).toHaveScreenshot('hero-section.png');
  });

  test('should match features section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const features = page.locator('[data-testid="features-section"]');
    await expect(features).toHaveScreenshot('features-section.png');
  });

  test('should match demo interface', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const demo = page.locator('[data-testid="demo-interface"]');
    await expect(demo).toHaveScreenshot('demo-interface.png');
  });
});
```

### chat.visual.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Chat Interface Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/chat/);
  });

  test('should match chat interface', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('chat-interface.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match query input', async ({ page }) => {
    const queryInput = page.locator('[data-testid="query-input"]');
    await expect(queryInput).toHaveScreenshot('query-input.png');
  });

  test('should match execution mode selector', async ({ page }) => {
    const modeSelector = page.locator('[data-testid="execution-mode-selector"]');
    await expect(modeSelector).toHaveScreenshot('execution-mode-selector.png');
  });

  test('should match orchestration visualization', async ({ page }) => {
    // Submit a query first
    await page.fill('textarea', 'Test query');
    await page.click('button:has-text("Submit")');
    
    // Wait for orchestration to appear
    await page.waitForSelector('[data-testid="orchestration-visualization"]', {
      timeout: 10000,
    });
    
    const orchestration = page.locator('[data-testid="orchestration-visualization"]');
    await expect(orchestration).toHaveScreenshot('orchestration-visualization.png');
  });
});
```

### responsive.visual.spec.ts

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Visual Tests', () => {
  test('should match mobile layout (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-mobile-375.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match tablet layout (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-tablet-768.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match desktop layout (1920px)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-desktop-1920.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match chat on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/chat/);
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('chat-mobile-375.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
```

### theme.visual.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Theme Visual Tests', () => {
  test('should match light theme', async ({ page }) => {
    await page.goto('/');
    
    // Ensure light theme is active
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-light-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match dark theme', async ({ page }) => {
    await page.goto('/');
    
    // Enable dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('landing-dark-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('should match chat in dark theme', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/chat/);
    
    // Enable dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('chat-dark-theme.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
```

---

## Running Visual Tests

### Generate Baseline Screenshots

First time running visual tests, generate baseline images:

```bash
npx playwright test --update-snapshots
```

This creates baseline screenshots in `e2e/__screenshots__/` directory.

### Run Visual Tests

Compare current UI against baselines:

```bash
npx playwright test e2e/visual/
```

### Update Baselines After Intentional Changes

When you intentionally change the UI:

```bash
npx playwright test --update-snapshots
```

### View Visual Differences

If tests fail, view the diff:

```bash
npx playwright show-report
```

The report shows:
- Expected (baseline)
- Actual (current)
- Diff (highlighted differences)

---

## Configuration Options

### Screenshot Options

```typescript
await expect(page).toHaveScreenshot('name.png', {
  // Capture full page including scrollable content
  fullPage: true,
  
  // Disable animations for consistent screenshots
  animations: 'disabled',
  
  // Mask dynamic content
  mask: [page.locator('[data-testid="timestamp"]')],
  
  // Set maximum pixel difference threshold
  maxDiffPixels: 100,
  
  // Set maximum percentage difference threshold
  maxDiffPixelRatio: 0.01,
  
  // Clip to specific area
  clip: { x: 0, y: 0, width: 800, height: 600 },
  
  // Wait for fonts to load
  timeout: 5000,
});
```

### Playwright Config for Visual Tests

```typescript
// playwright.config.ts
export default defineConfig({
  expect: {
    toHaveScreenshot: {
      // Maximum pixel difference
      maxDiffPixels: 100,
      
      // Maximum percentage difference
      maxDiffPixelRatio: 0.01,
      
      // Disable animations by default
      animations: 'disabled',
      
      // Wait for fonts
      timeout: 5000,
    },
  },
});
```

---

## Best Practices

### 1. Mask Dynamic Content

Mask elements that change frequently:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  mask: [
    page.locator('[data-testid="timestamp"]'),
    page.locator('[data-testid="user-avatar"]'),
    page.locator('.animated-element'),
  ],
});
```

### 2. Wait for Stable State

Ensure page is fully loaded:

```typescript
// Wait for network to be idle
await page.waitForLoadState('networkidle');

// Wait for specific element
await page.waitForSelector('[data-testid="content"]');

// Wait for fonts
await page.evaluate(() => document.fonts.ready);
```

### 3. Disable Animations

Prevent flaky tests due to animations:

```typescript
// In test
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
});

// Or globally in CSS
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `,
});
```

### 4. Use Consistent Viewport Sizes

```typescript
test.use({ viewport: { width: 1280, height: 720 } });
```

### 5. Test Critical User Paths Only

Don't screenshot every page variation. Focus on:
- Landing page
- Key user flows
- Complex UI components
- Responsive breakpoints

### 6. Organize Screenshots

```
e2e/
  __screenshots__/
    chromium/
      landing/
        hero-section.png
        features-section.png
      chat/
        query-input.png
        orchestration.png
    firefox/
      landing/
        ...
```

### 7. Handle Cross-Browser Differences

Different browsers render slightly differently. Use separate baselines:

```typescript
// Playwright automatically creates browser-specific folders
// chromium/, firefox/, webkit/
```

Or use threshold:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixelRatio: 0.02, // Allow 2% difference
});
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Visual Regression Tests

on:
  pull_request:
    branches: [main]

jobs:
  visual-tests:
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
      
      - name: Install Playwright
        run: |
          cd frontend
          npx playwright install --with-deps
      
      - name: Run visual tests
        run: |
          cd frontend
          npx playwright test e2e/visual/
      
      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: visual-diffs
          path: |
            frontend/e2e/__screenshots__/**/*-diff.png
            frontend/e2e/__screenshots__/**/*-actual.png
          retention-days: 7
      
      - name: Comment PR with results
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ Visual regression tests failed. Check artifacts for diff images.'
            })
```

---

## Troubleshooting

### Tests Failing Due to Minor Differences

Increase threshold:

```typescript
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixelRatio: 0.05, // Allow 5% difference
});
```

### Fonts Not Loading

Wait for fonts:

```typescript
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000); // Additional buffer
```

### Animations Causing Flakiness

Disable all animations:

```typescript
await page.addStyleTag({
  content: `
    * {
      animation: none !important;
      transition: none !important;
    }
  `,
});
```

### Screenshots Look Different in CI

- Ensure same OS (Linux in CI, Linux locally)
- Use Docker for consistent environment
- Install same fonts in CI

### Large Screenshot Files

- Use `clip` to capture specific areas
- Compress images with tools like `pngquant`
- Store baselines in Git LFS

---

## Tools and Alternatives

### Percy (Visual Testing Service)

```bash
npm install --save-dev @percy/cli @percy/playwright
```

```typescript
import percySnapshot from '@percy/playwright';

test('visual test with Percy', async ({ page }) => {
  await page.goto('/');
  await percySnapshot(page, 'Landing Page');
});
```

### Chromatic (Storybook Visual Testing)

For component-level visual testing:

```bash
npm install --save-dev chromatic
```

### Applitools Eyes

AI-powered visual testing:

```bash
npm install --save-dev @applitools/eyes-playwright
```

---

## Maintenance

### Regular Updates

- Update baselines when UI intentionally changes
- Review and approve visual changes in PRs
- Clean up old screenshots periodically

### Documentation

- Document intentional visual changes in commit messages
- Keep a changelog of UI updates
- Tag baseline updates in Git

### Review Process

1. Developer makes UI change
2. Run visual tests locally
3. Review diffs
4. Update baselines if intentional
5. Commit both code and baseline updates
6. Reviewer checks visual diffs in PR

---

## Summary

Visual regression testing helps maintain UI consistency by:
- Catching unintended visual changes
- Ensuring responsive design works
- Verifying cross-browser compatibility
- Documenting UI evolution

Use it alongside functional tests for comprehensive coverage.

