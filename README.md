# 🐺 Pack Snacks

> A Slack app for keeping track of tacos sent to teammates to show appreciation

<img src="./assets/demo-screenshot-1.jpg" alt="Demo screenshot" height="300" />


## Overview

Pack Snacks is a Slack app that keeps track of tacos sent in a public Slack channel. It sets daily limits for users to send tacos and keeps track of all totals.

For now, the app doesn't use a db, which is a trade-off to keep the app lightweight and easy to setup at the expense of some more expanded features that would require an external DB. The app treats Slack itself as the DB, parsing all channel messages to count taco totals on startup.

Built with [Bolt for JavaScript](https://docs.slack.dev/tools/bolt-js/).


## Usage

Give tacos in any public channel the bot is in:

- Mention a user or group and include `:taco:` in your message
- React with `:taco:` on another user's message

Each `:taco:` counts as one taco per recipient. Daily limit is 5 — (10 on Tuesdays)

Open the home tab to view daily and overall totals


## Setup

1. Install Slack App to your workspace
2. Set environment variables:

```sh
export SLACK_BOT_TOKEN=xoxb-your-bot-token
export SLACK_APP_TOKEN=xapp-1-your-app-token
```

3. Run the app:

```sh
slack run
```

4. Invite the bot to any public channels for sending tacos

## Future TO-DOs

- Dedicated DB
- Monthly recap messages
- Ability to redeem tacos for rewards _(merch, coffee, lunch, etc...)_
- Additional "snacks" with various values _(i.e. a guac emoji worth 10 tacos with a 1/week limit)_