import { fetchGroupUsers } from "./fetch-group-users.js";

export async function fetchMessageTargets(client, message) {
    let targets = new Set([]);

    if (!message?.text) return targets;

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

    return [...targets];
}