const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('replies with pong.'),
    new SlashCommandBuilder().setName('big_red_button').setDescription('nukes everyone'),
    new SlashCommandBuilder().setName('help').setDescription('bro it\'s one command cmon.'),
    new SlashCommandBuilder().setName('embedtest').setDescription('Testing embeds rn leave me alone.'),
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
        .setName('traintest')
        .setDescription('idk man')
        .addSubcommand(subcommand =>
            subcommand
                .setName('units')
                .setDescription('trains units')
                .addStringOption(option => option.setName('units').setDescription('select what unit to train').setRequired(true).addChoices(
                    { name: 'infantry', value: 'infantry' },
                    { name: 'tanks', value: 'tanks' },
                    { name: 'planes', value: 'planes' },
                    { name: 'ships', value: 'ships' },
                ))
                .addIntegerOption(option => option.setName('amount').setDescription('train multiple units').setRequired(true))),
]

    .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands('1009293626951598181', '996660507715043423'), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
