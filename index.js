#!/usr/bin/env node
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import puppeteer from "puppeteer";
import open from "open";
import {getMoments} from "./functions/getMoments.js";
import {getLowestPriceOffer} from "./functions/getLowestPriceOffer.js";
import {INTERVAL, MAX_PRICE} from "./env.js";

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
    .argv;

const {maxPrice = MAX_PRICE, interval = INTERVAL} = argv;

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

    // open(link).catch(error => console.log(error));

    const browser = await puppeteer.connect({
        browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/13095ee7-8168-464d-8309-24bfa55ab799'
    });
    const page = await browser.newPage();
    await page.goto(link);
    setTimeout(async () => {
        await page.$eval('button[data-testid="mintedHeader-buy"]', el => el.click());
    }, 2000);

    setTimeout(async () => {
        await page.$eval('button[data-testid="confirm-cooldown"]', el => el.click());
    }, 2000);

    setTimeout(async () => {
        await page.$eval('#__next button[type="button"]', el => el.click());
    }, 2000);

    // await browser.close();
}

run().catch(error => console.log(error));
