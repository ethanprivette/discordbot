const { Client, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize, Transaction } = require('sequelize');
const talkedRecently = new Set(); 
global.cooldown = 10000;
global.unitCooldown = 60000;

//sequelize//
const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`, `everyone`],
        repliedUser: true,
    },
    intents: [botIntents],
});

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

const Tags = sequelize.define('tags', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    description: Sequelize.TEXT,
    username: Sequelize.STRING,
    usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

client.once('ready', () => {
	Tags.sync();

	console.log(`Logged in as ${client.user.tag}!`);
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

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

});


/*
testin
*/
client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
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
        } talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, buildCooldown );
    }
});

client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
    if (interaction.commandName === 'big_red_button') {
        interaction.reply(`@everyone \nEveryone but the Checks now dead from nuclear fallout.`)
    }
});


client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
	if (interaction.commandName === 'traintest') {
		var over;
		const unitAmount = interaction.options.getInteger('amount');
		const unitType = interaction.options.getString('units');
		switch (unitType) {
			case 'infantry' :
				if (unitAmount <= 999 >= 20001) {
                    unitCooldown = 1800*unitAmount;
					testfunction(unitType, unitAmount, true)
				} else {
					testfunction(unitType, unitAmount, false)
				}
				break;
			case 'tanks' :
				if (unitAmount >= 9) {
                    unitCooldown = 262500*unitAmount;
					testfunction(unitType, unitAmount, true)
				} else {
					testfunction(unitType, unitAmount, false)
				} 
				break;
			case 'planes' :
				if (unitAmount >= 5) {
                    unitCooldown = 900000*unitAmount;
					testfunction(unitType, unitAmount, true)
				} else {
					testfunction(unitType, unitAmount, false)
				}
				break;
			case 'ships' :
				if (unitAmount >= 2) {
                    unitCooldown = 10800000*unitAmount;
					testfunction(unitType, unitAmount, true)
				} else {
					testfunction(unitType, unitAmount, false)
				}
				break;
			default:
			break;
				
		}
	}
        function testfunction(type, amount, over) {
	
	console.log('function successful');
    console.log(`Current cooldown: ${unitCooldown/60000}`);
	if (over === false) {
	interaction.reply('you selected ' + amount + ' ' + type)
	} else if (over === true) {
	interaction.reply('you selected too many ' + type)	
	}
};

	
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});

			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			return interaction.reply('Something went wrong with adding a tag.');
		}
	}
    else if (commandName === 'fetchtag') {
        const tagName = interaction.options.getString('name');
    
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
    
        if (tag) {
            // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
            tag.increment('usage_count');
    
            return interaction.reply(tag.get('description'));
        }
    
        return interaction.reply(`Could not find tag: ${tagName}`);
    }
    else if (commandName == 'taginfo') {
        const tagName = interaction.options.getString('name');
    
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
    
        if (tag) {
            return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
        }
    
        return interaction.reply(`Could not find tag: ${tagName}`);
    }
    else if (commandName === 'showtags') {
        // equivalent to: SELECT name FROM tags;
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    
        return interaction.reply(`List of tags: ${tagString}`);
    }
    else if (commandName === 'deletetag') {
        const tagName = interaction.options.getString('name');
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });
    
        if (!rowCount) return interaction.reply('That tag doesn\'t exist.');
    
        return interaction.reply('Tag deleted.');
    }
});


/*
client.on('interactionCreate', async interaction =>{
    if (!interaction.isChatInputCommand()) return;

    const unitAmount = interaction.options.getInteger('amount');
    global.trainCooldown = 0

    if (interaction.commandName === 'traintest') {
        if (interaction.options.getString('units') === 'infantry') {
            trainCooldown = 1800000*unitAmount
            if (talkedRecently.has(interaction.user.clientId)){
                await interaction.reply(`Infantry is already being trained come back in ${trainCooldown/60000} minutes.`)
            } else {
            await interaction.reply(`Infantry will be ready in ${trainCooldown/60000} minutes.`)
            } talkedRecently.add(interaction.user.clientId);
            setTimeout(() =>{
                talkedRecently.delete(interaction.user.clientId);
            }, trainCooldown );
        } else if (interaction.options.getString('units') === 'tanks') {
            trainCooldown = 2100000*unitAmount
            if (talkedRecently.has(interaction.user.clientId)){
                await interaction.reply(`Tanks are already being trained come back in ${trainCooldown/60000} minutes.`)
            } else {
                await interaction.reply(`Tanks will be ready in ${trainCooldown/60000} minutes.`)
            } talkedRecently.add(interaction.user.clientId);
            setTimeout(() =>{
                talkedRecently.delete(interaction.user.clientId);
            }, trainCooldown );
        } else if (interaction.options.getString('units') === 'planes') {
            trainCooldown = 3600000*unitAmount
            if (talkedRecently.has(interaction.user.clientId)){
                await interaction.reply(`Planes are already being trained come back in ${trainCooldown/60000} minutes.`)
            } else {
                await interaction.reply(`Planes will be ready in ${trainCooldown/60000} minutes.`)
            } talkedRecently.add(interaction.user.clientId);
            setTimeout(() => {
                talkedRecently.delete(interaction.user.clientId);
            }, trainCooldown );
        } else if (interaction.options.getString('units') === 'ships') {
            trainCooldown = 10800000*unitAmount
            if (talkedRecently.has(interaction.user.clientId)){
                await interaction.reply(`Ships are already being trained come back in ${trainCooldown/60000} minutes.`)
            } else {
                await interaction.reply(`Ships will be ready in ${trainCooldown/60000} minutes.`)
            } talkedRecently.add(interaction.user.clientId);
            setTimeout(() => {
                talkedRecently.delete(interaction.user.clientId);
            }, trainCooldown );
        }
    }
})
*/
client.login(token);
