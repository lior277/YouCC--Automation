// tests/setup/auth.setup.ts
import { test } from '@playwright/test';
import { config } from '@config/config';

test('auth-setup: register and login', async ({ request, page }) => {
    // 1) Register via API
    const username = process.env.TEST_USERNAME!;   // or random if you prefer
    const password = config.testPassword;
    const res = await request.post(`${config.apiBaseUrl}/users`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username, firstName: username, lastName: username, password, confirmPassword: password }
    });
    if (![200,201].includes(res.status())) throw new Error('Registration failed');

    // 2) Login via UI and persist storage
    await page.goto(config.uiBaseUrl);
    await page.fill('input[name="login"]', username);
    await page.fill('input[name="password"]', password);
    await page.click('button:has-text("Login")');
    await page.waitForSelector('text=Logout');
    await page.context().storageState({ path: '.auth/user.json' });
});
