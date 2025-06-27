import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
    private readonly loginInput = this.page.locator("input[id='username']");
    private readonly firstNameInput = this.page.locator("input[id='firstName']");
    private readonly lastNameInput = this.page.locator("input[id='lastName']");
    private readonly passwordInput = this.page.locator("input[id='password']");
    private readonly confirmPasswordInput = this.page.locator("input[id='confirmPassword']");
    private readonly registerButton = this.page.getByRole('button', {name: 'Register'});

    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        await super.navigate('/register');
    }

    async fillRegistrationForm(
        username: string,
        firstName: string,
        lastName: string,
        password: string
    ) {
        await this.loginInput.fill(username);
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
    }


    async clickOnSubmitForm() {
        await this.registerButton.click();
    }
}