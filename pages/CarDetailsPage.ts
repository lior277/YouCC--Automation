import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CarDetailsPage extends BasePage {
    private readonly commentTextarea = this.page.locator('#comment');
    private readonly voteButton = this.page.getByRole('button', { name: 'Vote!' });

    constructor(page: Page) {
        super(page);
    }

    async enterComment(comment: string) {
        await this.commentTextarea.clear();
        await this.commentTextarea.fill(comment);
    }

    async clickVoteButton() {
        await this.voteButton.click();
    }

    async checkIfCommentExist(comment: string): Promise<string | null> {
        const commentLocator = this.page.locator('td', { hasText: comment });

        try {
            await commentLocator.first().waitFor({ state: 'visible', timeout: 20000 });
            return await commentLocator.first().innerText();
        } catch {
            return null;
        }
    }



}