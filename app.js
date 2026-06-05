import { App } from '@slack/bolt';
import { homeView } from './blocks/home.js';
import {
  tacoFailedMessage,
  tacoNoRecipientMessage,
  tacoNoEmojiMessage,
} from './blocks/messages.js';
import { sendDM } from './services/send-dm.js';
import { sendTacos } from './services/send-tacos.js';
import { calculateExistingTacos } from './setup/calculate-existing-tacos.js';
import { getTacoLimit } from './utils/get-taco-limit.js';
import { parseMessageForTacos } from './utils/parse-message-for-tacos.js';
import { countTacosByRecipient } from './utils/count-tacos-by-recipient.js';
import { fetchMessageTargets } from './services/fetch-message-targets.js';
import { fetchMessage } from './services/fetch-message.js';
import { fetchBotChannels } from './services/fetch-bot-channels.js';
import { getTeamId } from './services/get-team-id.js';

// Storage
const tacoStorage = {};
const userLimitsStorage = {};
const channelIdStorage = new Set();

// Initializes app with Slack app and bot token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Publishes the App Home tab when a user opens it
app.event('app_home_opened', async ({ event, client }) => {
  try {
    const { tacoLimit } = getTacoLimit(userLimitsStorage, event.user, event.event_ts);
    await client.views.publish({
      user_id: event.user,
      view: homeView(event.user, tacoStorage, tacoLimit),
    });
  } catch (error) {
    console.error(error);
  }
});

// Listens to incoming messages that do not tag a user or group
app.message(async ({ message }) => {
  try {
    // Skip if there is no sender
    const sender = message.user;
    if (!sender) return;

    // Skip if message is not in a public channel
    if (!channelIdStorage.has(message.channel)) return;

    // Skip if message is a thread reply
    if (message.thread_ts && message.thread_ts !== message.ts) return;

    // Skip if message contains "<@" or "<!subteam^", is a bot message, or has a subtype
    if (!message.text || message.text.includes("<@") || message.text.includes("<!subteam^") || message.bot_id || message.subtype) return;

    // Send user a DM — No Recipient
    const { text, blocks } = tacoNoRecipientMessage(message.text);
    await sendDM(app.client, sender, text, blocks);
  } catch (error) {
    console.error(error);
  }
});

// Listens to incoming messages that tag a user or group but do not include :taco:
app.message(/<@|<!subteam\^/, async ({ message }) => {
  try {
    // Skip if there is no sender
    const sender = message.user;
    if (!sender) return;

    // Skip if message is not in a public channel
    if (!channelIdStorage.has(message.channel)) return;

    // Skip if message is a thread reply
    if (message.thread_ts && message.thread_ts !== message.ts) return;

    // Skip if message has no text, is a bot message, or has a subtype
    if (!message.text || message.bot_id || message.subtype) return;

    // Skip if message contains :taco:
    if (message.text.includes(':taco:')) return;

    // Send user a DM — No Taco Emoji
    const { text, blocks } = tacoNoEmojiMessage(message.text);
    await sendDM(app.client, sender, text, blocks);
  } catch (error) {
    console.error(error);
  }
});

// Listens to incoming messages that tag a user or group
app.message(/<@|<!subteam\^/, async ({ message }) => {
  try {
    // Grab user
    const user = message.user;
    if (!user) return;

    // Skip if message is not in a public channel
    if (!channelIdStorage.has(message.channel)) return;

    // Skip if message has no text, is a bot message, or has a subtype
    if (!message.text || message.bot_id || message.subtype) return;

    // Fetch message targets
    const targets = await fetchMessageTargets(app.client, message);
    if (targets.length === 0) return;

    // Parse tacos
    const tacos = parseMessageForTacos(message, targets);
    if (tacos.length === 0) return;

    // Check how many tacos the user has available to give
    const { tacoLimit, dailyLimit } = getTacoLimit(userLimitsStorage, user, message.ts);

    // Restrict tacos to user's daily limit
    const allowedTacos = tacos.slice(0, tacoLimit);
    const forbiddenTacos = tacos.slice(tacoLimit);

    // Grab totals
    const allowedTacoCount = countTacosByRecipient(allowedTacos);
    const forbiddenTacoCount = countTacosByRecipient(forbiddenTacos);

    // Skip gifting entirely if the user is out of tacos
    if (tacoLimit === 0) {
      // Send user a DM — Failed
      const { text, blocks } = tacoFailedMessage(forbiddenTacoCount, dailyLimit);
      await sendDM(app.client, user, text, blocks);
    }

    // Gift the tacos
    if (tacoLimit) {
      await sendTacos(
        app.client,
        user,
        tacoStorage,
        userLimitsStorage,
        allowedTacos,
        forbiddenTacos,
        allowedTacoCount,
        forbiddenTacoCount,
        message.text,
      );
    }
  } catch (error) {
    console.error(error);
  }
});

// Listens for taco reactions on messages that tag a user or group
app.event('reaction_added', async ({ event }) => {
  try {
    // Skip if reaction is not a taco or item is not a message
    if (event.reaction !== 'taco' || event.item.type !== 'message') return;

    // Grab user
    const user = event.user;
    if (!user) return;

    // Skip if reaction is not in a public channel
    if (!channelIdStorage.has(event.item.channel)) return;

    // Fetch message
    const { channel, ts, thread_ts: threadTs } = event.item;
    const message = await fetchMessage(app.client, channel, ts, threadTs);

    // Fetch message targets
    const targets = await fetchMessageTargets(app.client, message);
    if (targets.length === 0) return;

    // Prep tacos
    const tacos = [];
    for (const target of targets) {
      tacos.push({
        from: user,
        to: target,
        type: "taco",
        ts: event.event_ts,
      });
    }

    // Check how many tacos the user has left to give
    const { tacoLimit, dailyLimit } = getTacoLimit(userLimitsStorage, user, event.event_ts);

    // Limit tacos to user's daily limit remainder
    const allowedTacos = tacos.slice(0, tacoLimit);
    const forbiddenTacos = tacos.slice(tacoLimit);

    // Grab totals
    const allowedTacoCount = countTacosByRecipient(allowedTacos);
    const forbiddenTacoCount = countTacosByRecipient(forbiddenTacos);

    // Skip gifting entirely if the user is out of tacos
    if (tacoLimit === 0) {
      // Send user a DM — Failed
      const { text, blocks } = tacoFailedMessage(forbiddenTacoCount, dailyLimit);
      await sendDM(app.client, user, text, blocks);
    }

    // Gift the tacos
    if (tacoLimit) {
      await sendTacos(
        app.client,
        user,
        tacoStorage,
        userLimitsStorage,
        allowedTacos,
        forbiddenTacos,
        allowedTacoCount,
        forbiddenTacoCount,
        message.text,
      );
    }
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  console.log("🐺 Pack Snacks is running!");

  // Fetch bot channels
  const teamId = await getTeamId(app.client);
  const botChannels = await fetchBotChannels(app.client, teamId);

  // Calculate all existing tacos
  for (const channel of botChannels) {
    channelIdStorage.add(channel.id);

    // Calculate existing tacos in channel
    const tacoCount = await calculateExistingTacos(app.client, userLimitsStorage, channel.id);

    // Add tacos to storage
    for (const user in tacoCount) {
      if (tacoStorage[user]) {
        tacoStorage[user] = [...tacoStorage[user], ...tacoCount[user]];
      } else {
        tacoStorage[user] = tacoCount[user];
      }
    }
  }

  // Start app
  await app.start();
})();
