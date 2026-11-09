import { test } from '@playwright/test';
import { signInAndLoadProject } from '../fixtures/sign-in';

// Uses Playwright's own page (not the shared signed-in one) so it exercises sign-in from scratch.
test('01 - Login and Project Setup', async ({ page }) => {
  await signInAndLoadProject(page);
});
