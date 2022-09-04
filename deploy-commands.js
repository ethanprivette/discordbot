const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    //new SlashCommandBuilder().setName('train').setDescription('Trains units.'),
    new SlashCommandBuilder().setName('ping').setDescription('replies with pong.'),
    new SlashCommandBuilder().setName('help').setDescription('bro it\'s one command cmon.'),
    new SlashCommandBuilder().setName('embedtest').setDescription('Testing embeds rn leave me alone.'),
    new SlashCommandBuilder()
        .setName('train')
        .setDescription('Trains units.')
        .addStringOption(option =>
            option.setName('unit')
                .setDescription('Subcommand for training units.')
                .setRequired(true)
                .addChoices(
                    { name: '1k infantry', value: '1k infantry' },
                    { name: '5k infantry', value: '5k infantry' },
                    { name: '10k infantry', value: '10k infantry' },
                    { name: '20k infantry', value: '20k infantry' },
                    { name: '8 tanks', value: '4 tanks' },
                    { name: '40 tanks', value: '20 tanks' },
                    { name: '80 tanks', value: '40 tanks' },
                    { name: '160 tanks', value: '80 tanks' },
                    { name: '4 planes', value: '4 planes' },
                    { name: '20 planes', value: '20 planes' },
                    { name: '40 planes', value: '40 planes' },
                    { name: '80 planes', value: '80 planes' },
                    { name: '1 ship', value: '1 ship' },
                    { name: '5 ships', value: '5 ships' },
                    { name: '10 ships', value: '10 ships' },
                    { name: '20 ships', value: '20 ships' },
                )),
    new SlashCommandBuilder()
        .setName('build')
        .setDescription('Builds infrastructure')
        .addStringOption(option =>
            option.setName('infrastructure')
                .setDescription('build infrastructure')
                .setRequired(true)
                .addChoices(
                    { name: 'Step 1', value: 'factories' },
                    { name: 'Step 2', value: 'homes' },
                    { name: 'Step 3', value: 'buffer' },
                    { name: 'Step 4', value: 'bridge' },
                    { name: 'Step 5', value: 'nuke labs' },
                )),
    new SlashCommandBuilder()
        .setName('trainoptions')
        .setDescription('wooper tesing bitches')
        .addStringOption(option =>
                         option.setName('Type')
                            .setDescription('Type')
                            .setRequired(true)
                            .addChoices(
            { name: 'Infantry', value: 'infantry'},
            { name: 'Tank', value: 'tank'},
            { name: 'Plane', value: 'plane'},
            { name: 'Ship', value: 'ship'},
            )
        .addStringOption(option =>
                         option.setName('Amount')
                            .setDescription('amount Of Units')
                            .setRequired(true)
            )),
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands('1009293626951598181', '996660507715043423'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
