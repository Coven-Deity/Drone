const { Events } = require('discord.js');
const { CronJob } = require('cron');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const now = new Date();
		console.log(`  Current Time:\n${now}`);
		console.log(`  Logged into Discord as: \n${client.user.tag}`);

		const jobsEveryHour = new CronJob('0 * * * * *', async () => {
			client.user.setActivity(`drone games!`);
		}, null, true, 'Etc/UTC');
		jobsEveryHour.start();
	}
}
