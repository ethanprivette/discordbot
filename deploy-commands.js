const { SlashCommandBuilder, Routes, CommandInteractionOptionResolver } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

// GLOBAL COMMANDS
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

rest.put(Routes.applicationCommands('1009293626951598181'), { body: commands })
    .then(() => console.log('Successfully registered global commands.'))
    .catch(console.error);

// ADMIN COMMANDS
const admincommands = [
        new SlashCommandBuilder().setName('admintest').setDescription('testing command for admins'),
        new SlashCommandBuilder().setName('consoletest').setDescription('testing console tracing'),
        new SlashCommandBuilder()
            .setName('addtag')
            .setDescription('adding tags')
            .addStringOption(option => option.setName('name').setDescription('tagname').setRequired(true))
            .addStringOption(option => option.setName('description').setDescription('tagdescription').setRequired(true)),
            new SlashCommandBuilder()
                .setName('fetchtag')
                .setDescription('fetches a tag')
                .addStringOption(option => option.setName('name').setDescription('select a tag to fetch').setRequired(true)),
            new SlashCommandBuilder()
                .setName('taginfo')
                .setDescription('displays a tag\'s info')
                .addStringOption(option => option.setName('name').setDescription('displays info on the selected tag').setRequired(true)),
            new SlashCommandBuilder()
                .setName('showtags')
                .setDescription('displays all created tags'),
            new SlashCommandBuilder()
                .setName('deletetag')
                .setDescription('deleted selected tag')
                .addStringOption(option => option.setName('name').setDescription('deletes selected tag').setRequired(true)),

    ]
    
        .map(command => command.toJSON());
    
    const rest1 = new REST({ version: '10' }).setToken(token);
    
    rest1.put(Routes.applicationGuildCommands('1009293626951598181', '1017418336293896214'), { body: admincommands })
        .then(() => console.log('Successfully registered admin commands.'))
        .catch(console.error);
