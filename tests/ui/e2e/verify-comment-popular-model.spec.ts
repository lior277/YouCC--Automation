import { randomString } from '@utils/random-generator';
import * as assert from "node:assert";
import { test } from "@fixtures/test-fixtures";

test.describe('Verify Comment Creation for Popular Model', () => {
    test('should allow commenting on Lamborghini Diablo model',
        async ({ page, loginPage, homePage }) => {
            const baseUrl = process.env.UI_BASE_URL!;

            const modelName = "Diablo";

            const testUser = {
                username: randomString(),
                firstName: randomString(),
                lastName: randomString(),
                password: process.env.TEST_PASSWORD!,
                comment: randomString()
            };

            await page.goto(baseUrl);

            // Use returned instances instead of reassigning fixtures
            const registerPageInstance = await homePage
                .clickOnRegisterButton();

            await registerPageInstance.fillRegistrationForm(
                testUser.username,
                testUser.firstName,
                testUser.lastName,
                testUser.password
            );

            await registerPageInstance.clickOnSubmitForm();

            await loginPage.setUsername(testUser.username);
            await loginPage.setPassword(testUser.password);
            const homePageInstance = await loginPage.clickLogin();
            await homePageInstance.clickLogo();

            // Comment and vote
            const carDetailsPageInstance = await homePageInstance
                .clickOnModelByModelName(modelName);

            await carDetailsPageInstance
                .enterComment(testUser.comment);

            await carDetailsPageInstance
                .clickVoteButton();

            // Reload and verify comment
            const actualComment = await carDetailsPageInstance
                .checkIfCommentExist(testUser.comment);

            assert.strictEqual(
                actualComment,
                testUser.comment,
                `Expected comment to be "${testUser.comment}", but got "${actualComment}"`
            );
        });
});