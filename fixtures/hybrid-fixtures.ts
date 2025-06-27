// fixtures/hybrid-fixtures.ts
import { test as apiFixtures } from '@fixtures/api-fixtures';
import { AuthenticationManager } from '@utils/auth-manager';
import { ProfilePage } from '@pages/ProfilePage';
import { RegisterPage } from '@pages/RegisterPage';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { CarDetailsPage } from '@pages/CarDetailsPage';
import type { Page } from '@playwright/test';

// Extend API fixtures with authenticated page objects
export const test = apiFixtures.extend<{
    authenticatedPage: Page;
    profilePage: ProfilePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    homePage: HomePage;
    carDetailsPage: CarDetailsPage;
}>({
    // Create a separate authenticated page that doesn't conflict with the base page
    authenticatedPage: async ({ registeredUser, browser }, use) => {
        const authManager = AuthenticationManager.getInstance();

        const context = await authManager.getAuthenticatedContext(
            browser,
            registeredUser.username,
            registeredUser.password
        );

        const page = await context.newPage();
        await use(page);
        await page.close();
    },

    // Create all page objects using the authenticated page
    profilePage: async ({ authenticatedPage }, use) => {
        await use(new ProfilePage(authenticatedPage));
    },

    registerPage: async ({ authenticatedPage }, use) => {
        await use(new RegisterPage(authenticatedPage));
    },

    loginPage: async ({ authenticatedPage }, use) => {
        await use(new LoginPage(authenticatedPage));
    },

    homePage: async ({ authenticatedPage }, use) => {
        await use(new HomePage(authenticatedPage));
    },

    carDetailsPage: async ({ authenticatedPage }, use) => {
        await use(new CarDetailsPage(authenticatedPage));
    }
});

export { expect } from '@playwright/test';