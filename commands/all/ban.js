const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('BAN member.')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('id')
        .setDescription('The Discord user ID to BAN')
        .setRequired(false)
    )
    .addUserOption(option =>
      option
        .setName('member')
        .setDescription('The Guild member to BAN')
        .setRequired(false)
    ),

  async execute(interaction) {
    const member = interaction.options.getMember('member');
    const id = interaction.options.getString('id');
    const reason = interaction.options.getString('reason');
    let bannedId;

    // Validate input
    if (!member && !id) {
      return interaction.reply({ content: "Please provide a member to ban (using @mention) or a user ID.", ephemeral: true });
    }

    if (id) {
      const userIdRegex = /^\d{18,19}$/; // Check for a valid Discord user ID format
      if (!userIdRegex.test(id)) {
        return interaction.reply({ content: "Invalid user ID format. Please provide a valid 18-digit Discord user ID.", ephemeral: true });
      }
      bannedId = id;
    } else {
      bannedId = member.user.id;
    }

    try {
      const bannedUser = await interaction.client.users.fetch(bannedId);
      try {
        await bannedUser.send(`You have been banned from ${interaction.guild.name} for: ${reason}`);
      } catch (error) {
        console.error(`Failed to send DM to ${bannedUser.tag}`, error);
      }
      await interaction.guild.members.ban(bannedId, { reason });
      return await interaction.reply({ content: `<@${interaction.user.id}>\n**BANNED**: <@${bannedId}>\n**Discord ID**: ${bannedId}\n**Reason**: ${reason}`, ephemeral: false });
    } catch (error) {
      if (error.code === 50013) { // Missing Permissions error
        return interaction.reply({ content: "You don't have permissions to ban users!", ephemeral: true });
      } else if (error.code === 50010) { // User already banned error
        return interaction.reply({ content: `<@${interaction.user.id}>, User with ID ${bannedId} is already banned.`, ephemeral: true });
      } else {
        console.error(error);
        return interaction.reply({ content: `Something went wrong, check logs!`, ephemeral: false });
      }
    }
  },
};