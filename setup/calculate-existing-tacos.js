import { fetchAllMessagesAndReplies } from "../services/fetch-all-messages-and-replies.js";
import { parseOldMessagesForTacos } from "../utils/parse-old-messages-for-tacos.js";

export async function calculateExistingTacos(client, userLimitsStorage, channelId) {
    // Fetch all messages and replies
    const messages = await fetchAllMessagesAndReplies(client, channelId);

    // Parse all messages for tacos
    const tacoCount = await parseOldMessagesForTacos(client, userLimitsStorage, messages);

    return tacoCount;
};