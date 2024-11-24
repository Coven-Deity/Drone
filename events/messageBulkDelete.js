const { AuditLogEvent, Events, EmbedBuilder: discordEmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.MessageBulkDelete,
	async execute(messages) {
		const guild = messages.first().guild;
		for (const message of messages) {
			try {
				const messageEmbed = new discordEmbedBuilder()
					.setColor('Red')
					.setTitle(`Message deleted in: <#${message[1].channelId}>`)
					.setDescription(`Original Message by ${message[1].author.username}`)
					.addFields(
						{
							name: `CONTENT:`,
							value: message[1].content
						}
					)
					.setTimestamp();

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
	}
};