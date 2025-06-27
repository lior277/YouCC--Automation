import { test as base, expect } from '@playwright/test';
import { randomString } from '@utils/random-generator';
import { config } from '@config/config';
import { ProfilePage } from '@pages/ProfilePage';
import { ProfilePageAPI } from '@pages/ProfilePageAPI';
import { LoginPage } from '@pages/LoginPage';
import { ApiRequestHandler } from '@utils/ApiRequestHandler';

interface UserCredentials {
    username: string;
    password: string;
    accessToken: string;
}

export const test = base.extend<{
    registeredUser: UserCredentials;
    apiHandler: ApiRequestHandler;
    profileAPI: ProfilePageAPI;
    profilePage: ProfilePage;
    loginPage: LoginPage;
    updateProfileData: (currentProfile: any, updates: Partial<any>) => any;
}>({
    registeredUser: async ({ page }, use) => {
        const username = randomString();
        const password = config.testPassword;

        // Register user
        const registerResponse = await page.request.post(
            `${config.apiBaseUrl}/users`,
            {
                data: {
                    username,
                    firstName: username,
                    lastName: username,
                    password,
                    confirmPassword: password,
                }
            }
        );

        if (!registerResponse.ok()) {
            throw new Error(`Registration failed: ${await registerResponse.text()}`);
        }

        // Authenticate
        const tokenResponse = await page.request.post(
            `${config.apiBaseUrl}/oauth/token`,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                form: {
                    grant_type: 'password',
                    username,
                    password,
                },
            }
        );

        if (!tokenResponse.ok()) {
            throw new Error(`Authentication failed: ${await tokenResponse.text()}`);
        }

        const { access_token } = await tokenResponse.json();
        await use({ username, password, accessToken: access_token });
    },

    apiHandler: async ({ page, registeredUser }, use) => {
        const apiHandler = new ApiRequestHandler(
            page.request,
            config.apiBaseUrl,
            {
                Authorization: `Bearer ${registeredUser.accessToken}`,
            }
        );
        await use(apiHandler);
    },

    profileAPI: async ({ apiHandler }, use) => {
        const profileAPI = new ProfilePageAPI({
            get: (url: string) => apiHandler.executeGet(url),
            post: (url: string, body?: any) => apiHandler.executePost(url, body),
            put: (url: string, body?: any) => apiHandler.executePut(url, body),
        });
        await use(profileAPI);
    },



    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    updateProfileData: async ({}, use) => {
        const createUpdateData = (currentProfile: any, updates: Partial<any> = {}) => ({
            username: currentProfile.username,
            firstName: updates.firstName || currentProfile.firstName,
            lastName: updates.lastName || currentProfile.lastName,
            gender: updates.gender || currentProfile.gender || '',
            age: updates.age || currentProfile.age || '',
            address: updates.address || currentProfile.address || '',
            phone: updates.phone || currentProfile.phone || '',
            hobby: updates.hobby || currentProfile.hobby || '',
            currentPassword: updates.currentPassword || '',
            newPassword: updates.newPassword || '',
            newPasswordConfirmation: updates.newPasswordConfirmation || ''
        });

        await use(createUpdateData);
    },
});

export { expect };