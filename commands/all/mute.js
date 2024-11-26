const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('MUTE member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('member-to-mute')
                .setDescription('Select member')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the MUTE.')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('length')
                .setDescription('length in minutes')
                .setMinValue(1)
                .setMaxValue(8640)
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();
        const memberToMute = interaction.guild.members.cache.get(interaction.options.getUser('member-to-mute').id);
        const reason = interaction.options.getString('reason');
        const length = interaction.options.getInteger('length');
        const msDuration = length * 60000;
        if (memberToMute.isCommunicationDisabled()) {
            return await interaction.editReply({ content: `User ${memberToMute} is already muted.` });
        }
        try {
            await muteUser(memberToMute, reason, msDuration);
            await interaction.editReply({ content: `<@${interaction.member.user.id}> muted ${memberToMute} for ${length} minutes, reason: ${reason}.` });
            await sendMuteDM(memberToMute, reason, length);
        } catch (error) {
            if (error.code === 50013) { // Missing Permissions error
                return interaction.editReply({ content: "I don't have permissions to mute this user!" });
            } else {
                console.error(error);
                return interaction.editReply({ content: `Something went wrong! Check logs.`, ephemeral: false });
            }
        }
    }
}

async function muteUser(member, reason, duration) {
    try {
        await member.timeout(duration, reason);
    } catch (error) {
        throw error;
    }
}

async function sendMuteDM(member, reason, duration) {
    try {
        await member.send(`You have been muted for ${duration} minutes. Reason: ${reason}`);
    } catch (error) {
        console.error(`Failed to send DM to ${member.user.tag}`);
    }
}
