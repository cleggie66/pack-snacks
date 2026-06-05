import { tacoReceivedMessage, tacoSentMessage, tacoPartialSuccessMessage, tacoReceivedReactionMessage } from "../blocks/messages.js";
import { updateTacoLimit } from "../utils/update-taco-limit.js";
import { sendDM } from "./send-dm.js";

export async function sendTacos(client, user, tacoStorage, userLimitsStorage, allowedTacos, forbiddenTacos, allowedTacoCount, forbiddenTacoCount, messageText, isReaction) {
    if (allowedTacos.length === 0) return;

    // Update taco count
    for (const taco of allowedTacos) {
        if (tacoStorage[taco.to]) {
            tacoStorage[taco.to] = [...tacoStorage[taco.to], taco];
        } else {
            tacoStorage[taco.to] = [taco];
        }
    }

    // Update user limit
    const tacoRemainder = updateTacoLimit(userLimitsStorage, user, allowedTacos[0].ts, allowedTacos.length);

    // Send recipient(s) a DM
    for (const recipient of Object.keys(allowedTacoCount)) {
        if (isReaction) {
            // Send recipient a DM — Reaction Success
            const { text, blocks } = tacoReceivedReactionMessage(user, messageText);
            await sendDM(client, recipient, text, blocks);
        } else {
            // Send recipient a DM — Taco Success
            const { text, blocks } = tacoReceivedMessage(user, allowedTacoCount[recipient], messageText);
            await sendDM(client, recipient, text, blocks);
        }
    }

    if (forbiddenTacos.length === 0) {
        // Send user a DM — Success
        const { text, blocks } = tacoSentMessage(allowedTacoCount, tacoRemainder);
        await sendDM(client, user, text, blocks);
    } else {
        // Send user a DM — Partial Success
        const { text, blocks } = tacoPartialSuccessMessage(allowedTacoCount, forbiddenTacoCount);
        await sendDM(client, user, text, blocks);
    }
}