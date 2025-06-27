import { Page } from '@playwright/test';

export abstract class BasePage {
    page: Page;

    protected constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string = '') {
        await this.page.goto(path);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}