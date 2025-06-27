import { test, expect } from '@fixtures/api-fixtures';

test.describe('Profile API Tests', () => {
    test('GET /users/profile - Authenticated Request', async ({ profileAPI, registeredUser }) => {
        const result = await profileAPI.getCurrentUserProfile();
        const headers = await profileAPI.getProfileHeaders();

        expect(result.response.status()).toBe(200);
        expect(headers['content-type']).toMatch(/application\/json/);
        expect(result.data).toBeDefined();
        expect(result.data.username).toBe(registeredUser.username);
    });

    test('PUT /users/profile - Authenticated Request', async ({ profileAPI, registeredUser, updateProfileData }) => {
        const currentProfile = await profileAPI.getCurrentUserProfile();

        const updateData = updateProfileData(currentProfile.data, {
            firstName: "UpdatedFirstName",
            lastName: "UpdatedLastName",
            gender: "Male",
            age: "28",
            address: "123 API Test Street",
            phone: "1234567890",
            hobby: "Automated Testing"
        });

        expect(profileAPI.validateProfileData(updateData)).toBe(true);

        const result = await profileAPI.updateProfile(updateData);

        expect([200, 201, 204]).toContain(result.response.status());
        expect(result.text).toBeDefined();
    });
});