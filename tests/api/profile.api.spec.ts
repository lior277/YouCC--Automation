import { test } from '@fixtures/api-fixtures';
import { assertMultiple } from '@utils/assert-helper';

test.describe('Profile API Tests', () => {
    test('GET /users/profile - Authenticated Request', async ({ authenticatedAPIContext, registeredUser }) => {
        console.log(`\n Testing GET /users/profile for user: ${registeredUser.username}`);
        console.log(`   Using token: ${registeredUser.accessToken.substring(0, 20)}...`);

        const response = await authenticatedAPIContext.get('/users/profile');
        const headers = response.headers();
        const profileData = await response.json();

        const errors: [string, boolean][] = [
            [`Expected status 200, got ${response.status()}`, response.status() === 200],
            [
                `Content-Type should match application/json, got ${headers['content-type']}`,
                /application\/json/.test(headers['content-type'] || '')
            ],
            [`Profile data should be defined`, profileData != null],
            [
                `Profile username should match registered user`,
                profileData.username === registeredUser.username
            ]
        ];

        assertMultiple(errors);
        console.log('GET /users/profile test passed');
    });

    test('PUT /users/profile - Authenticated Request', async ({ authenticatedAPIContext, registeredUser }) => {
        console.log(`\n Testing PUT /users/profile for user: ${registeredUser.username}`);
        console.log(`   Using token: ${registeredUser.accessToken.substring(0, 20)}...`);

        const updateData = {
            username: registeredUser.username,
            firstName: "UpdatedFirstName",
            lastName: "UpdatedLastName",
            gender: "Male",
            age: "28",
            address: "123 API Test Street",
            phone: "1234567890",
            hobby: "Automated Testing",
            currentPassword: "",
            newPassword: "",
            newPasswordConfirmation: ""
        };

        const response = await authenticatedAPIContext.put('/users/profile', updateData);
        const responseText = await response.text();

        const errors: [string, boolean][] = [
            [
                `Expected status in [200,201,204], got ${response.status()}`,
                [200, 201, 204].includes(response.status())
            ],
            [
                `Response text should be defined, got "${responseText}"`,
                responseText !== undefined
            ]
        ];

        assertMultiple(errors);
        console.log('PUT /users/profile test passed');
    });

    test('Complete Flow Verification', async ({ registeredUser, authenticatedAPIContext }) => {
        console.log('\n COMPLETE FLOW VERIFICATION');
        console.log('='.repeat(50));
        console.log(`User: ${registeredUser.username}`);
        console.log(`Token: ${registeredUser.accessToken.substring(0, 30)}...`);

        // Step 1: GET profile
        const getResponse = await authenticatedAPIContext.get('/users/profile');
        const originalProfile = await getResponse.json();

        // Step 2: PUT profile
        const timestamp = Date.now();
        const updateData = {
            username: registeredUser.username,
            firstName: `TestFirst_${timestamp}`,
            lastName: `TestLast_${timestamp}`,
            gender: "Female",
            age: "30",
            address: `${timestamp} Test Avenue`,
            phone: "9876543210",
            hobby: "Integration Testing",
            currentPassword: "",
            newPassword: "",
            newPasswordConfirmation: ""
        };
        const putResponse = await authenticatedAPIContext.put('/users/profile', updateData);

        // Step 3: Verify changes
        const verifyResponse = await authenticatedAPIContext.get('/users/profile');
        const updatedProfile = await verifyResponse.json();

        const errors: [string, boolean][] = [
            [`GET status expected 200, got ${getResponse.status()}`, getResponse.status() === 200],
            [
                `PUT status expected in [200,201,204], got ${putResponse.status()}`,
                [200, 201, 204].includes(putResponse.status())
            ],
            [`VERIFY status expected 200, got ${verifyResponse.status()}`, verifyResponse.status() === 200],
            [
                `First name should change from ${originalProfile.firstName} to ${updatedProfile.firstName}`,
                originalProfile.firstName !== updatedProfile.firstName
            ]
        ];

        assertMultiple(errors);
        console.log('\n COMPLETE FLOW VERIFICATION SUCCESSFUL!');
    });
});
