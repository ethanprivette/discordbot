const { Client, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize } = require('sequelize');
const talkedRecently = new Set(); 
global.cooldown = 10000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
  });

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

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

    if (commandName === 'embedtest') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Please run the command again in 20 seconds.'})
        } else {
            const testEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Some title')
                .setURL('https://discord.js.org/')
                .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/AfFp7pu.png')
                .addFields(
                    { name: 'Regular field title', value: 'Some value here' },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                    { name: 'Inline field title', value: 'Some value here', inline: true },
                )
                .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
                .setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
            interaction.reply({ embeds: [testEmbed] })
        }
    }
})

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Please run the command again in 5 seconds.'})
        } else {
            interaction.reply('Use /train to train units.')
        }
        talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, 5000);
    }
});

/*client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'train') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Units are already being trained \nPlease wait ' + (cooldown/60000) + ' minutes before training again.'});
        } else {
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
            talkedRecently.add(interaction.user.clientId);
            setTimeout(() => {
                talkedRecently.delete(interaction.user.clientId);
            }, cooldown);
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
        cooldown = 1800000
    }else if (interaction.customId == '8 Tanks'){
        await interaction.reply('Tanks will be ready in 35 minutes.')
        cooldown = 2100000
    }else if (interaction.customId == '4 Planes'){
        await interaction.reply('Planes will be ready in 1 hour.')
        cooldown = 3600000
    }else if (interaction.customId == '1 Ship'){
        await interaction.reply('Ship will be ready in 3 hours.')
        cooldown = 10800000
    }
});
*/

client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;

    global.unitCooldown = 10000
    const selectedunit = interaction.options.getString('unit');

    if (selectedunit === 'infantry') {
        unitCooldown = 1800000
    } else if (selectedunit === 'tanks') {
        unitCooldown = 2100000
    } else if (selectedunit === 'planes') {
        unitCooldown = 3600000
    } else if (selectedunit === 'ships') {
        unitCooldown = 10800000
    }
	const minutesUnitCooldown = unitCooldown/60000

	if (interaction.commandName === 'trainoptions') {
        if (talkedRecently.has(interaction.user.clientId)){
            await interaction.reply(`${selectedunit} are already being trained come back in ` + minutesUnitCooldown + ` minutes.`)
        } else {
            await interaction.reply(`you have selected ${selectedunit}, they will be ready in ` + minutesUnitCooldown + ` minutes.`);
        }
        talkedRecently.add(interaction.user.clientId);
        setTimeout (() => {
            talkedRecently.delete(interaction.user.clientId);
        }, unitCooldown );
	}
});

client.on('interactionCreate', async interaction =>{
    if (!interaction.isChatInputCommand()) return;
    
    global.buildCooldown = 10000
    const selectedbuild = interaction.options.getString('infrastructure');

    if(selectedbuild === 'factories') {
        buildCooldown = 1200000
    } else if (selectedbuild === 'homes') {
        buildCooldown = 2400000
    } else if (selectedbuild === 'buffer') {
        buildCooldown = 4800000
    } else if (selectedbuild === 'bridge') {
        buildCooldown = 9600000
    } else if (selectedbuild === 'nuke labs') {
        buildCooldown = 19200000
    }
    const minutesBuildCooldown = buildCooldown/60000

    if (interaction.commandName === 'build') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: `${selectedbuild} is already being built come back in ` + minutesBuildCooldown + ' minutes. '})
        } else { 
            await interaction.reply(`you have selected ${selectedbuild}, they will be ready in ` + minutesBuildCooldown + ` minutes.`)
        }
        talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, buildCooldown );
    }
});

client.login(token);
