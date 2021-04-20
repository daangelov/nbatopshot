import {MAX_PRICE} from "../env.js";

import {getMoments} from "./getMoments.js";
import {getLowestPriceOffer} from "./getLowestPriceOffer.js";
import {logIntoFile} from "./logIntoFile.js";

export async function getLinkFromNBA() {
    // Get all moments
    const moments = await getMoments();
    if (!moments.length) {
        logIntoFile(`No moments found with price $${MAX_PRICE}`);

        return null;
    }

    logIntoFile('Fount moment that matches criteria');

    // Get lowest price offer
    const lowestPriceMoment = moments[0];
    const lowestPriceOffer = await getLowestPriceOffer(lowestPriceMoment);
    if (Number(lowestPriceOffer.price) > MAX_PRICE) {
        logIntoFile(`Moment offer (${lowestPriceOffer.price}) is higher than maxPrice $${MAX_PRICE}`);

        return null;
    }

    logIntoFile(lowestPriceOffer);

    return `https://www.nbatopshot.com/moment/${lowestPriceOffer.owner.username}+${lowestPriceOffer.id}`;
}
