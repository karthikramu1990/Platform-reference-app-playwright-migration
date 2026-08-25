import { test as base, expect } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }, use) => {
        const client = await page.context().newCDPSession(page);

        const viewport = page.viewportSize() || { width: 1920, height: 1080 };

        await client.send('Emulation.setDeviceMetricsOverride', {
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: 2,
            mobile: false,
        });

        await page.addInitScript(() => {
            Object.defineProperty(window, 'devicePixelRatio', {
                get: () => 2,
            });
        });

        await use(page);
    },
});

export { expect };