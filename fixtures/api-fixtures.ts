import * as dotenv from 'dotenv';
dotenv.config();

import { test as base, APIResponse, expect } from '@playwright/test';
import { randomString } from '@utils/random-generator';
import { config } from '@config/config';
import { ProfilePageAPI } from '@pages/ProfilePageAPI';
import { ProfilePage } from '@pages/ProfilePage';
import { LoginPage } from '@pages/LoginPage';

interface UserCredentials {
    username: string;
    password: string;
    accessToken: string;
}

type AuthenticatedAPIContext = {
    get:  (url: string) => Promise<APIResponse>;
    post: (url: string, body?: any) => Promise<APIResponse>;
    put:  (url: string, body?: any) => Promise<APIResponse>;
};

export const test = base.extend<{
    registeredUser: UserCredentials;
    authenticatedAPIContext: AuthenticatedAPIContext;
    profileAPI: ProfilePageAPI;
    profilePage: ProfilePage;
    loginPage: LoginPage;
    updateProfileData: (currentProfile: any, updates: Partial<any>) => any;
}>({
    registeredUser: async ({ page }, use) => {
        const username = randomString();
        const password = config.testPassword;

        // 1) Register user
        const registerResponse = await page.request.post(
            `${config.apiBaseUrl}/users`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    username,
                    firstName: username,
                    lastName:  username,
                    password,
                    confirmPassword: password,
                },
            }
        );
        if (![200, 201].includes(registerResponse.status())) {
            throw new Error(`Registration failed: ${await registerResponse.text()}`);
        }

        // 2) Authenticate
        const tokenResponse = await page.request.post(
            `${config.apiBaseUrl}/oauth/token`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                form: {
                    grant_type: 'password',
                    username,
                    password,
                },
            }
        );
        if (tokenResponse.status() !== 200) {
            throw new Error(`Authentication failed: ${await tokenResponse.text()}`);
        }

        const { access_token } = await tokenResponse.json();
        await use({ username, password, accessToken: access_token });
    },

    authenticatedAPIContext: async ({ page, registeredUser }, use) => {
        const authHeaders = {
            'Content-Type': 'application/json',
            Accept:         'application/json',
            Authorization:  `Bearer ${registeredUser.accessToken}`,
        };

        const apiContext: AuthenticatedAPIContext = {
            get: (url) =>
                page.request.get(`${config.apiBaseUrl}${url}`, { headers: authHeaders }),
            post: (url, body) =>
                page.request.post(`${config.apiBaseUrl}${url}`, {
                    headers: authHeaders,
                    data: body,
                }),
            put: (url, body) =>
                page.request.put(`${config.apiBaseUrl}${url}`, {
                    headers: authHeaders,
                    data: body,
                }),
        };

        await use(apiContext);
    },

    profileAPI: async ({ authenticatedAPIContext }, use) => {
        const profileAPI = new ProfilePageAPI(authenticatedAPIContext);
        await use(profileAPI);
    },

    profilePage: async ({ page }, use) => {
        const profilePage = new ProfilePage(page);
        await use(profilePage);
    },

    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },

    updateProfileData: async ({}, use) => {
        const createUpdateData = (currentProfile: any, updates: Partial<any> = {}) => {
            return {
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
            };
        };

        await use(createUpdateData);
    },
});

export { expect };