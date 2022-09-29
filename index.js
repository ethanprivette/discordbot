const { Client, Collection, Formatters, GatewayIntentBits, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength, Team } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize, Transaction, Op } = require('sequelize');
const wait = require('node:timers/promises')
const talkedRecently = new Set(); 
const { Users, CurrencyShop } = require('./dbObjects.js');
const { SqlError } = require('mariadb');
const { ADDRGETNETWORKPARAMS } = require('node:dns');

global.cooldown = 10000;
global.unitCooldown = 60000;

const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`, `everyone`],
        repliedUser: true,
    },
    intents: [botIntents],
});
const currency = new Collection();

function log(msg, key) {
	var undef;
	console.log(msg);
	var now = new Date();
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
				    channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*`))
	    });
        } else {
		        const channel = client.channels.fetch('1017927935488966697');
			        channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*`))
        }
    }

function err(msg, err, key) {
	var undef;
	console.error(msg, err);
	var now = new Date();
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
				    channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*: ${err}`))
	    });
        } else {
		        const channel = client.channels.fetch('1017927935488966697');
			        channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*: ${err}`))
        }
    }

//sequelize//

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'path/to/database.sqlite'
  });

try {
    sequelize.authenticate();
    log('Connection has been established successfully.')
  } catch (error) {
    err('Unable to connect to the database:', error)
  }


const Times = sequelize.define("Times", {
	name: {
		type: Sequelize.STRING,
	},
  time: {
    type: Sequelize.STRING,
  },
},
{
  timestamps: false,
});


//
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

const Teams = sequelize.define('teams', {
    name: {
        type: Sequelize.STRING,
        unique: true,
    },
    founder: Sequelize.STRING,
    user2: Sequelize.STRING,
    user3: Sequelize.STRING,
    user4: Sequelize.STRING,
});

client.once('ready', client => {
	Tags.sync();
    Teams.sync();
	Times.sync();

	log(`Logged in as ${client.user.tag}!`, client)	
});
//

try {
	const now = new Date();
  const year = now.getFullYear();
  const mes = now.getMonth()+1;
  const dia = now.getDate();
  const fecha = `${dia}-${mes}-${year}`;
	const time = Times.findOne({ where: { time: fecha } });
	log(time)
	client.on('ready', client => {
		const channel = client.channels.fetch('1017927935488966697');
		if (time) {
			Times.destroy({
				where: {},
				truncate: true
			});
			const timecreate = Times.create({
					name: 'time',
					time: fecha,
				});
			return channel.then(channel=>channel.send(`first option occurred`))
			
		}
			Times.destroy({
				where: {},
				truncate: true
			});
			const timecreate = Times.create({
					name: 'time',
					time: fecha,
				});

			return channel.then(channel=>channel.send(`second option occurred`))
	});
	} catch (error) {
	err('youfuckedupwooper', error)
}

//
client.on('ready', client => {
    log('Bot is online', client)
});

function addTeam(teamName, user2, user3, user4, interaction) {
    try {
        const team = Teams.create({
            name: teamName,
            founder: interaction.user.username,
            user2: user2,
            user3: user3,
            user4: user4,
        });

        return log(`team ${team.teamName} created`, client)
    }
    catch (error) {
        err(`Something went wrong`, error, client)
    }
}

function addTag(tagName, tagDescription, interaction) {
    try {
        // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
        const tag = Tags.create({
            name: tagName,
            description: tagDescription,
            username: interaction.user.username,
        });

        return interaction.reply(`tag ${tag.tagname} added.`);
    }
    catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return interaction.reply('That tag already exists.');
        }

        return interaction.reply('Something went wrong with adding a tag.');
    }
}

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
    const adminIDs = ['601077405481828362', '338080523886919680']
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
    } else if (commandName === 'fuckyou') {
        if (client.clientId === adminIDs)
            await interaction.reply('@everyone Fuck You');
        else return;
    }
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'teamcreatetest') {
        const teamName = interaction.options.getString('name')
        const target = interaction.options.getUser('user')
        const founder = interaction.user.username

        try {
            const team = await Team.create({
                name: teamName,
                founder: founder,
                user2: target,
                user3: target,
                user4: target,
            });

            addTeam(team.name, target, target, target, interaction)

            log(`New team ${team.name} has been created`, client);
            return interaction.reply(`Team ${team.name} has been created.`);
        }
        catch (error) {
            err(`Team ${teamName} failed to be created`, error, client)
        }
    }
});

/*
testin
*/
client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
    const { commandName } = interaction;
    const { wooperId } = '338080523886919680';
    const { ethonkosID } = '601077405481828362';
    const { chnl } = interaction.options.getChannel('channel');
    const { msg } = interaction.options.getString('message');

    if (commandName === 'troll' && (interaction.user.clientId === wooperId || ethonkosID)) {
        chnl.send(msg.content)
            .then(msg => log(`Message ${msg.content} sent in ${chnl}`))
        log(`troll command used`, client)
    } else {
        err(`Troll failed`, error, client)
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
        const tagName = 'train'
		const unitAmount = interaction.options.getInteger('amount'); //tag amount
		const unitType = interaction.options.getString('units'); //tag description
		switch (unitType) {
			case 'infantry' :
				if (unitAmount <= 999 >= 20001) {
                    unitCooldown = 1800*unitAmount;
					testfunction(unitType, unitAmount, true)
                    addTag(tagName, unitType, interaction)
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
	
	log('function successful', interaction);
    log(`Current cooldown: ${unitCooldown/60000}`, interaction);
	if (over === false) {
	interaction.reply('you selected ' + amount + ' ' + type)
	} else if (over === true) {
	interaction.reply('you selected too many ' + type)	
	}
};

	
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

    const username = client.user.username
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

            log(`New tag **${tag.name}** has been added.`, client);
			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}
            log(`Tag **${tag.name}** failed to add.`, client)
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
    
            log(`Tag **${tag.name}** has been fetched by ${username}.`, client)
            return interaction.reply(tag.get('description'));
        }
        log(`Tag **${tag.name}** not found`, client)
        return interaction.reply(`Could not find tag: ${tagName}.`);
    }
    else if (commandName == 'taginfo') {
        const tagName = interaction.options.getString('name');
    
        // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
        const tag = await Tags.findOne({ where: { name: tagName } });
    
        if (tag) {
            log(`Tag **${tag.name}** was accessed by ${username}.`, client)
            return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
        }
    
        return interaction.reply(`Could not find tag: ${tagName}`);
    }
    else if (commandName === 'showtags') {
        // equivalent to: SELECT name FROM tags;
        const tagList = await Tags.findAll({ attributes: ['name'] });
        const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    
        log(`Tag list was accessed by ${username}.`, client)
        return interaction.reply(`List of tags: ${tagString}`);
    }
    else if (commandName === 'deletetag') {
        const tagName = interaction.options.getString('name');
        // equivalent to: DELETE from tags WHERE name = ?;
        const rowCount = await Tags.destroy({ where: { name: tagName } });
    
        if (!rowCount) return interaction.reply('That tag doesn\'t exist.');
    
        log(`Tag **${tagName}** was deleted.`, client)
        return interaction.reply('Tag deleted.');
    }
});

Reflect.defineProperty(currency, 'add', {
	value: async (id, amount) => {
		const user = currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: id => {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async () => {
    const storedBalances = await Users.findAll();
	storedBalances.forEach(b => currency.set(b.user_id, b));

	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	if (commandName === 'balance') {
        const target = interaction.options.getUser('user') ?? interaction.user;

        return interaction.reply(`${target.tag} has ${currency.getBalance(target.id)}💰`);
    } 
    else if (commandName === 'inventory') {
        const target = interaction.options.getUser('user') ?? interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();
    
        if (!items.length) return interaction.reply(`${target.tag} has nothing!`);
    
        return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
    } 
    else if (commandName === 'transfer') {
        const currentAmount = currency.getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');
    
        if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
        if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);
    
        currency.add(interaction.user.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);
    
        return interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(interaction.user.id)}💰`);
    } 
    else if (commandName === 'buy') {
        const itemName = interaction.options.getString('item');
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
    
        if (!item) return interaction.reply(`That item doesn't exist.`);
        if (item.cost > currency.getBalance(interaction.user.id)) {
            return interaction.reply(`You currently have ${currency.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
        }
    
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        currency.add(interaction.user.id, -item.cost);
        await user.addItem(item);
    
        return interaction.reply(`You've bought: ${item.name}.`);
    } 
    else if (commandName === 'shop') {
        const items = await CurrencyShop.findAll();
        return interaction.reply(items.map(i => `${i.name}: ${i.cost}💰`).join('\n'));
    } 
    else if (commandName === 'leaderboard') {
        return interaction.reply(
                currency.sort((a, b) => b.balance - a.balance)
                    .filter(user => client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                    .join('\n'),
        );
    }
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'disablebot'){
        log(`Bot has been disabled.`, interaction)
        setTimeout(() => {
            client.destroy();
        }, 5000 );
    }
});

client.login(token);
