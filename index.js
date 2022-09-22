const { Client, Collection, Formatters, GatewayIntentBits, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize, Transaction, Op } = require('sequelize');
const talkedRecently = new Set(); 
const { Users, CurrencyShop } = require('./dbObjects.js');

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

//log function test
/*
function log(msg) {
    console.log(msg);

    client.on('ready', client => {
        const channel = client.channels.fetch('1017927935488966697');
            channel.then(channel=>channel.send(msg))
    })
}

function logerror(msg, errormsg) {
    console.error(msg, errormsg);
    client.on('ready', client => {
        const channel = client.channels.fetch('1017927935488966697');
            channel.then(channel=>channel.send(msg))
    })
}
*/

/*
con = {
   log: function(msg) {
		console.log(msg);
		client.on('ready', client => {
        const channel = client.channels.fetch('1017927935488966697');
            channel.then(channel=>channel.send(msg))
		};
	},
   error: function(msg, errormsg) {
		console.error(msg, errormsg);
		client.on('ready', client => {
			const channel = client.channels.fetch('1017927935488966697');
				channel.then(channel=>channel.send(msg, errormsg))
		};
   }
}
*/

function log(msg, key) {
	console.log(msg);
	var now = new Date();
	    if (key === 'undefined') {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
				    channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*`))
	    });
        } else {
		console.log(key + ' = key ');
		        var channel = key.channels.fetch('1017927935488966697');
			        channel.then(channel=>channel.send(`**${now.toLocaleString()}** : *${msg}*`))
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
    console.error('Unable to connect to the database:', error)
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

client.once('ready', client => {
	Tags.sync();

	log(`Logged in as ${client.user.tag}!`, client)
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'fuckyou') {
        await interaction.reply('@everyone Fuck You');
    }
});

client.on('ready', client => {
    log('Bot is online', client)
});

function addTag(tagName ,tagDescription, interaction) {
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

client.login(token);
