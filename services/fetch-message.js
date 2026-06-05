export async function fetchMessage(client, channelId, messageTs, threadTs) {
  if (threadTs) {
    const { messages } = await client.conversations.replies({
      channel: channelId,
      ts: threadTs,
    });
    return messages?.find((m) => m.ts === messageTs);
  }

  const { messages } = await client.conversations.history({
    channel: channelId,
    latest: messageTs,
    inclusive: true,
    limit: 1,
  });
  return messages?.[0];
}
