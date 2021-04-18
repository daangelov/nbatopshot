#!/usr/bin/env node
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import puppeteer from "puppeteer";
// import open from "open";
import {getMoments} from "./functions/getMoments.js";
import {getLowestPriceOffer} from "./functions/getLowestPriceOffer.js";
import {INTERVAL, MAX_PRICE} from "./env.js";
import {logIntoFile} from "./functions/logIntoFile.js";

const argv = yargs(hideBin(process.argv))
    .usage("Example usage: ./$0 --max-price 5 -interval 2")
    .option("max-price", {
        alias: "m",
        describe: "Maximum price of NFT",
        type: "number",
        requiresArg: true,
        demandOption: true,
        nargs: 1,
    })
    .option("interval", {
        alias: "i",
        describe: "Execution interval in seconds",
        type: "number",
        nargs: 1,
    })
    .option("test", {
        alias: "t",
        describe: "Test program",
        type: "boolean",
        nargs: 1,
    })
    .argv;

const {maxPrice = MAX_PRICE, interval = INTERVAL, test = false} = argv;

export const headers = {
    'Content-Type': 'application/json',
};

async function run() {
    // First step
    const moments = await getMoments(maxPrice);
    if (!moments.length) {
        logIntoFile(`No moments found with price $${maxPrice}`);
        setTimeout(run, interval * 1000);
        return;
    }

    logIntoFile('Fount moment that matches criteria');

    // Second step
    const lowestPriceMoment = moments[0];
    const lowestPriceOffer = await getLowestPriceOffer(lowestPriceMoment);
    if (Number(lowestPriceOffer.price) > maxPrice) {
        logIntoFile(`Moment offer (${lowestPriceOffer.price}) is higher than maxPrice $${maxPrice}`);
        setTimeout(run, interval * 1000);
        return;
    }
    logIntoFile(lowestPriceOffer);

    const link = `https://www.nbatopshot.com/moment/${lowestPriceOffer.owner.username}+${lowestPriceOffer.id}`;

    logIntoFile(link);
    // open(link).catch(error => console.log(error));

    // Third step
    const browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/d4663a68-a2cf-4b48-9e86-106ba8a39a42'
    });
    const page = await browser.newPage();

    await Promise.all([
        page.goto(link),
        page.waitForNavigation({waitUntil: 'networkidle2'}),
    ]);

    try {
        await page.click('button[data-testid="mintedHeader-buy"]')
    } catch (e) {
        await page.close();
        setTimeout(run, interval * 1000);
        return;
    }

    try {
        await Promise.all([
            page.click('button[data-testid="confirm-cooldown"]'),
            page.waitForNavigation({waitUntil: 'networkidle2'}),
        ])
    } catch (e) {
        await page.close();
        setTimeout(run, interval * 1000);
        return;
    }

    try {
        await Promise.all([
            page.click(`#__next button[type="${test ? 'button' : 'submit'}"]`),
            page.waitForNavigation({waitUntil: 'networkidle2'})
        ]);
    } catch (e) {
        await page.close();
        setTimeout(run, interval * 1000);
        return;
    }

    await page.close();
    logIntoFile(test ? 'Canceled purchase' : 'Success purchase');
    setTimeout(run, 5 * 1000); // Wait 1 minute
}

run().catch(error => console.log(error));
