import { parseOldMessageForTacos } from "./parse-old-message-for-tacos.js";

export async function parseOldMessagesForTacos(client, userLimitsStorage, messages) {
    const tacoCount = {};

    for (const message of messages) {
        const tacos = await parseOldMessageForTacos(client, userLimitsStorage, message);
        // Update taco count
        for (const taco of tacos) {
            if (tacoCount[taco.to]) {
                tacoCount[taco.to] = [...tacoCount[taco.to], taco];
            } else {
                tacoCount[taco.to] = [taco];
            }
        }
        
    }

    return tacoCount;
};