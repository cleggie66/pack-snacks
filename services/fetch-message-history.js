export async function fetchMessageHistory(client, channelId) {
    let messages = [];
    let cursor;

    try {
        // Grab all channel messages
        do {
            // Make request
            const messageData = await client.conversations.history({
                cursor,
                channel: channelId,
                include_all_metadata: true,
                limit: 100
            });

            // Check if more pagination requests are required
            cursor = messageData.response_metadata?.next_cursor;

            // Store messages
            messages = [...messages, ...messageData.messages];

            // Rate limiting pause between multiple requests
            if (cursor) await new Promise(r => setTimeout(r, 2000));
        } while (cursor);
    } catch (error) {
        console.error(error);
    }

    return messages;
};