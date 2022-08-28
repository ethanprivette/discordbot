const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('test').setDescription('testing command.'),
    new SlashCommandBuilder().setName('ping').setDescription('replies with pong.'),
    new SlashCommandBuilder().setName('help').setDescription('idk im just trying everything at this point'),
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands('1009293626951598181', '996660507715043423'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);