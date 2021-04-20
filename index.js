#!/usr/bin/env node
import {getLinkFromLiveToken} from "./functions/getLinkFromLiveToken.js";
import {purchase} from "./functions/purchase.js";
import {logIntoFile} from "./functions/logIntoFile.js";
import {getLinkFromNBA} from "./functions/getLinkFromNBA.js";

import {INTERVAL, IS_LIVETOKEN} from "./env.js";

async function run() {
    const link = IS_LIVETOKEN ? await getLinkFromLiveToken() : await getLinkFromNBA();

    if (!link) {
        logIntoFile('Link is not valid. Restart...');
        setTimeout(run, INTERVAL * 1000);
        return;
    }

    logIntoFile(link);

    // Go to link and perform purchase
    await purchase(link);
    setTimeout(run, INTERVAL * 1000);
}

run().catch(error => console.log(error));
