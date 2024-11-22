const { EmbedBuilder: discordEmbedBuilder, Events } = require('discord.js');
const { CronJob } = require('cron');
const { readFileSync, writeFileSync } = require('node:fs');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const now = new Date();
		console.log(`  Current Time:\n${now}`);
		console.log(`  Logged into Discord as: \n${client.user.tag}`);

		await client.guilds.cache.forEach(async (guild) => {
			console.log(`${guild.name} | ${guild.id}`);
		})

		const jobsEveryHour = new CronJob('0 * * * * *', async () => {
			client.user.setActivity(`drone games!`);
			checkForRepoChanges(client.utils.configFile.botRepoOwner, client.utils.configFile.botRepoName);
		}, null, true, 'Etc/UTC');
		jobsEveryHour.start();
	}
}

async function fetchRepoInfo(repoOwner, repoName) {
	const url = `https://api.github.com/repos/${repoOwner}/${repoName}`;
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

async function checkForRepoChanges(repoOwner, repoName) {
	const now = new Date();
	const isoString = now.toISOString();
	const repoPreviousStateFile = 'repoPreviousState.json';
	let repoPreviousState;

	try {
		const repoPreviousStateFileData = readFileSync(repoPreviousStateFile, 'utf8');
		repoPreviousState = JSON.parse(repoPreviousStateFileData);
	} catch (error) {
		if (error.code === 'ENOENT') {
			repoPreviousState = {
				updated_at: isoString,
				size: 0,
				open_issues_count: 0
			};
			writeFileSync(repoPreviousStateFile, JSON.stringify(repoPreviousState));
		} else {
			throw error;
		}
	}
	const repoInfo = await fetchRepoInfo(repoOwner, repoName);
	const updated_at = repoInfo.updated_at;
	const size = repoInfo.size;
	const open_issues_count = repoInfo.open_issues_count;

	if (updated_at !== repoPreviousState.updated_at ||
		size !== repoPreviousState.size ||
		open_issues_count !== repoPreviousState.open_issues_count) {
		const embed = new discordEmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`New activity in the GitHub Repository: ${repoOwner}/${repoName}`)
			.setURL(`https://github.com/${repoOwner}/${repoName}`)
			.setDescription('Check out the latest updates!')
			.setTimestamp();
		for (const channelData of client.utils.configFile.repoUpdateChannels) {
			const channelId = channelData.channel;
			const channel = client.channels.cache.get(channelId);
			if (channel) {
				channel.send({ embeds: [embed] });
			} else {
				console.error(`Could not find channel with ID ${channelId}`);
			}
		}

		repoPreviousState = {
			updated_at: updated_at,
			size: size,
			open_issues_count: open_issues_count
		};
		writeFileSync(repoPreviousStateFile, JSON.stringify(repoPreviousState));
	}
}