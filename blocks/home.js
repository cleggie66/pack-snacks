import * as dateFns from 'date-fns';

export function homeView(user, tacoStorage, tacosRemaining) {
  let tacosReceived = tacoStorage[user] ? tacoStorage[user].length : 0;
  let tacosGiven = 0;
  let tacosGivenToday = [];

  // Parse through all tacos
  for (const tacoUser of Object.keys(tacoStorage)) {
    for (const taco of tacoStorage[tacoUser]) {
      if (taco.from === user) {
        // Increase tacos given count
        tacosGiven += 1;

        // Check if the taco was given today
        const date = new Date(parseFloat(taco.ts) * 1000);
        if (dateFns.isSameDay(date, new Date())) {
          tacosGivenToday.push(taco);
        }
      }
    }
  }

  // Format tacos given today
  const tacosGivenTodayFormatted = {};
  for (const taco of tacosGivenToday) {
    if (tacosGivenTodayFormatted[taco.to]) {
      tacosGivenTodayFormatted[taco.to] += 1;
    } else {
      tacosGivenTodayFormatted[taco.to] = 1;
    }
  }

  // Grab a random "out of tacos" gif
  const gifs = [
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTNiZjZxZ2QzbHl0dzl0MWhlODBqZ3Bwc3JidGE2aThzcmhneHZiZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0rzSnwAftzUgEeukf/200.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWxxd2JtMjhuaDh6YnA0ZnU3OWJuY2FzaWJ5cW90bmw4bDc1dGc4diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3orifdO6eKr9YBdOBq/200.gif",
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDJjYXlocXUwdDhocWQ5dHgwazN2dHRpc3g2dGNwdjRheWhhbmVodCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/r0q8JfQLzevKR24Anc/200.gif",
    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExanZyaWJxams4dXVsMjY1aXdtMzdydnI2Nnd4eXJsMWJhYmp4NHhsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iwmtARdVWvh3sUK98R/200.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTRhazBwcDM0NGVubDFibTZvamFuNmpoZDkwYmx2bG1nbHVzdmFrMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1yIIPc4fUiOFxAivF/200.gif",
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHU3NHlreHk0N3A1bmpkNWRrdXo3dmgzbjFkb3Nrb2JveGx3aGxtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5xtDarF8EHJHjPDlOPS/200.gif"
  ];
  const randomGif = gifs[dateFns.getDate(new Date()) % gifs.length];

  return {
    type: "home",
    blocks: [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "Caleb's Pack Snacks",
          "emoji": true
        },
        "level": 1
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": ":taco: All Tacos",
          "emoji": true
        },
        "level": 2
      },
      {
        "type": "divider"
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": `Tacos Recieved — ${tacosReceived}`,
          "emoji": true
        },
        "level": 3
      },
      {
        "type": "rich_text",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "All the tacos you've earned since the beginning of time",
                "style": {
                  "italic": true
                }
              }
            ]
          },
        ]
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": `Tacos Given — ${tacosGiven}`,
          "emoji": true
        },
        "level": 3
      },
      {
        "type": "rich_text",
        "elements": [
          {
            "type": "rich_text_section",
            "elements": [
              {
                "type": "text",
                "text": "Every taco that you've given to all of your awesome teammates",
                "style": {
                  "italic": true
                }
              }
            ]
          },
        ]
      },
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": ":calendar: Today's Tacos",
          "emoji": true
        },
        "level": 2
      },
      {
        "type": "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `_Tacos Given:_`,
        },
      },
      {
        type: "table",
        rows: (() => {
          if (Object.keys(tacosGivenTodayFormatted).length === 0) {
            return [
              [
                {
                  type: "rich_text",
                  elements: [
                    {
                      type: "rich_text_section",
                      elements: [
                        {
                          type: "text",
                          text: "No tacos given today!",
                          style: { bold: true },
                        },
                      ],
                    },
                  ]
                },
              ],
            ]
          } else {
            return Object.keys(tacosGivenTodayFormatted).map((user) => {
              return [
                {
                  type: "rich_text",
                  elements: [
                    {
                      type: "rich_text_section",
                      elements: [
                        {
                          type: "user",
                          user_id: user,
                          style: { bold: true },
                        },
                      ],
                    },
                  ]
                },
                (() => {
                  const elements = [];
                  for (let i = 0; i < tacosGivenTodayFormatted[user]; i++) {
                    elements.push({
                      type: "emoji",
                      name: "taco"
                    });
                  }
                  return {
                    type: "rich_text",
                    elements: [
                      {
                        type: "rich_text_section",
                        elements: elements
                      }
                    ]
                  };
                })(),
              ]
            })
          }
        })(),
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `_Tacos Remaining:_`,
        },
      },
      (() => {
        return tacosRemaining > 0 ? {
          type: "table",
          rows: [
            [
              {
                type: "rich_text",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: (() => {
                      const elements = [];
                      for (let i = 0; i < tacosRemaining; i++) {
                        elements.push({
                          type: "emoji",
                          name: "taco"
                        });
                      }
                      return elements;
                    })()
                  }
                ]
              }
            ]
          ]
        } : {
          "type": "image",
          "image_url": randomGif,
          "alt_text": "no more tacos"
        }
      })()
    ],
  };
}