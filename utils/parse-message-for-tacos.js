export function parseMessageForTacos(message, targets) {
    const tacos = [];

    // Grab count of tacos in message
    const count = message.text.match(/:taco:/g) ? message.text.match(/:taco:/g).length : 0;

    // Add tacos
    for (let i = 0; i < count; i++) {
        for (let j = 0; j < targets.length; j++) {
            tacos.push({
                from: message.user,
                to: targets[j],
                type: "taco",
                ts: message.ts
            });
        }
    }

    return tacos;
};