#!/usr/bin/env node
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import puppeteer from "puppeteer";
import open from "open";
import {getMoments} from "./functions/getMoments.js";
import {getLowestPriceOffer} from "./functions/getLowestPriceOffer.js";
import {INTERVAL, MAX_PRICE, SESSION} from "./env.js";

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
    .option("session", {
        alias: "s",
        describe: "Session cookie value",
        type: "string",
        nargs: 1,
    })
    .argv;

const {maxPrice = MAX_PRICE, interval = INTERVAL, session = SESSION} = argv;

export const headers = {
    'Content-Type': 'application/json',
};

async function run() {
    const moments = await getMoments(maxPrice);
    if (!moments.length) {
        console.log(`No moments found with price $${maxPrice}`);
        setTimeout(run, interval * 1000);
        return;
    }

    console.log('Fount moment that matches criteria');

    const lowestPriceMoment = moments[0];
    const lowestPriceOffer = await getLowestPriceOffer(lowestPriceMoment);
    if (Number(lowestPriceOffer.price) > maxPrice) {
        console.log(`Moment offer (${lowestPriceOffer.price}) is higher than maxPrice $${maxPrice}`);
        setTimeout(run, interval * 1000);
        return;
    }
    console.log(lowestPriceOffer);

    const link = `https://www.nbatopshot.com/moment/${lowestPriceOffer.owner.username}+${lowestPriceOffer.id}`;

    console.log(link);
    open(link).catch(error => console.log(error));

    // Test

    const testLink = 'https://www.nbatopshot.com/moment/dansilver+86bac83f-dd2d-433e-8cee-48b157b192cc';

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const todayAfterOneMonth = new Date();
    todayAfterOneMonth.setMonth(new Date().getMonth() + 1);
    await page.setCookie(
        {domain: '.nbatopshot.com', name: 'ts:session', value: SESSION, expires: todayAfterOneMonth.getTime()}
    );
    await page.goto(testLink);
    await page.$eval('button[data-testid="mintedHeader-buy"]', el => el.click());

    // await browser.close();
}

run().catch(error => console.log(error));
