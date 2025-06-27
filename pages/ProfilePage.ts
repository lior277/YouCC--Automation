import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        await super.navigate('/profile');
        await this.page.waitForLoadState('networkidle');
    }

    async getFieldValue(fieldName: string): Promise<string> {
        const field = this.page
            .locator(`input[name="${fieldName}"], select[name="${fieldName}"]`);

        return await field.inputValue();
    }
}