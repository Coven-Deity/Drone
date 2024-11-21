const { AttachmentBuilder: discordAttachmentBuilder, EmbedBuilder: discordEmbedBuilder, Events: discordEvents, PermissionsBitField } = require('discord.js');

module.exports = {
    name: discordEmbedBuilder,
    name: discordAttachmentBuilder,
    name: discordEvents.MessageCreate,

    async execute(interaction) {
        if (!interaction.author.bot) {

            const lowerCaseContent = interaction.content.toLowerCase();
            const currentTime = new Date().toLocaleString();

            const regEx = /^hello bot$/;
            if ((lowerCaseContent.match(regEx) !== null)) {
                const embed = new discordEmbedBuilder()
                    .setTitle('Hey there!')
                    .setDescription(`Hey <@${interaction.author.id}>, glad you're here! What can I do for you today? `)
                    .setFooter({
                        text: `Drone`,
                        iconURL: `https://raw.githubusercontent.com/Coven-Deity/Drone/refs/heads/main/Drone_icon.jpg`
                    });
                embed.addFields({ name: 'Current Time', value: currentTime });
                return await interaction.channel.send({ embeds: [embed] });
            }

        }
    }
}