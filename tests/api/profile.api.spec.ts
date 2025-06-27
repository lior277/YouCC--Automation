import { test, expect } from '@fixtures/api-fixtures';
import { config } from '@config/config';
import { ApiRequestHandler } from '@utils/ApiRequestHandler';
import { assertMultiple } from '@utils/assert-helper';

test.describe('Profile API Tests', () => {
    test('GET /users/profile - Authenticated Request', async ({ apiHandler, registeredUser }) => {
        const errors: [string, boolean][] = [];

        // Get current user profile
        const response = await apiHandler.executeGet('/users/profile');
        const result = await response.json();
        const headers = response.headers();

        // Validate response
        expect(response.status()).toBe(200);

        // Validate headers if needed
        expect(headers['content-type']).toContain('application/json');

        // Validate profile data
        errors.push(['Username should match registered user', result.username === registeredUser.username]);
        errors.push(['Profile should have firstName', result.hasOwnProperty('firstName')]);
        errors.push(['Profile should have lastName', result.hasOwnProperty('lastName')]);

        // Add any other validations from your original test
        assertMultiple(errors);
    });

    test('PUT /users/profile - Authenticated Request', async ({ apiHandler, registeredUser, updateProfileData }) => {
        const errors: [string, boolean][] = [];

        // Get current profile first
        const getResponse = await apiHandler.executeGet('/users/profile');
        const currentProfile = await getResponse.json();

        // Prepare new data
        const updatedData = updateProfileData(currentProfile, {
            firstName: 'UpdatedFirstName',
            lastName: 'UpdatedLastName',
            age: '30',
            gender: 'Male',
            address: '123 Test Street',
            phone: '+1234567890',
            hobby: 'Testing APIs'
        });

        // Update profile
        const putResponse = await apiHandler.executePut('/users/profile', updatedData);
        expect(putResponse.status()).toBe(200);

        // Verify the update
        const verifyResponse = await apiHandler.executeGet('/users/profile');
        const updatedProfile = await verifyResponse.json();

        // Validate updated fields
        errors.push(['FirstName should be updated', updatedProfile.firstName === updatedData.firstName]);
        errors.push(['LastName should be updated', updatedProfile.lastName === updatedData.lastName]);
        errors.push(['Age should be updated', updatedProfile.age === updatedData.age]);
        errors.push(['Gender should be updated', updatedProfile.gender === updatedData.gender]);
        errors.push(['Address should be updated', updatedProfile.address === updatedData.address]);
        errors.push(['Phone should be updated', updatedProfile.phone === updatedData.phone]);
        errors.push(['Hobby should be updated', updatedProfile.hobby === updatedData.hobby]);

        assertMultiple(errors);
    });

    test('PUT /users/profile - Update Password', async ({ apiHandler, registeredUser, updateProfileData }) => {
        // Get current profile
        const getResponse = await apiHandler.executeGet('/users/profile');
        const currentProfile = await getResponse.json();

        // Prepare password update data
        const passwordUpdateData = updateProfileData(currentProfile, {
            currentPassword: registeredUser.password,
            newPassword: 'NewSecurePassword123!',
            newPasswordConfirmation: 'NewSecurePassword123!'
        });

        // Update password
        const putResponse = await apiHandler.executePut('/users/profile', passwordUpdateData);
        expect(putResponse.status()).toBe(200);

        // You might want to test logging in with the new password here
        // This would require creating a new API handler or using page.request directly
    });

    test('GET /users/profile - Unauthorized Request', async ({ page }) => {
        // Create an API handler without authentication
        const unauthHandler = new ApiRequestHandler(page.request, config.apiBaseUrl);

        // Try to get profile without auth
        try {
            await unauthHandler.executeGet('/users/profile');
            // If we get here, the test should fail
            expect(true).toBe(false); // Force failure
        } catch (error: any) {
            // Verify it's an authentication error
            expect(error.message).toContain('401');
        }
    });
});