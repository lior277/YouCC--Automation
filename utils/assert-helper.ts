import { expect } from '@playwright/test';

export function assertMultiple(errors: [string, boolean][]) {
    const failures = errors
        .filter(([, passed]) => !passed)
        .map(([message]) => message);

    expect(failures, `Multiple assertions failed:\n${failures.join('\n')}`).toEqual([]);
}
