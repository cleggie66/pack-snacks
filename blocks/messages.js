export function tacoReceivedMessage(sender, tacoCount, messageText) {
    const text = "You got a taco! :taco:";
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<@${sender}> just gave you ${tacoCount === 1 ? "a taco!" : `${tacoCount} tacos!`} :taco:`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": messageText.split("\n").map((line) => `>${line}`).join("\n")
            }
        }
    ];

    return { text, blocks };
};

export function tacoReceivedReactionMessage(sender, messageText) {
    const text = "You got a taco! :taco:";
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<@${sender}> just gave you a taco reaction! :taco:`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": messageText.split("\n").map((line) => `>${line}`).join("\n")
            }
        }
    ];

    return { text, blocks };
};

export function tacoFailedMessage(forbiddenTacoCount, dailyLimit) {
    // Grab recipients
    const recipients = Object.keys(forbiddenTacoCount).map((recipient) => `<@${recipient}>`);

    // Build text
    const text = "You're out of Tacos! :taco:";
    let recipientText = "";
    if (recipients.length > 1) {
        const firstN = recipients.slice(0, -2);
        recipientText += firstN.join(", ");

        const last2 = recipients.slice(-2);
        if (firstN.length) {
            recipientText += ", ";
            recipientText += last2.join(", & ");
        } else {
            recipientText += last2.join(" & ");
        }
    } else {
        recipientText = recipients[0];
    }

    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${text} Your daily max of ${dailyLimit} tacos have been sent. \n\n ${recipientText} did not receive any tacos. Your limit will reset tomorrow :clock1:`
            }
        }
    ];

    return { text, blocks };
};

export function tacoNoRecipientMessage(messageText) {
    const text = "Hmmm... I'm not sure who you're trying to send a taco to. :thinking_face: :taco:";
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${text} \n\n If you'd like to send tacos, please tag the user in your message!`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": messageText.split("\n").map((line) => `>${line}`).join("\n")
            }
        }
    ];

    return { text, blocks };
};

export function tacoNoEmojiMessage(messageText) {
    const text = "Hmmm... I don't see a taco in your message. :thinking_face: :taco:";
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${text} \n\n If you'd like to send tacos, include the :taco: emoji in your message!`
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": messageText.split("\n").map((line) => `>${line}`).join("\n")
            }
        }
    ];

    return { text, blocks };
};

export function tacoSentMessage(allowedTacoCount, remainder) {
    const recipients = Object.keys(allowedTacoCount).map((recipient) => `<@${recipient}>`);

    // Build text
    let text = "";
    let recipientText = "";
    let recipientMessage = "";

    if (recipients.length > 1) {
        const firstN = recipients.slice(0, -2);
        if (firstN.length) {
            recipientText += firstN.join(", ");
        }

        const last2 = recipients.slice(-2);
        if (firstN.length) {
            recipientText += ", ";
            recipientText += last2.join(", & ");
        } else {
            recipientText += last2.join(" & ");
        }
    } else {
        recipientText = recipients[0];
    }

    const firstRecipient = Object.keys(allowedTacoCount)[0];
    if (recipients.length > 1 || allowedTacoCount[firstRecipient] > 1) {
        text = "Tacos sent! :taco:";
        recipientMessage = `${recipientText} got your tacos.`;
    } else {
        text = "Taco sent! :taco:";
        recipientMessage = `${recipientText} got your taco.`;
    }

    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${text} \n\n ${recipientMessage} You have ${remainder} left for the day`
            },
        },
    ];

    return { text, blocks };
};

export function tacoPartialSuccessMessage(allowedTacoCount, forbiddenTacoCount) {
    const successfulRecipients = Object.keys(allowedTacoCount);
    const successfulIds = new Set(successfulRecipients);
    const failedRecipients = Object.keys(forbiddenTacoCount).filter(
        (id) => !successfulIds.has(id)
    );

    // Build text
    const text = "Some tacos were sent, but some were not! :taco:";
    let recipientText = "";
    for (const recipient of successfulRecipients) {
        recipientText += `\n\n <@${recipient}> got ${allowedTacoCount[recipient] === 1 ? "a taco" : `${allowedTacoCount[recipient]} tacos`}.`;
    }
    for (const recipient of failedRecipients) {
        recipientText += `\n\n <@${recipient}> missed out on ${forbiddenTacoCount[recipient] === 1 ? "a taco" : `${forbiddenTacoCount[recipient]} tacos`}.`;
    }

    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${text} ${recipientText} \n\nYou are out of tacos for the day. Your limit will reset tomorrow :clock1:`
            }
        },
    ];

    return { text, blocks };
};