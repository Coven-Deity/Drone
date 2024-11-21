const { AttachmentBuilder: discordAttachmentBuilder, EmbedBuilder: discordEmbedBuilder, Events: discordEvents, PermissionsBitField } = require('discord.js');

module.exports = {
    name: discordEmbedBuilder,
    name: discordAttachmentBuilder,
    name: discordEvents.MessageCreate,

    async execute(interaction) {
        if (!interaction.author.bot) {

            const lowerCaseContent = interaction.content.toLowerCase();

            regEx = new RegExp(`^hello bot`, 'g');
            if ((lowerCaseContent.match(regEx) !== null)) {
                const embed = new discordEmbedBuilder()
                    .setTitle('Hello Message')
                    .setDescription(`Hello <@${interaction.author.id}>`)
                    .setFooter({
                        text: `Drone`,
                        iconURL: `https://raw.githubusercontent.com/Coven-Deity/Drone/refs/heads/main/Drone_avatar.png`
                    });
                embed.addFields({ name: 'Field1', value: `Field1_Value` });
                return await interaction.channel.send({ embeds: [embed] });
            }

        }
    }
}