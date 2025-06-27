import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
    // Locators
    private readonly firstNameInput = this.page.locator('input[name="firstName"]');
    private readonly lastNameInput = this.page.locator('input[name="lastName"]');
    private readonly genderSelect = this.page.locator('select[name="gender"]');
    private readonly ageInput = this.page.locator('input[name="age"]');
    private readonly addressInput = this.page.locator('input[name="address"]');
    private readonly phoneInput = this.page.locator('input[name="phone"]');
    private readonly hobbySelect = this.page.locator('select[name="hobby"]');
    private readonly currentPasswordInput = this.page.locator('input[name="currentPassword"]');
    private readonly newPasswordInput = this.page.locator('input[name="newPassword"]');
    private readonly confirmPasswordInput = this.page.locator('input[name="newPasswordConfirmation"]');
    private readonly saveButton = this.page.getByRole('button', { name: 'Save' });
    private readonly cancelButton = this.page.getByText('Cancel');
    private readonly successMessage = this.page.locator('.alert-success');

    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        await super.navigate('/profile');
        await this.page.waitForLoadState('networkidle');
    }

    async updateProfile(profileData: {
        firstName?: string;
        lastName?: string;
        gender?: string;
        age?: string;
        address?: string;
        phone?: string;
        hobby?: string;
    }) {
        if (profileData.firstName) {
            await this.firstNameInput.clear();
            await this.firstNameInput.fill(profileData.firstName);
        }

        if (profileData.lastName) {
            await this.lastNameInput.clear();
            await this.lastNameInput.fill(profileData.lastName);
        }

        if (profileData.gender) {
            await this.genderSelect.selectOption(profileData.gender);
        }

        if (profileData.age) {
            await this.ageInput.clear();
            await this.ageInput.fill(profileData.age);
        }

        if (profileData.address) {
            await this.addressInput.clear();
            await this.addressInput.fill(profileData.address);
        }

        if (profileData.phone) {
            await this.phoneInput.clear();
            await this.phoneInput.fill(profileData.phone);
        }

        if (profileData.hobby) {
            await this.hobbySelect.selectOption(profileData.hobby);
        }
    }

    async changePassword(currentPassword: string, newPassword: string) {
        await this.currentPasswordInput.fill(currentPassword);
        await this.newPasswordInput.fill(newPassword);
        await this.confirmPasswordInput.fill(newPassword);
    }

    async saveProfile() {
        await this.saveButton.click();
    }

    async cancelChanges() {
        await this.cancelButton.click();
    }

    async getSuccessMessage(): Promise<string> {
        await this.successMessage.waitFor({ state: 'visible' });
        return await this.successMessage.textContent() || '';
    }

    async getFieldValue(fieldName: string): Promise<string> {
        const field = this.page.locator(`input[name="${fieldName}"], select[name="${fieldName}"]`);
        return await field.inputValue();
    }
}