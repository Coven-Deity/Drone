const { Events, EmbedBuilder: discordEmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const joinEmbed = new discordEmbedBuilder()
			.setColor('Green')
			.setTitle('Member Joined')
			.setDescription(`${member} joined the server!`)
			.setThumbnail(member.user.displayAvatarURL())
			.addFields(
				{ name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
			)
			.setTimestamp();

		for (const channelId of client.utils.configFile.botLogChannels) {
			const logChannel = member.guild.channels.cache.get(channelId);
			if (logChannel) {
				logChannel.send({ embeds: [joinEmbed] });
			}
		}
	}
}


