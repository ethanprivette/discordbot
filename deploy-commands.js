const { SlashCommandBuilder, Routes, CommandInteractionOptionResolver, Client, IntentsBitField, NewsChannel } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');
const botIntents = new IntentsBitField(8)

// GLOBAL COMMANDS
const commands = [
    new SlashCommandBuilder().setName('big_red_button').setDescription('nukes everyone'),
    new SlashCommandBuilder().setName('help').setDescription('bro it\'s one command cmon.'),
    new SlashCommandBuilder().setName('fuckyou').setDescription('fuck you'),
    new SlashCommandBuilder().setName('embedtest').setDescription('test embed'),
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
        .addStringOption(option => option.setName('teamname').setDescription('select which team to train units to').setRequired(true))
        .addStringOption(option => option.setName('units').setDescription('select what unit to train').setRequired(true).addChoices(
            { name: 'infantry', value: 'infantry' },
            { name: 'tanks', value: 'tanks' },
            { name: 'planes', value: 'planes' },
            { name: 'ships', value: 'ships' },
        ))
        .addIntegerOption(option => option.setName('amount').setDescription('train multiple units').setRequired(true)),
    new SlashCommandBuilder()
        .setName('troll')
        .setDescription('sends a message in a specified channel')
        .addStringOption(option => option.setName('message').setDescription('message to send troll').setRequired(true))
        .addChannelOption(option => option.setName('channel').setDescription('channel to send troll').setRequired(true)),
    new SlashCommandBuilder().setName('balance').setDescription('checks users balance'),
    new SlashCommandBuilder().setName('inventory').setDescription('shows users inventory'),
    new SlashCommandBuilder().setName('transfer').setDescription('transfer energy to another user'),
    new SlashCommandBuilder().setName('buy').setDescription('buys an item from the shop'),
    new SlashCommandBuilder().setName('shop').setDescription('displays the item shop'),
    new SlashCommandBuilder().setName('leaderboard').setDescription('shows the leaderboard'),
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
        new SlashCommandBuilder().setName('disablebot').setDescription('disables the bot'),
        new SlashCommandBuilder().setName('disbandallteams').setDescription('disbands all teams made by user'),
        new SlashCommandBuilder()
            .setName('restoreteam')
            .setDescription('restores the selected team')
            .addStringOption(option=> option.setName('team').setDescription('team name').setRequired(true)),
        new SlashCommandBuilder()
            .setName('teamcreatetest')
            .setDescription('creates a team')
            .addStringOption(option => option.setName('name').setDescription('team name').setRequired(true))
            .addStringOption(option => option.setName('user2').setDescription('USE CLIENT ID'))
            .addStringOption(option => option.setName('user3').setDescription('USE CLIENT ID'))
            .addStringOption(option => option.setName('user4').setDescription('USE CLIENT ID')),
        new SlashCommandBuilder()
            .setName('teaminfo')
            .setDescription('displays a team\'s members')
            .addStringOption(option => option.setName('name').setDescription('select a team to see').setRequired(true)),
        new SlashCommandBuilder()
            .setName('disbandteam')
            .setDescription('disbands a team')
            .addStringOption(option => option.setName('teamname').setDescription('name of the team to disband').setRequired(true)),
        new SlashCommandBuilder()
            .setName('leaveteam')
            .setDescription('leave a team')
            .addStringOption(option => option.setName('teamname').setDescription('team to leave').setRequired(true)),
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
        new SlashCommandBuilder()
            .setName('showteams')
            .setDescription('displays all created teams'),
        new SlashCommandBuilder()
            .setName('showteamunits')
            .setDescription('displays a team\'s units')
            .addStringOption(option => option.setName('team').setDescription('name of team to display').setRequired(true)),

    ]
    
        .map(command => command.toJSON());
    
    const rest1 = new REST({ version: '10' }).setToken(token);
    
    rest1.put(Routes.applicationGuildCommands('1009293626951598181', '1017418336293896214'), { body: admincommands })
        .then(() => console.log('Successfully registered admin commands.'))
        .catch(console.error);