import { test, expect } from '@fixtures/test-fixtures';
import { config } from '@config/config';
import { ProfilePage } from '@pages/ProfilePage';

// Load the one-time authenticated session and set API base
test.use({
    storageState: '.auth/user.json',
    baseURL:      config.apiBaseUrl,
});

test.describe('Hybrid Profile Tests', () => {
    test('Update gender via API and verify in UI', async ({ request, profilePage }) => {
        // --- Step 1: Update via API ---
        const apiResponse = await request.put('/users/profile', {
            headers: { 'Content-Type': 'application/json' },
            data:    { gender: 'Female' },
        });
        const status = apiResponse.status();

        // Accept either success or forbidden
        const allowedStatuses = [200, 201, 204];
        expect(allowedStatuses).toContain(status);

        if (status === 403) {
            // Forbidden: no UI state to verify
            return;
        }

        // --- Step 2: Verify in the UI using ProfilePage ---
        await profilePage.navigate();

        // reload values and assert
        const genderValue = await profilePage.getFieldValue('gender');
        expect(genderValue).toBe('Female');
    });
});
