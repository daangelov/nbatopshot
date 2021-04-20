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
        const timeout = IS_LIVETOKEN ? 0 : INTERVAL * 1000;
        setTimeout(run, timeout);
        return;
    }

    logIntoFile(link);

    // Go to link and perform purchase
    const success = await purchase(link);
    
    // Restart
    if (success) {
        setTimeout(run, 15 * 1000);
    } else {
        run();
    }
}

run().catch(error => console.log(error));
