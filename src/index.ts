import crypto from 'crypto';
import os from 'os';

import puppeteer, { Browser, Page } from "puppeteer";
import cron from 'node-cron';

// First get values from environmental variables
const url:string = process.env.URL as string;
const cronString = process.env.CRON_STRING || '*/5 * * * * *';
const customUserAgent = process.env.USER_AGENT || null;
const debug:boolean = process.env.DEBUG ? true : false;

// Make sure a URL is set
if (!url) {
    console.error('ERROR: No URL set!  Please set one using the URL Environmental Variable!');
    process.exit(1);
} else if (!cron.validate(cronString)) {
    console.error(`ERROR: CRON_STRING value of ${cronString} is invalid!`);
    process.exit(1);
}

let browser: Browser;
let page: Page;
let browserInitialized = false;

/**
 * Function to setup our Browser session
 */
async function setupBrowser() {
    console.log(`Setting up browser to view ${url}...`)
    // Mark browser as uninitialized until we finish setting it up
    browserInitialized = false;

    try {
        browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
            ]
        });
        page = await browser.newPage();

        if (customUserAgent) {
            console.log(`Using Custom User Agent: ${customUserAgent}`);
            await page.setUserAgent({ userAgent: customUserAgent });
        }

        await page.goto(url);

        // If for any reason we disconnect then reset the browser session
        browser.on('disconnected', () => {
            console.log('Browser Disconnection Detected!');
            setupBrowser();
        });
        // Now mark that it's setup
        browserInitialized = true;

        console.log('Browser setup complete!');
    } catch (e) {
        console.error('Error setting up browser!');
        console.error(e);
        console.error('Will try again in 10 seconds');
        // Try setting up browser again in 10 seconds
        setTimeout(setupBrowser, 10 * 1000);
    }
}

/**
 * Function to move the mouse randomly
 */
async function moveMouse() {
    if (browserInitialized) {
        if (debug) {
            console.log('Starting Mouse Movement...');
        }
        const viewport = await page.viewport();
        const maxX = viewport?.width || 0;
        const maxY = viewport?.height || 0;
        if (debug) {
            console.log(`Current Viewport Dimentions are ${maxX}x${maxY}`);
        }
        const moveX = crypto.randomInt(0, maxX);
        const moveY = crypto.randomInt(0, maxY);
        console.log(`Moving mouse to (${moveX},${moveY})`);
        try {
            // First get the max X and Y coordinate
            await page.mouse.move(moveX, moveY);
        } catch (e) {
            console.error('Error moving mouse');
            console.error(e);
        }
    } else if (debug) {
        console.warn('Browser not initialized; skipping mouse movement');
    }
}

/**
 * Returns the non-internal IP addresses of this container
 */
function getInstanceIPs(): string[] {
    const interfaces = os.networkInterfaces();
    const addresses: string[] = [];
    for (const iface of Object.values(interfaces)) {
        if (!iface) continue;
        for (const info of iface) {
            if (!info.internal) {
                addresses.push(info.address);
            }
        }
    }
    return addresses;
}

(async () => {
    if (debug) {
        const ips = getInstanceIPs();
        console.log(`Instance IPs: ${ips.length > 0 ? ips.join(', ') : 'none detected'}`);
    }

    // Perform initial setup
    await setupBrowser();

    if (debug) {
        console.log(`Setting up cronjob using ${cronString}`);
    }

    // Setup cron job
    cron.schedule(cronString, moveMouse);
})();