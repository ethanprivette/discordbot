const { Client, IntentsBitField, SlashCommandBuilder, Routes } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');

const client = new Client({
    allowedMentions: {
        parse: [`user`, `roles`],
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

	if (commandName === 'test') {
		await interaction.reply('This is a test command.');
    }else if (commandName === 'ping') {
        await interaction.reply('Pong.');
    }else if (commandName === 'help') {
        await interaction.reply('Help me pls.');
    }
});

client.login(token);