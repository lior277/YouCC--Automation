import { test, expect } from '@fixtures/api-fixtures';
import { config } from '@config/config';

test.use({
    baseURL: config.uiBaseUrl,
});

test.describe('Hybrid Profile Tests', () => {
    test('Update gender via API and verify in UI',
        async ({ page, profileAPI, registeredUser, profilePage, loginPage, updateProfileData }
        ) => {
        // Step 1: Modify gender via API
        const profileData = await profileAPI.getCurrentUserProfile();

        const updateData = updateProfileData(profileData, { gender: 'Female' });

        await profileAPI.updateProfile(updateData);

        // Step 2: Login to UI and navigate to profile page
        await page.goto('/');

        const homePage = await loginPage
            .setUsername(registeredUser.username)
            .then(loginPage => loginPage.setPassword(registeredUser.password))
            .then(loginPage => loginPage.clickLogin());

        // Navigate to profile page using HomePage method
        await homePage.clickOnProfileLink();

        // Step 3: Assert the change in UI
        const genderValue = await profilePage.getFieldValue('gender');
        expect(genderValue).toBe('Female');
    });
});