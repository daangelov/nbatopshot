import axios from "axios";
import {headers} from "../index.js";
import {getUserMomentListingsDedicated} from "../graphql/queries/getUserMomentListingsDedicated.js";

const apiUrl = 'https://api.nbatopshot.com/marketplace/graphql?GetUserMomentListingsDedicated';

export async function getLowestPriceOffer(lowestPriceMoment) {

    const body = {
        query: getUserMomentListingsDedicated,
        variables: {
            input: {
                playID: lowestPriceMoment.play.id,
                setID: lowestPriceMoment.set.id,
            },
        },
    };

    const response = await axios.post(apiUrl, body, {headers});

    const momentListings = response.data.data.getUserMomentListings.data.momentListings;

    if (momentListings.length === 0) {
        return null;
    }

    // Fastest way is using for loop
    let lowestPriceOffer = momentListings[0];
    for (let i = 0; i < momentListings.length; i++) {
        if (Number(momentListings[i].moment.price) < Number(lowestPriceOffer.moment.price)) {
            lowestPriceOffer = momentListings[i];
        }
    }

    return lowestPriceOffer.moment;
}
