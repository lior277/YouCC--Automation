import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    uiBaseUrl: process.env.UI_BASE_URL!,
    apiBaseUrl: process.env.API_BASE_URL!,
    testPassword: process.env.TEST_PASSWORD!,
    testDir: process.env.TEST_DIR!,
    fullyParallel: process.env.FULLY_PARALLEL === 'true',
    forbidOnly: process.env.FORBID_ONLY === 'true',
    retries: ((): number => {
        const val = parseInt(process.env.RETRIES ?? '', 10);
        return Number.isNaN(val) ? 0 : val;
    })(),
    workers: ((): number | undefined => {
        const raw = process.env.WORKERS;
        if (!raw) return undefined;
        const val = parseInt(raw, 10);
        return Number.isNaN(val) ? undefined : val;
    })(),
};
