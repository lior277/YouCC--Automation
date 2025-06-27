import * as dotenv from 'dotenv';
dotenv.config();

import { test as base, Page, APIResponse, expect } from '@playwright/test';
import { randomString } from '@utils/random-generator';
import { config } from '../config/config';  // or '@config/config' if your alias is wired correctly

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
});

export { expect };
