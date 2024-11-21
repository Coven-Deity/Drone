const { readdirSync } = require('node:fs');
const { setTimeout } = require('node:timers/promises');
const { join } = require('node:path');
const configFile = require('./.private/config.json');
const { Client, Collection, IntentsBitField, Partials } = require('discord.js');
const _partials = [
	Partials["User"],
	Partials["Channel"],
	Partials["GuildMember"],
	Partials["Message"],
	Partials["Reaction"],
];
const _intents = new IntentsBitField([
	"Guilds",
	"GuildModeration",
	"GuildEmojisAndStickers",
	"GuildIntegrations",
	"GuildBans",
	"GuildInvites",
	"GuildMembers",
	"GuildMessageReactions",
	"GuildMessageTyping",
	"GuildMessages",
	"GuildPresences",
	"GuildScheduledEvents",
	"GuildVoiceStates",
	"GuildWebhooks",
	"DirectMessages",
	"DirectMessageTyping",
	"DirectMessageReactions",
	"MessageContent",
	"AutoModerationConfiguration",
	"AutoModerationExecution"
]);
global.client = new Client({ partials: _partials, intents: _intents });
client.commands = new Collection();
const foldersPath = join(__dirname, 'commands');
const commandFolders = readdirSync(foldersPath);
const eventsPath = join(__dirname, 'events');
const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.js'));

client.utils = {
	configFile,
	sleep: async function (milliseconds) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, milliseconds);
		});
	}
}

for (const folder of commandFolders) {
	const commandsPath = join(foldersPath, folder);
	const commandFiles = readdirSync(commandsPath).filter(file => {
		return file.endsWith('.js') && !file.endsWith('_main.js');
	});
	for (const file of commandFiles) {
		const filePath = join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

for (const file of eventFiles) {
	const filePath = join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(configFile.botToken);
