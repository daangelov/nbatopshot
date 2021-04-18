#!/usr/bin/env node
import yargs from "yargs";
import {hideBin} from "yargs/helpers";

import {getMoments} from "./functions/getMoments.js";
import {getLowestPriceOffer} from "./functions/getLowestPriceOffer.js";
import {getLiveTokenLink} from "./functions/getLivetokenOffers.js";
import {purchase} from "./functions/purchase.js";
import {logIntoFile} from "./functions/logIntoFile.js";

import {INTERVAL, IS_LIVETOKEN, MAX_PRICE, IS_TEST} from "./env.js";

const argv = yargs(hideBin(process.argv))
    .usage("Example usage: ./$0 --max-price 5 -interval 2")
    .option("max-price", {
        alias: "m",
        describe: "Maximum price of NFT",
        type: "number",
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

const {maxPrice = MAX_PRICE, interval = INTERVAL, isTest = IS_TEST} = argv;
const isLiveToken = IS_LIVETOKEN;

async function run() {
    let link = '';

    if (isLiveToken) {
        link = await getLiveTokenLink();
        if (!link) {
            await run();
        }
        logIntoFile(link);
    } else {
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

        link = `https://www.nbatopshot.com/moment/${lowestPriceOffer.owner.username}+${lowestPriceOffer.id}`;

        logIntoFile(link);
    }

    // Third step
    await purchase(link, isTest);

    setTimeout(run, interval * 1000);
}

run().catch(error => console.log(error));
