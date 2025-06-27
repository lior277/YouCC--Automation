// fixtures/test-fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { HomePage } from '@pages/HomePage';
import { CarDetailsPage } from '@pages/CarDetailsPage';

export const test = base.extend<{
    registerPage: RegisterPage;
    loginPage: LoginPage;
    homePage: HomePage;
    carDetailsPage: CarDetailsPage;
}>({
    registerPage: async ({ page }, use) => {
        const registerPage = new RegisterPage(page);
        await use(registerPage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    carDetailsPage: async ({ page }, use) => {
        const carDetailsPage = new CarDetailsPage(page);
        await use(carDetailsPage);
    },
});

export { expect } from '@playwright/test';