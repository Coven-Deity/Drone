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
	const repoPreviousStateFile = 'repoPreviousState.json';
	let repoPreviousState;

	try {
		const repoPreviousStateFileData = readFileSync(repoPreviousStateFile, 'utf8');
		repoPreviousState = JSON.parse(repoPreviousStateFileData);
	} catch (error) {
		if (error.code === 'ENOENT') {
			repoPreviousState = {
				commitCount: 0,
				issueCount: 0,
				pullRequestCount: 0
			};
			writeFileSync(repoPreviousStateFile, JSON.stringify(repoPreviousState));
		} else {
			throw error;
		}
	}

	const repoInfo = await fetchRepoInfo(repoOwner, repoName);
	const currentCommitCount = repoInfo.open_issues_count;
	const currentIssueCount = repoInfo.open_issues_count;
	const currentPullRequestCount = repoInfo.open_pull_requests_count;

	if (currentCommitCount !== repoPreviousState.commitCount ||
		currentIssueCount !== repoPreviousState.issueCount ||
		currentPullRequestCount !== repoPreviousState.pullRequestCount) {
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
			commitCount: currentCommitCount,
			issueCount: currentIssueCount,
			pullRequestCount: currentPullRequestCount
		};
		writeFileSync(repoPreviousStateFile, JSON.stringify(repoPreviousState));
	}
}