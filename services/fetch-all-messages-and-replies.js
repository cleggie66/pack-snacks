import { fetchMessageHistory } from "./fetch-message-history.js";
import { fetchMessageReplies } from "./fetch-message-replies.js";

export async function fetchAllMessagesAndReplies(client, channelId) {
    // Fetch all messages in the channel
    const messages = await fetchMessageHistory(client, channelId);

    // Fetch all replies from the messages
    let replies = [];
    for (const message of messages) {
        // Skip if message is not a thread
        if (!message.thread_ts) continue;

        // Fetch replies from message
        const messageReplies = await fetchMessageReplies(client, channelId, message.ts);

        // Add replies to total
        // -- First message is duplicate of the original and removed
        replies = [...replies, ...messageReplies.slice(1)];
    };

    return [...messages, ...replies];
};