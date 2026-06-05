// app.message(/recap/, async ({ message }) => {
//     // Grab user
//     const user = message.user;
//     if (!user) return;

//     // Grab tacos that user has sent
//     let sentTacos = {};

//     // Parse through all users
//     for (const recipient of Object.keys(tacoStorage)) {
//         // Skip if recipient is the user
//         if (recipient === user) continue;

//         // Parse through all user tacos
//         for (const taco of tacoStorage[recipient]) {
//             if (taco.from === user) {
//                 sentTacos[recipient]
//                     ? sentTacos[recipient].push(taco)
//                     : sentTacos[recipient] = [taco];
//             }
//         }
//     }

//     // Calculate totals for each recipient
//     sentTacos = Object.keys(sentTacos).map((recipient) => ({
//         recipient,
//         count: sentTacos[recipient]?.length ? sentTacos[recipient].length : 0
//     }));
//     sentTacos = sentTacos.filter((recipient) => recipient.count > 0);

//     // Grab tacos that user has received
//     let receivedTacos = {};

//     // Parse through all user tacos
//     if (tacoStorage[user]) {
//         for (const taco of tacoStorage[user]) {
//             receivedTacos[taco.from]
//                 ? receivedTacos[taco.from].push(taco)
//                 : receivedTacos[taco.from] = [taco];
//         }
//     }

//     // Calculate totals for each sender
//     receivedTacos = Object.keys(receivedTacos).map((sender) => ({
//         sender,
//         count: receivedTacos[sender]?.length ? receivedTacos[sender].length : 0
//     }));
//     receivedTacos = receivedTacos.filter((sender) => sender.count > 0);

//     // Skip if user has not sent or received any tacos
//     if (sentTacos.length === 0 && receivedTacos.length === 0) return;

//     // Send user a DM — Monthly Recap
//     const { text, blocks } = monthlyTacoRecapMessage(sentTacos, receivedTacos);
//     await sendDM(app.client, user, text, blocks);
// });


// export function monthlyTacoRecapMessage(sentTacos, receivedTacos) {
//     const text = "Your monthly recap is here! :taco:";

//     const sortedSentTacos = [...sentTacos].sort((a, b) => b.count - a.count || a.recipient.localeCompare(b.recipient));
//     const sortedReceivedTacos = [...receivedTacos].sort((a, b) => b.count - a.count || a.sender.localeCompare(b.sender));

//     const totalTacosSent = sortedSentTacos.reduce((total, recipient) => total + recipient.count, 0);
//     const totalTacosReceived = sortedReceivedTacos.reduce((total, sender) => total + sender.count, 0);

//     const buildUserTableRows = (users, userKey) => users.map((user) => [
//         {
//             "type": "rich_text",
//             "elements": [
//                 {
//                     "type": "rich_text_section",
//                     "elements": [
//                         {
//                             "type": "user",
//                             "user_id": user[userKey],
//                             "style": { "bold": true }
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "type": "rich_text",
//             "elements": [
//                 {
//                     "type": "rich_text_section",
//                     "elements": [
//                         {
//                             "type": "text",
//                             "text": `${user.count}`,
//                             "style": { "bold": true }
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]);

//     const blocks = [
//         {
//             "type": "header",
//             "text": {
//                 "type": "plain_text",
//                 "text": "Monthly Taco Recap :taco:",
//                 "emoji": true
//             },
//             "level": 1
//         },
//         {
//             "type": "divider"
//         },
//         {
//             "type": "section",
//             "text": {
//                 "type": "mrkdwn",
//                 "text": `Here is your taco recap for the month.`
//             }
//         },
//         {
//             "type": "card",
//             "body": {
//                 "type": "mrkdwn",
//                 "text": `*Tacos Sent*\n${totalTacosSent}\n\n*Tacos Received*\n${totalTacosReceived}`
//             }
//         },
//         {
//             "type": "header",
//             "text": {
//                 "type": "plain_text",
//                 "text": "Tacos Sent :outbox_tray:",
//                 "emoji": true
//             },
//             "level": 2
//         },
//         sortedSentTacos.length ? {
//             "type": "table",
//             "rows": buildUserTableRows(sortedSentTacos, "recipient")
//         } : {
//             "type": "card",
//             "body": {
//                 "type": "mrkdwn",
//                 "text": "No tacos sent this month."
//             }
//         },
//         {
//             "type": "header",
//             "text": {
//                 "type": "plain_text",
//                 "text": "Tacos Received :inbox_tray:",
//                 "emoji": true
//             },
//             "level": 2
//         },
//         sortedReceivedTacos.length ? {
//             "type": "table",
//             "rows": buildUserTableRows(sortedReceivedTacos, "sender")
//         } : {
//             "type": "card",
//             "body": {
//                 "type": "mrkdwn",
//                 "text": "No tacos received this month."
//             }
//         },
//         {
//             "type": "divider"
//         },
//         {
//             "type": "section",
//             "text": {
//                 "type": "mrkdwn",
//                 "text": `Thanks for recognizing the great work your coworkers are doing! Every taco helps celebrate the team.`
//             }
//         },
//     ];

//     return { text, blocks };
// }