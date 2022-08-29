const { Client, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');

const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`],
        repliedUser: true,
    },
    intents: [botIntents],
});


client.on("ready", () => {
    console.log("Bot is online");
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'train') {
		const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Infantry')
                    .setLabel('Infantry')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Tanks')
                    .setLabel('Tanks')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Planes')
                    .setLabel('Planes')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('Navy')
                    .setLabel('Navy')
                    .setStyle(ButtonStyle.Primary),
            );
        await interaction.reply({ content: 'Which unit would you like to train?', ephemeral: true, components: [row1]});
            }
});

client.on('interactionCreate', async interaction =>{
    if (!interaction.isButton()) return;

    if (interaction.customId == 'Infantry'){
        const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('1k Infantry')
                .setLabel('1k Infantry')
                .setStyle(ButtonStyle.Primary)
        );
            await interaction.reply({ content: 'How many Infantry would you like to train?', ephemeral: true, components: [row2]})
    }else if (interaction.customId == 'Tanks'){
        const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('8 Tanks')
                .setLabel('8 Tanks')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many Tanks would you like to train?', ephemeral: true, components: [row3]})

    }else if (interaction.customId == 'Planes'){
        const row4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('4 Planes')
                .setLabel('4 Planes')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many Planes would you like to train?', ephemeral: true, components: [row4]})
    
    }else if (interaction.customId == 'Navy'){
        const row5 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('1 Ship')
                .setLabel('1 Ship')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many ships would you like to train?', ephemeral: true, components: [row5]})
    }
});

client.on('interactionCreate', async interaction =>{
    if (!interaction.isButton()) return;

    if (interaction.customId == '1k Infantry'){
        await interaction.reply('Infantry will be ready in 30 minutes.')
    }else if (interaction.customId == '8 Tanks'){
        await interaction.reply('Tanks will be ready in 35 minutes.')
    }else if (interaction.customId == '4 Planes'){
        await interaction.reply('Planes will be ready in 1 hour.')
    }else if (interaction.customId == '1 Ship'){
        await interaction.reply('Ship will be ready in 3 hours.')
    }
});

client.login(token);