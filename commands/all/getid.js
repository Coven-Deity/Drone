const { SlashCommandBuilder, EmbedBuilder: discordEmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get-member-id')
    .setDescription('Member')
    .addUserOption(option =>
      option.setName('member')
        .setDescription('Select user')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.guild.members.fetch();

    try {
      const member = await interaction.options.getUser('member').fetch(true);
      const avatarURL = member.displayAvatarURL({ dynamic: true });
      let bannerURL = null;
      if (member.bannerURL()) {
        bannerURL = member.bannerURL({ dynamic: true });
      }
      let embed = new discordEmbedBuilder()
        .setColor('#007bff')
        .setAuthor({ name: member.tag, iconURL: avatarURL })
        .addFields(
          { name: 'ID', value: member.id },
          { name: 'Username', value: member.username },
          { name: 'Display Name', value: member.displayName }
        )
        .setThumbnail(avatarURL)
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

      if (bannerURL) {
        embed.setImage(bannerURL)
      } else {
        embed.setImage(avatarURL)
      }

      await interaction.reply({ embeds: [embed], ephemeral: false });
    } catch (error) {
      console.error('*** Error fetching member:', error);
      await interaction.reply({ content: 'An error occurred while fetching member information.', ephemeral: true });
    }
  },
}
