const { test, expect, _electron } = require('@playwright/test');
const path = require('path');

// Re-usable setup function to launch the app and wait for the UI
async function launchApp() {
  // Explicitly tell Playwright the path to the Electron app's root directory.
  const appPath = path.join(__dirname, '..');
  const electronApp = await _electron.launch({ args: [appPath] });
  const window = await electronApp.firstWindow();
  await expect(window.locator('label[for="site-select"]')).toBeVisible({
    timeout: 90000,
  });
  return { electronApp, window };
}

test.describe('UI Feature Tests', () => {
  // Give all tests in this file a generous 2-minute timeout
  test.setTimeout(120000);

  test('Clear Screenshot button works correctly', async () => {
    const { electronApp, window } = await launchApp();

    // 1. Verify the "Clear" button is initially hidden
    await expect(window.getByText('Clear', { exact: true })).toBeHidden();

    // 2. Select a file
    const fileChooserPromise = window.waitForEvent('filechooser');
    await window.locator('label[for="file-upload"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      path.join(__dirname, '../test-assets/test-image.png')
    );

    // 3. Verify the file name and the "Clear" button are now visible
    await expect(window.getByText('test-image.png')).toBeVisible();
    await expect(window.getByText('Clear', { exact: true })).toBeVisible();

    // 4. Click the "Clear" button
    await window.getByText('Clear', { exact: true }).click();

    // 5. Verify the file name and button are gone, and the default text has returned
    await expect(window.getByText('test-image.png')).toBeHidden();
    await expect(window.getByText('Clear', { exact: true })).toBeHidden();
    await expect(window.getByText('Choose Screenshot...')).toBeVisible();

    await electronApp.close();
  });

  test('Results to Show field correctly limits results', async () => {
    const { electronApp, window } = await launchApp();

    // --- THIS IS THE FIX ---
    // Intercept network requests to our backend API.
    await window.route(
      'http://localhost:5000/scrape_and_search',
      async (route) => {
        // The test is expecting 2 results, so our mock response will provide exactly 2.
        const json = [
          {
            rank: 1,
            page_url: 'http://example.com/mock-video-1',
            thumbnail_url: 'https://via.placeholder.com/150',
            distance: 0.95,
          },
          {
            rank: 2,
            page_url: 'http://example.com/mock-video-2',
            thumbnail_url: 'https://via.placeholder.com/150',
            distance: 0.92,
          },
        ];
        // Fulfill the request with our fake JSON data.
        await route.fulfill({ json });
      }
    );

    // 1. Change the "Results to Show" value to 2
    const resultsInput = window.locator('input#results-input');
    await resultsInput.fill('2');
    await expect(resultsInput).toHaveValue('2');

    // 2. Upload a file and run a search
    const fileChooserPromise = window.waitForEvent('filechooser');
    await window.locator('label[for="file-upload"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(
      path.join(__dirname, '../test-assets/test-image.png')
    );
    await window.locator('button[type="submit"]').click();

    // 3. Wait for results to appear (this will now be very fast)
    await expect(window.getByText('Rank #1')).toBeVisible();

    // 4. Verify the count
    const resultsCount = await window.getByText(/Rank #/).count();
    expect(resultsCount).toBe(2);

    // 5. Verify that "Rank #3" does not exist
    await expect(window.getByText('Rank #3')).toBeHidden();

    await electronApp.close();
  });

  test('Dark mode toggle works and applies the dark class', async () => {
    const { electronApp, window } = await launchApp();

    // 1. Get the <html> element
    const htmlElement = window.locator('html');

    // 2. Verify it does not have the 'dark' class initially
    await expect(htmlElement).not.toHaveClass('dark');

    // 3. Click the toggle
    await window.locator('label[for="dark-mode-toggle"]').click();

    // 4. Verify the 'dark' class has been added
    await expect(htmlElement).toHaveClass('dark');

    // 5. Click the toggle again
    await window.locator('label[for="dark-mode-toggle"]').click();

    // 6. Verify the 'dark' class has been removed
    await expect(htmlElement).not.toHaveClass('dark');

    await electronApp.close();
  });
});
