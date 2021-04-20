import axios from "axios";
import {searchMomentListingsDefault} from "../graphql/queries/searchMomentListingsDefault.js";
import {MAX_PRICE} from "../env.js";

const apiUrl = 'https://api.nbatopshot.com/marketplace/graphql?SearchMomentListingsDefault';

export async function getMoments() {
    const data = {
        query: searchMomentListingsDefault,
        variables: {
            byPrice: {
                min: '0',
                max: MAX_PRICE.toString(),
            },
            byListingType: ["BY_USERS"],
            orderBy: "PRICE_USD_ASC",
            searchInput: {
                pagination: {
                    cursor: "",
                    direction: "RIGHT",
                    limit: 100,
                },
            },
        },
    };

    const response = await axios.post(apiUrl, data);

    return response.data.data.searchMomentListings.data.searchSummary.data.data;
}
