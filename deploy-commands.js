const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('train').setDescription('Trains units.'),
    new SlashCommandBuilder().setName('ping').setDescription('replies with pong.'),
    new SlashCommandBuilder().setName('help').setDescription('bro it\'s one command cmon.'),
    new SlashCommandBuilder().setName('embedtest').setDescription('Testing embeds rn leave me alone.'),
    new SlashCommandBuilder()
        .setName('trainoptions')
        .setDescription('currently a test for having sub options in the train command')
        .addStringOption(option =>
            option.setName('unit')
                .setDescription('subcommand for training units')
                .setRequired(true)
                .addChoices(
                    { name: 'unit1', value: 'unit1' },
                    { name: 'unit2', value: 'unit2' },
                    { name: 'unit3', value: 'unit3' },
                    { name: 'unit4', value: 'unit4' },
                    
                )),
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands('1009293626951598181', '996660507715043423'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
