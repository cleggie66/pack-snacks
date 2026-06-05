import { getTacoLimit } from "./get-taco-limit.js";
import { updateTacoLimit } from "./update-taco-limit.js";
import { fetchGroupUsers } from "../services/fetch-group-users.js";

export async function parseOldMessageForTacos(client, userLimitsStorage, message) {
    const tacos = [];
    let targets = new Set([]);

    // Parse user(s) mentioned in the message
    const userTargets = [...message.text.matchAll(/<@([^>]+)>/g)].map(match => match[1]);
    for (const target of userTargets) {
        targets.add(target);
    }

    // Parse group(s) mentioned in the message
    const groupTargets = [...message.text.matchAll(/<!subteam\^([^>]+)>/g)].map(match => match[1]);

    // Fetch users in groups
    for (const target of groupTargets) {
        const groupUsers = await fetchGroupUsers(client, message.team, target);
        for (const user of groupUsers) {
            targets.add(user);
        }
    }

    // Remove sender from targets
    targets.delete(message.user);

    const targetList = [...targets];

    // Grab count of tacos in message
    let messageTacos = [];
    const count = message.text.match(/:taco:/g) ? message.text.match(/:taco:/g).length : 0;
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < targetList.length; j++) {
            messageTacos.push({
                from: message.user,
                to: targetList[j],
                type: "taco",
                ts: message.ts
            });
        }
    }

    // Grab limit for user
    const { tacoLimit } = getTacoLimit(userLimitsStorage, message.user, message.ts);

    // Restrict tacos to user's limit
    messageTacos = messageTacos.slice(0, tacoLimit);

    // Update user limit
    updateTacoLimit(userLimitsStorage, message.user, message.ts, messageTacos.length);

    // Add tacos to total
    tacos.push(...messageTacos);

    // Grab count of taco reactions
    const reactions = message?.reactions;
    if (reactions) {
        const tacoReactions = reactions.find((reaction) => reaction.name === "taco");

        // Grab a taco for each user who reacted
        if (tacoReactions) {
            for (const user of tacoReactions.users) {
                let reactionTacos = [];

                for (let j = 0; j < targetList.length; j++) {
                    reactionTacos.push({
                        from: user,
                        to: targetList[j],
                        type: "taco",
                        ts: message.ts
                    });
                }

                // Grab limit for user
                const { tacoLimit } = getTacoLimit(userLimitsStorage, user, message.ts);

                // Restrict tacos to user's limit
                reactionTacos = reactionTacos.slice(0, tacoLimit);

                // Update user limit
                updateTacoLimit(userLimitsStorage, user, message.ts, reactionTacos.length);

                // Add tacos to total
                tacos.push(...reactionTacos);
            };
        };
    };

    return tacos;
};