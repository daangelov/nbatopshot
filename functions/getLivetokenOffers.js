import axios from "axios";
import crypto from "crypto"
import {logIntoFile} from "./logIntoFile.js";
import {LIVETOKEN_PRICE, LIVETOKEN_FIRES} from "../env.js";

export async function getLiveTokenLink() {
    const ipAddr = await axios.get('https://bot.whatismyipaddress.com').then(response => response.data);
    const {msServerTimeAhead} = await axios.get('https://livetoken.co/api/utils/timesync', {
        headers: {t: (new Date).getTime()}
    }).then(response => response.data);

    const t = (new Date).getTime();
    const token = crypto.createHash('sha1').update(t.toString() + ipAddr).digest("hex");

    const {deals} = await axios.get('https://livetoken.co/api/topshot/deals?autoFetch=true', {
        headers: {msServerTimeAhead, token, t}
    }).then(response => response.data);

    if (!deals) return null;
    const matchedDeal = deals.find(deal => deal.dealRating >= LIVETOKEN_FIRES && deal.price <= LIVETOKEN_PRICE && deal.momentGUID !== null && deal.gone !== true);
    logIntoFile(matchedDeal);

    return "https://www.nbatopshot.com/moment/" + matchedDeal.momentGUID;
}
