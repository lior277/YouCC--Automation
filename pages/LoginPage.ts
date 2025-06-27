import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HomePage } from '@pages/HomePage';

export class LoginPage extends BasePage {
    private readonly loginInput = this.page.locator('input[name="login"]');
    private readonly passwordInput= this.page.locator('my-login input[name="password"]');
    private readonly loginButton= this.page.getByRole('button', { name: 'Login' });
    private readonly errorMessage= this.page.locator('text=Invalid username/password');

    constructor(page: Page) {
        super(page);
    }

    async setUsername(username: string): Promise<this> {
        await this.loginInput.fill(username);
        return this;
    }

    async setPassword(password: string): Promise<this> {
        await this.passwordInput.fill(password);
        return this;
    }

    async clickLogin(): Promise<HomePage> {
        const maxAttempts = 10;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await this.loginButton.click();

            try {
                await this.errorMessage.waitFor({ state: 'visible', timeout: 2000 });
            } catch {
                return new HomePage(this.page);
            }
        }

        throw new Error('Login failed after retries: Invalid username/password');
    }
}
