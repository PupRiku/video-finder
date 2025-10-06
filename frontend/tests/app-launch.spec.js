const { test, expect, _electron } = require('@playwright/test');
const path = require('path');

// Re-usable setup function to launch the app and wait for the UI
async function launchApp() {
  // Explicitly tell Playwright the path to the Electron app's root directory.
  const appPath = path.join(__dirname, '..');
  const electronApp = await _electron.launch({ args: [appPath] });
  const window = await electronApp.firstWindow();
  // Wait for the main UI to appear before returning
  await expect(window.locator('label[for="site-select"]')).toBeVisible({
    timeout: 90000,
  });
  return { electronApp, window };
}

// Set a generous timeout for all tests in this file
test.setTimeout(120000);

test('App launches, transitions, and has the correct title', async () => {
  // This test now implicitly covers the launch and transition by using the helper
  const { electronApp, window } = await launchApp();

  // Now that the main UI is loaded, we can safely check the title.
  await expect(window).toHaveTitle('AI Video Finder');

  // Verify the main H1 title is correct.
  await expect(window.locator('h1')).toHaveText('AI Video Frame Finder');

  await electronApp.close();
});

test('Performs a successful search and displays results', async () => {
  const { electronApp, window } = await launchApp();

  // Intercept network requests to mock the API response
  await window.route(
    'http://localhost:5000/scrape_and_search',
    async (route) => {
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
        {
          rank: 3,
          page_url: 'http://example.com/mock-video-3',
          thumbnail_url: 'https://via.placeholder.com/150',
          distance: 0.91,
        },
      ];
      await route.fulfill({ json });
    }
  );

  // "Upload" a file
  const fileChooserPromise = window.waitForEvent('filechooser');
  await window.locator('label[for="file-upload"]').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(
    path.join(__dirname, '../test-assets/test-image.png')
  );

  // Click the search button
  await window.locator('button[type="submit"]').click();

  // Wait for the results to appear and verify the first one
  const firstResult = window.getByText('Rank #1');
  await expect(firstResult).toBeVisible();

  // Verify that an element containing "% Match" is visible
  await expect(window.getByText(/% Match/).first()).toBeVisible();

  await electronApp.close();
});
