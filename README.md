# Drone
Drone Discord bot.

```
mkdir .logs
```
```
mkdir .private
```
```
npm install --save cron
```
```
npm install --save discord.js
```

Create `config.json` in the .private directory and populate with
```
{
    "botId": "<botId>",
    "botOwnerId": "<your Discord Id>",
    "botBaseGuildId": "<guild Id of the bot's main server>",
    "botName": "<what you called the bot on the discord developer portal>",
    "botPublicKey": "<botPublicKey>",
    "botToken": "<botToken>",
    "botInviteLink": "https://discord.com/oauth2/authorize?client_id=<botId>&permissions=8&integration_type=0&scope=bot"
}
```

## Discord Developer Portal Instructions
**Create a new application**:
  - Go to [Discord Developer Portal](https://discord.com/developers/applications).
  - Click `New Application` and follow the prompts.
    - Copy the `APPLICATION ID` to the config.json file as "botId"
    - Set `PUBLIC KEY` to the config.json as "botPublickey"
  - Select `Bot` on the left sidebar.
  - Reset Token:
    - Copy the token to `config.json` as "botToken".
  - Enable Intents:
    - PRESENCE INTENT
    - SERVER MEMBERS INTENT
    - MESSAGE CONTENT INTENT
  - Select `OAuth2` on the left sidebar.
    - select `bot` checkbox
    - select `Administrator` in the bottom section
    - Copy the `GENERATED URL` to config.json as "invitelink"
  - Close the [Discord Developer Portal]
  - Invite the bot to your server using the link you copied.
