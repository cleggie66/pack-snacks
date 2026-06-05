export async function fetchBotChannels(client, teamId) {
    let channels = [];
    let cursor;

    try {
        do {
            const data = await client.conversations.list({
                cursor,
                team_id: teamId,
                exclude_archived: true,
                limit: 100,
                types: "public_channel",
            });

            cursor = data.response_metadata?.next_cursor;

            // Filter for channels the bot is a member of
            const memberChannels = (data.channels ?? []).filter((channel) => channel.is_member);
            channels = [...channels, ...memberChannels];

            if (cursor) await new Promise((r) => setTimeout(r, 2000));
        } while (cursor);
    } catch (error) {
        console.error(error);
    }

    return channels;
}
