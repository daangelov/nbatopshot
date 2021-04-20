import axios from "axios";
import puppeteer from "puppeteer";
import {logIntoFile} from "./logIntoFile.js";
import {IS_TEST} from "../env.js";

export async function purchase(link) {
    const {webSocketDebuggerUrl} = await axios.get('http://127.0.0.1:9222/json/version').then(response => response.data);
    const browser = await puppeteer.connect({browserWSEndpoint: webSocketDebuggerUrl});
    const page = await browser.newPage();

    // Go to link
    await Promise.all([
        page.goto(link),
        page.waitForNavigation({waitUntil: 'networkidle2'}),
    ]);

    // Click Buy button
    try {
        await page.click('button[data-testid="mintedHeader-buy"]')
    } catch (e) {
        await page.close();

        return false;
    }

    // Click confirm cooldown button and wait for redirect
    try {
        await Promise.all([
            page.click('button[data-testid="confirm-cooldown"]'),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
        ])
    } catch (e) {
        await page.close();

        return false;
    }

    // Click cancel or confirm purchase button
    try {
        await Promise.all([
            page.click(`#__next button[type="${IS_TEST ? 'button' : 'submit'}"]`),
            page.waitForNavigation({waitUntil: 'networkidle2'})
        ]);
    } catch (e) {
        await page.close();

        return false;
    }

    // Close page and log info
    await page.close();
    logIntoFile(IS_TEST ? 'Canceled purchase' : 'Success purchase');

    return true;
}
