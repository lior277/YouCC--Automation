// utils/auth-manager.ts
import { Browser, BrowserContext, Page } from '@playwright/test';
import { config } from '@config/config';
import fs from 'fs/promises';
import path from 'path';

interface AuthSession {
    username: string;
    timestamp: number;
    storageStatePath: string;
}

export class AuthenticationManager {
    private static instance: AuthenticationManager;
    private sessions: Map<string, AuthSession> = new Map();
    private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutes
    private readonly authDir = '.auth';

    private constructor() {}

    static getInstance(): AuthenticationManager {
        if (!AuthenticationManager.instance) {
            AuthenticationManager.instance = new AuthenticationManager();
        }
        return AuthenticationManager.instance;
    }

    async getAuthenticatedContext(
        browser: Browser,
        username: string,
        password: string
    ): Promise<BrowserContext> {
        const session = this.sessions.get(username);

        // Check if we have a valid cached session
        if (session && this.isSessionValid(session)) {
            try {
                const context = await browser.newContext({
                    storageState: session.storageStatePath
                });

                // Verify the session is still active
                const page = await context.newPage();
                await page.goto(config.uiBaseUrl);
                const isLoggedIn = await page.locator('text=Logout').isVisible();

                if (isLoggedIn) {
                    await page.close();
                    console.log(`✓ Reusing session for ${username}`);
                    return context;
                }

                // Session expired in the app
                await page.close();
                await context.close();
            } catch (error) {
                console.log(`Session validation failed for ${username}: ${error}`);
            }
        }

        // Create new authenticated session
        return await this.createNewSession(browser, username, password);
    }

    private async createNewSession(
        browser: Browser,
        username: string,
        password: string
    ): Promise<BrowserContext> {
        console.log(`Creating new session for ${username}`);

        const context = await browser.newContext();
        const page = await context.newPage();

        // Navigate and login
        await page.goto(config.uiBaseUrl);
        await page.fill('input[name="login"]', username);
        await page.fill('input[name="password"]', password);
        await page.click('button:has-text("Login")');

        // Wait for login completion
        await page.waitForSelector('text=Logout', { timeout: 10000 });

        // Save storage state
        const storageStatePath = path.join(this.authDir, `${username}.json`);
        await context.storageState({ path: storageStatePath });

        // Update session cache
        this.sessions.set(username, {
            username,
            timestamp: Date.now(),
            storageStatePath
        });

        await page.close();
        console.log(`✓ New session created for ${username}`);

        return context;
    }

    private isSessionValid(session: AuthSession): boolean {
        const now = Date.now();
        return (now - session.timestamp) < this.sessionTimeout;
    }

    async clearSession(username: string): Promise<void> {
        const session = this.sessions.get(username);
        if (session) {
            try {
                await fs.unlink(session.storageStatePath);
            } catch (error) {
                // File might not exist
            }
            this.sessions.delete(username);
        }
    }

    async clearAllSessions(): Promise<void> {
        for (const [username, session] of this.sessions) {
            await this.clearSession(username);
        }
    }
}