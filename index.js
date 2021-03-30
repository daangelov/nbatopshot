#!/usr/bin/env node
import yargs from "yargs";
import {hideBin} from "yargs/helpers";
import open from "open";
import {getMoments} from "./functions/getMoments.js";
import {getLowestPriceOffer} from "./functions/getLowestPriceOffer.js";
import {COOKIE, INTERVAL, MAX_PRICE} from "./env.js";

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
    'Cookie': `__cfduid=${COOKIE}`,
};

// Run program
setInterval(async () => {
    const moments = await getMoments(maxPrice);

    if (!moments.length) return;

    const lowestPriceMoment = moments[0];
    const lowestPriceOffer = await getLowestPriceOffer(lowestPriceMoment);
    console.log(`Found moment with id #${lowestPriceOffer.id}`);
    if (Number(lowestPriceOffer.price) > maxPrice) {
        console.log(`Moment offer (${lowestPriceOffer.price}) is higher than maxPrice ${maxPrice}`);
        return;
    }
    console.log(lowestPriceOffer);
    const link = `https://www.nbatopshot.com/moment/${lowestPriceOffer.owner.username}+${lowestPriceOffer.id}`;
    open(link).catch(error => console.log(error));
    process.exit(1);
}, interval * 1000);
