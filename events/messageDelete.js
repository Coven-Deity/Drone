const { Events, EmbedBuilder: discordEmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageDelete,
	async execute(message) {
		const guild = await client.guilds.fetch(message.guildId);
		try {
			const messageEmbed = new discordEmbedBuilder()
				.setColor('Red')
				.setTitle(`Message deleted in: ${message.channel}`)
				.setTimestamp()

			for (const channelId of client.utils.configFile.botLogChannels) {
				const logChannel = guild.channels.cache.get(channelId);
				if (logChannel) {
					logChannel.send({ embeds: [messageEmbed] });
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
};