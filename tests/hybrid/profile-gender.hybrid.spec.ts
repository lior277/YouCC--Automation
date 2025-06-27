import { test, expect } from '@fixtures/api-fixtures';
import { config } from '@config/config';

test.use({
    baseURL: config.uiBaseUrl,
});

test.describe('Hybrid Profile Tests', () => {
    test('Update gender via API and verify in UI', async ({ page, authenticatedAPIContext, registeredUser, profilePage, loginPage, updateProfileData }) => {
        // Step 1: Modify gender via API
        const currentProfile = await authenticatedAPIContext.get('/users/profile');
        const profileData = await currentProfile.json();

        const updateData = updateProfileData(profileData, { gender: 'Female' });

        const updateResponse = await authenticatedAPIContext.put('/users/profile', updateData);
        expect([200, 201, 204]).toContain(updateResponse.status());

        // Step 2: Login to UI and navigate to profile page
        await page.goto('/');

        const homePage = await loginPage
            .setUsername(registeredUser.username)
            .then(loginPage => loginPage.setPassword(registeredUser.password))
            .then(loginPage => loginPage.clickLogin());

        await page.waitForLoadState('networkidle');

        // Navigate to profile page using HomePage method
        await homePage.clickOnProfileLink();
        await page.waitForLoadState('networkidle');

        // Step 3: Assert the change in UI
        const genderValue = await profilePage.getFieldValue('gender');
        expect(genderValue).toBe('Female');
    });
});