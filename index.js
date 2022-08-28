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
		const row = new ActionRowBuilder()
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
        await interaction.reply({ content: 'Which unit would you like to train?', components: [row]});
            }
});

client.on('interactionCreate', async interaction =>{
    if (!interaction.isButton()) return;

    if (interaction.customId == 'Infantry'){
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('1k Infantry')
                .setLabel('1k Infantry')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many Infantry would you like to train?', components: [row]})

    }else if (interaction.customId == 'Tanks'){
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('8 Tanks')
                .setLabel('8 Tanks')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many Tanks would you like to train?', components: [row]})

    }else if (interaction.customId == 'Planes'){
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('4 Planes')
                .setLabel('4 Planes')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many Planes would you like to train?', components: [row]})
    
    }else if (interaction.customId == 'Navy'){
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('1 Ship')
                .setLabel('1 Ship')
                .setStyle(ButtonStyle.Primary),
        );
            await interaction.reply({ content: 'How many ships would you like to train?', components: [row]})
    }
});

client.on('interactionCreate', async interaction =>{
    if (!interaction.isButton()) return;

    if (interaction.customId == '4 planes'){
        await interaction.reply('Planes will be ready in 1 hour.')
    }
});

client.login(token);