export async function sendDM(client, userId, text, blocks) {
    // Open DM with user
    const { channel } = await client.conversations.open({ users: userId });

    // Post message to DM
    await client.chat.postMessage({ channel: channel.id, text, blocks });
};