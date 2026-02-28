import { test, expect } from '@playwright/test';

test.describe('Prompt Vault E2E Tests', () => {
  
  test('should show welcome screen on first visit', async ({ page }) => {
    await page.goto('/');
    
    // Should show welcome screen
    await expect(page.getByRole('heading', { name: /welcome to prompt vault/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /quick start with examples/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create empty workspace/i })).toBeVisible();
  });

  test('should create workspace with sample assets', async ({ page }) => {
    await page.goto('/');
    
    // Click quick start
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Should navigate to library view
    await expect(page.getByRole('heading', { name: /my prompt vault/i })).toBeVisible();
    
    // Should see sample assets in the library (using more specific selector)
    await expect(page.getByRole('listitem').filter({ hasText: 'Code Architect' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'PR Review Checklist' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: 'Debug Assistant' })).toBeVisible();
  });

  test('should create new asset', async ({ page }) => {
    // Setup: create workspace first
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Click new asset button
    await page.getByRole('button', { name: /new asset/i }).click();
    
    // Fill form
    await page.getByLabel(/name/i).fill('Test Prompt');
    await page.getByLabel(/content/i).fill('This is a test prompt content.');
    
    // Submit
    await page.getByRole('button', { name: /create asset/i }).click();
    
    // Should show in library
    await expect(page.getByRole('listitem').filter({ hasText: 'Test Prompt' })).toBeVisible();
  });

  test('should start new conversation', async ({ page }) => {
    // Setup
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Click new chat button in header
    await page.getByRole('button', { name: /^new chat$/i }).click();
    
    // Should be in chat view with composer
    await expect(page.getByPlaceholder(/type @skills/i)).toBeVisible();
    
    // Type message with mention
    await page.getByPlaceholder(/type @skills/i).fill('@Code Architect help me design an API');
    
    // Send (click the primary button in the textarea area)
    await page.locator('.cc-btn-primary').filter({ has: page.locator('svg') }).click();
    
    // Message should appear in thread
    await expect(page.getByText('@Code Architect help me design an API')).toBeVisible();
  });

  test('should export workspace', async ({ page }) => {
    // Setup
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Start download
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export/i }).click();
    const download = await downloadPromise;
    
    // Check file was downloaded
    expect(download.suggestedFilename()).toContain('pv-export-');
    expect(download.suggestedFilename()).toContain('.json');
  });

  test('should compile prompt with mentions', async ({ page }) => {
    // Setup
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Start chat
    await page.getByRole('button', { name: /^new chat$/i }).click();
    
    // Type with mention
    await page.getByPlaceholder(/type @skills/i).fill('@Code Architect design a REST API');
    
    // Send message
    await page.locator('.cc-btn-primary').filter({ has: page.locator('svg') }).click();
    
    // Wait for message to appear
    await expect(page.getByText('@Code Architect design a REST API')).toBeVisible();
    
    // Open compiler
    await page.getByRole('button', { name: /compile prompt/i }).click();
    
    // Should show compiled output in dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Code Architect');
    await expect(dialog).toContainText('design a REST API');
    
    // Copy button should work
    await dialog.getByRole('button', { name: /copy/i }).click();
    await expect(dialog.getByText(/copied/i)).toBeVisible();
  });

  test('should toggle between views', async ({ page }) => {
    // Setup
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Go to Chat (use exact button in tab bar)
    await page.getByRole('button', { name: 'Chat', exact: true }).click();
    await expect(page.getByPlaceholder(/type @skills/i)).toBeVisible();
    
    // Go to Import
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    await expect(page.getByText(/github import wizard/i)).toBeVisible();
    
    // Go to Library
    await page.getByRole('button', { name: 'Library', exact: true }).click();
    await expect(page.getByRole('listitem').filter({ hasText: 'Code Architect' })).toBeVisible();
  });

  test('should pin and unpin assets', async ({ page }) => {
    // Setup
    await page.goto('/');
    await page.getByRole('button', { name: /quick start with examples/i }).click();
    
    // Click on asset to open drawer
    await page.getByRole('listitem').filter({ hasText: 'PR Review Checklist' }).click();
    
    // Wait for drawer
    const drawer = page.locator('.fixed.inset-y-0.right-0');
    await expect(drawer).toBeVisible();
    
    // Pin button should be visible
    const pinButton = drawer.getByRole('button', { name: /pin asset/i });
    await expect(pinButton).toBeVisible();
    
    // Pin
    await pinButton.click();
    
    // Should show in sidebar (pinned section)
    const sidebar = page.locator('aside');
    await expect(sidebar.getByText('PR Review Checklist')).toBeVisible();
  });
});
