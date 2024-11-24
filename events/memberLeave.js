const { Events, EmbedBuilder: discordEmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const leaveEmbed = new discordEmbedBuilder()
			.setColor('Red')
			.setTitle('Member Left')
			.setDescription(`${member} left the server.`)
			.setThumbnail(member.user.displayAvatarURL())
			.setTimestamp();

		for (const channelId of client.utils.configFile.botLogChannels) {
			const logChannel = member.guild.channels.cache.get(channelId);
			if (logChannel) {
				logChannel.send({ embeds: [leaveEmbed] });
			}
		}
	}
};