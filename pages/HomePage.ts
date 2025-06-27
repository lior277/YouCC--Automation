import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import {RegisterPage} from "@pages/RegisterPage";
import {CarDetailsPage} from "@pages/CarDetailsPage";

export class HomePage extends BasePage {
    // Navigation bar locators
    private readonly buggyRatingLogo = this.page.locator('.navbar-brand');
    private readonly registerButton = this.page.locator('a.btn.btn-success-outline');
    private readonly logoutLink = this.page.locator('.navbar-link').filter({ hasText: 'Logout' });

    // Main content locators
    private readonly mainHeading = this.page.locator('h1');

    // Popular Model section
    private getCardByModelTitle = (modelTitle: string) =>
        this.page.locator(`.card:has(img[title="${modelTitle}"])`);

    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        await super.navigate('/');
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.mainHeading.waitFor({ state: 'visible' });
    }

    async clickLogo() {
        await this.buggyRatingLogo.click();
    }

    async clickOnRegisterButton(): Promise<RegisterPage> {
        await this.registerButton.click();
        return new RegisterPage(this.page);
    }

    async clickOnModelByModelName(modelName: string): Promise<CarDetailsPage> {
        const modelCard = this.getCardByModelTitle(modelName);
        await modelCard.locator('a').click();

        return new CarDetailsPage(this.page)
    }
}