const { Client, Collection, Formatters, GatewayIntentBits, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength, Team, ClientUser, ThreadMemberManager } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize, Transaction, Op, where } = require('sequelize');
const talkedRecently = new Set(); 
const { Users, CurrencyShop } = require('./dbObjects.js');
const { SqlError } = require('mariadb');

var now = new Date();
var sentAlready = 0;
var updateDay = now.getDay()
var updateMonth = now.getMonth()
var updateYear = now.getFullYear()
var update = `${updateDay}-${updateMonth}-${updateYear}`

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
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
                if (sentAlready == 1) {
                    channel.then(channel=>channel.send(`*${msg}*`))
                } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*`))
                    sentAlready = 1
                }
	    });
        } else {
		        const channel = client.channels.fetch('1017927935488966697');
                if (sentAlready == 1) {
                    channel.then(channel=>channel.send(`*${msg}*`))
                } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*`))
                    sentAlready = 1
                }
        }
}

function err(msg, err, key) {
	var undef;
	console.error(msg, err);
	var now = new Date();
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
				if (sentAlready == 1) {
                    channel.then(channel=>channel.send(`*${msg}*: \n\`\`\`asni\n [2;31m${err}\n\`\`\``))
                } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*: \n\`\`\`asni\n [2;31m${err}\n\`\`\``))
                    sentAlready = 1
                }
	    });
        } else {
		    const channel = client.channels.fetch('1017927935488966697');
            if (sentAlready == 1) {
                channel.then(channel=>channel.send(`*${msg}*: \n\`\`\`asni\n [2;31m${err}\n\`\`\``))
            } else if (sentAlready == 0) {
                channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*: \n\`\`\`asni\n [2;31m${err}\n\`\`\``))
                sentAlready = 1
            }
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


const Times = sequelize.define('times', {
	name: {
        type: Sequelize.STRING,
        unique: true,
    },
    day: Sequelize.STRING,
    month: Sequelize.STRING,
    year: Sequelize.STRING,
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

const TeamUnits = sequelize.define('units', {
    team: { 
        type: Sequelize.STRING,
        unique: true,
    },
    founder: Sequelize.STRING,
    infantry: {
        type: Sequelize.INTEGER,
    },
    tanks: {
        type: Sequelize.INTEGER,
    },
    planes: {
        type: Sequelize.INTEGER,
    },
    ships: {
        type: Sequelize.INTEGER,
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
    TeamUnits.sync();

	log(`Logged in as ${client.user.tag}!`, client)	
});

//
/*
try {
	
	client.on('ready', async client => {
		const now = new Date();
		const year = `${now.getFullYear()}`;
		const mes = `${now.getMonth()+1}`;
		const dia = `${now.getDate()+1}`;
		const time = Times.findOne({ where: { name: 'time' } });
		log(time, client)
		const channel = client.channels.fetch('1017927935488966697');
		if (time) {
			await Times.destroy({
				where: {},
				truncate: true
			});
			await Times.create({
					name: 'time',
					day: dia,
                    month: mes,
                    year: year,
				});
			return channel.then(channel=>channel.send(`first option occurred`))
			
		} else {
		    await Times.destroy({
				where: {},
				truncate: true
			});
			await Times.create({
                    name: 'time',
                    day: dia,
                    month: mes,
                    year: year,
                });

			return channel.then(channel=>channel.send(`second option occurred`))
        }
	});
	} catch (error) {
	err('youfuckedupwooper', error, client)
}

try {
    client.on('ready', async client => {
    const time = await Times.findOne({ where: { name: 'time' } })
    if (now.getDate() != time.day) {
        sentAlready = 0;
        await Times.update({ time: update }, { where: { name: 'time' } })
        log(time, client)
    } else {
        log(time, client)
    }})
} catch (error) {
    err(`dumbass`, error)
}
*/

//
client.on('ready', client => {
    log('Bot is online', client)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;
    const Infantry = 218
    const Tanks = 1404
    const Planes = 143
    const Ships = 56

    if (commandName === 'embedtest') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Please run the command again in 20 seconds.'})
        } else {
            const testEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Checkoslovakia')
                //.setURL('https://discord.js.org/')
                .setAuthor({ name: 'Victorum', iconURL: 'https://i.imgur.com/XiAmS2H.png', url: 'https://discord.js.org' })
                .setDescription('Amount of units checkoslovakia has currently')
                .setThumbnail('https://i.imgur.com/XiAmS2H.png')
                .addFields(
                    { name: 'Infantry', value: `${Infantry}`, inline: true },
                    { name: 'Tanks', value: `${Tanks}`, inline: true },
                    { name: '\u200b', value: '\u200b' },
                    { name: 'Planes', value: `${Planes}`, inline: true },
                    { name: 'Ships', value: `${Ships}`, inline: true },
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
            interaction.reply({ embeds: [testEmbed] })
        } talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, cooldown );
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
        const wooperID = '338080523886919680'
        const ethonkosID = '601077405481828362'
        const clientID = interaction.user.id
        const teamName = interaction.options.getString('name')
        const target2 = interaction.options.getString('user2')
        const target3 = interaction.options.getString('user3')
        const target4 = interaction.options.getString('user4')
        const founder = interaction.user.username
        const user2Find = await Teams.findAll({ attributes: ['user2'] })
        const user3Find = await Teams.findAll({ attributes: ['user3'] })
        const user4Find = await Teams.findAll({ attributes: ['user4'] })

        if(clientID === wooperID || clientID === ethonkosID) {
            try {
                const team = await Teams.create({
                    name: teamName,
                    founder: founder,
                    user2: target2,
                    user3: target3,
                    user4: target4,
                });
    
                log(`New team ${team.name} has been created`, client);
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    err(`${teamName} already exists`, error, client)
                    return interaction.reply(`That team already exists`)
                }
                err(`Team ${teamName} failed to be created`, error, client)
                return interaction.reply(`Something went wrong with adding the team.`)
            }
            try {
                const teamUnits = await TeamUnits.create({
                    team: teamName,
                    founder: founder,
                    infantry: 0,
                    tanks: 0,
                    planes: 0,
                    ships: 0,
                });
    
                log(`${teamUnits.team} has ${teamUnits.infantry} infantry, ${teamUnits.tanks} tanks, ${teamUnits.planes} planes, and ${teamUnits.ships} ships.`, client);
                interaction.reply(`Team ${teamName} was created.`)
            }
            catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    err(`A team with name: ${teamName} already exists.`, error, client)
                    return interaction.reply(`Team ${teamName} already exists.`)
                } else {
                    err(`${teamName} unit initialization failed`, error, client)
                    return interaction.reply(`${teamName} failed to initialize units.`)
                }
            }
        } else if(await Teams.findAll({ attributes: ['founder'] === founder } )) {
            log(`${founder} tried to found a new team`, client)
            return interaction.reply(`You already founded a team.`)
        } else if (target2 == user2Find) {
            log(`${target2} tried to found a new team`, client)
            return interaction.reply(`You are already in a team, use /leave to leave it.`)
        } else if (target3 == user3Find) {
            log(`${target3} tried to found a new team`, client)
            return interaction.reply(`You are already in a team, use /leave to leave it.`)
        } else if (target4 == user4Find) {
            log(`${target4} tried to found a new team`, client)
            return interaction.reply(`You are already in a team, use /leave to leave it.`)
        } else {

        try {
            const team = await Teams.create({
                name: teamName,
                founder: founder,
                user2: target2,
                user3: target3,
                user4: target4,
            });

            log(`New team ${team.name} has been created`, client);
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return interaction.reply(`That team already exists`)
            }
            err(`Team ${teamName} failed to be created`, error, client)
            return interaction.reply(`Something went wrong with adding the team.`)
        }
        try {
            const teamUnits = await TeamUnits.create({
                team: teamName,
                founder: founder,
                infantry: 0,
                tanks: 0,
                planes: 0,
                ships: 0,
            });

            log(`${teamUnits.team} has ${teamUnits.infantry} infantry, ${teamUnits.tanks} tanks, ${teamUnits.planes} planes, and ${teamUnits.ships} ships.`, client);
            interaction.reply(`Team ${teamName} was created.`)
        }
        catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                err(`A team with name: ${teamName} already exists.`, error, client)
                return interaction.reply(`Team ${teamName} already exists.`)
            } else {
                err(`${teamName} unit initialization failed`, error, client)
                return interaction.reply(`${teamName} failed to initialize units.`)
            }
        }
    }
    }
    else if (commandName === 'teaminfo') {
        const teamName = interaction.options.getString('name');

        const team = await Teams.findOne({ where: { name: teamName } });

        if (team) {
            log(`Team ${teamName} was accessed by ${interaction.user.username}.`, client)
            return interaction.reply(`${teamName} was created by ${team.founder} at ${team.createdAt} with members; <@${team.user2}>, <@${team.user3}>, and <@${team.user4}>.`);
        }

        return interaction.reply(`Could not find team ${teamName}`)
    }
    else if (commandName === 'disbandteam') {
        const teamName = interaction.options.getString('teamname')

        const team = await Teams.findOne({ where: { name: teamName } });

        if (interaction.user.username === team.founder) {
            await Teams.destroy({ where: {name: teamName }, force: true })
            await TeamUnits.destroy({ where: { team: teamName }, force: true })
            log(`Team ${teamName} was disbanded by ${interaction.user.username}`, client)
            return interaction.reply(`${teamName} was disbanded.`);
        } else {
            log(`${interaction.user.username} tried to disband ${teamName}.`, client)
            return interaction.reply('You did not found this team, so you cannot disband it.')
        }
    }
    else if (commandName === 'showteams') {
        const teamList = await Teams.findAll({attributes: ['name'] });
        const teamString = teamList.map(t => t.name).join(', ') || 'no teams created.';

        log(`Team list was accessed by ${interaction.user.username}.`, client)
        return interaction.reply(`List of teams: ${teamString}`);
    }
    else if (commandName === 'showteamunits') {
        const team = interaction.options.getString('team')

        const units = await TeamUnits.findOne({ where: { team: team } });

        log(`The units of ${team} were accessed by ${interaction.user.username}`, client)
        return interaction.reply(`${team} has ${units.infantry} infantry, ${units.tanks} tanks, ${units.planes} planes, and ${units.ships} ships.`, client)
    }
    else if (commandName === 'leaveteam') {
        const teamName = interaction.options.getString('teamname')
        const userName = interaction.user.username
        const clientID = interaction.user.id

        const team = await Teams.findOne({ where: { name: teamName } });

        if (userName === team.founder) {
            log(`${userName} tried to leave ${team.name}`, client)
            return interaction.reply(`You founded ${team.name}, use /disband to disband.`)
        } 
        else if (clientID == team.user2) {
            await Teams.update({ user2: 'null' }, {where: { name: teamName } });
            log(`${userName} left ${teamName}`, client)
            return interaction.reply(`You left ${teamName}`)
        } 
        else if (clientID == team.user3) {
            await Teams.update({ user3: 'null' }, {where: { name: teamName } });
            log(`${userName} left ${teamName}`, client)
            return interaction.reply(`You left ${teamName}`)
        } 
        else if (clientID == team.user4) {
            await Teams.update({ user4: 'null' }, {where: { name: teamName } });
            log(`${userName} left ${teamName}`, client)
            return interaction.reply(`You left ${teamName}`)
        } 
        else {
            log(`${userName} is not part of a team`, client)
            return interaction.reply(`You are not apart of a team`)
        }
    }
});

//ADMIN COMMANDS HERE

client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
    const { commandName } = interaction;
    const wooperID = '338080523886919680';
    const ethonkosID = '601077405481828362';
    const birdID = '933724550640848906';
    const userID = interaction.user.id;
    const chnl = interaction.options.getChannel('channel');
    const msg = interaction.options.getString('message');

    if (commandName === 'troll') {
        if (userID === wooperID || userID === ethonkosID || userID === birdID) {
            try {
                log(`Troll channel: ${chnl}, troll message: ${msg}.`, client)
                return chnl.send(msg)
            } catch (error) {
                err(`Troll failed`, error, client)
            }
        } else {
        log(`Troll by ${interaction.user.username} failed`, client)
        return interaction.reply(`hah you tried lmao`)
        }
    } else if (commandName === 'disbandallteams') {
        if (userID === wooperID || userID === ethonkosID) {
            try {
                await Teams.destroy({ where: { founder: interaction.user.username }, force: true })
                log(`All teams created by ${interaction.user.username} were destroyed.`, client)
                return interaction.reply(`Teams created by ${interaction.user.username} were destroyed`)
            } catch (error) {
                err(`Something went wrong with deleting teams`, error, client)
                return interaction.reply(`Something went wrong, check logs`)
            }
        } else {
            log(`${interaction.user.username} tried to delete teams`, client)
            return interaction.reply(`This is an admin only action`)
        }
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
		const unitAmount = interaction.options.getInteger('amount'); //tag amount
		const unitType = interaction.options.getString('units'); //tag description
        const teamName = interaction.options.getString('teamname');
		switch (unitType) {
			case 'infantry' :
				if (unitAmount <= 999 >= 20001) {
                    unitCooldown = 1800*unitAmount;
                    //trainUnits(teamName, unitType, unitAmount)
					testfunction(unitType, teamName, unitAmount, true)
				} else {
					testfunction(unitType, teamName, unitAmount, false)
				}
				break;
			case 'tanks' :
				if (unitAmount >= 9) {
                    unitCooldown = 262500*unitAmount;
					testfunction(unitType, teamName, unitAmount, true)
				} else {
					testfunction(unitType, teamName, unitAmount, false)
				} 
				break;
			case 'planes' :
				if (unitAmount >= 5) {
                    unitCooldown = 900000*unitAmount;
					testfunction(unitType, teamName, unitAmount, true)
				} else {
					testfunction(unitType, teamName, unitAmount, false)
				}
				break;
			case 'ships' :
				if (unitAmount >= 2) {
                    unitCooldown = 10800000*unitAmount;
					testfunction(unitType, teamName, unitAmount, true)
				} else {
					testfunction(unitType, teamName, unitAmount, false)
				}
				break;
			default:
			break;
				
		}
	}

        async function testfunction(type, team, amount, over) {
            const rowFetch = await TeamUnits.findOne({ where: { team: team } });
            const unitAmount = rowFetch.get(type) + amount
            log(`Current cooldown: ${unitCooldown/60000}`, client);
            /*
            if (over === false) {
            interaction.reply('you selected ' + amount + ' ' + type)
            } else if (over === true) {
            interaction.reply('you selected too many ' + type)	
            }
            */


            try {
                if (type === 'infantry') {
                    const infantry = await TeamUnits.update({ infantry: unitAmount }, { where: { team: team } });

                    if (infantry > 0) {
                        log(`${amount} ${type} were added to ${team}.`, client);
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'tanks') {
                    const tanks = await TeamUnits.update({ tanks: unitAmount }, { where: { team: team } });

                    if (tanks > 0) {
                        log(`${amount} ${type} were added to ${team}.`, client);
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'planes') {
                    const planes = await TeamUnits.update({ planes: unitAmount }, { where: { team: team } });

                    if (planes > 0) {
                        log(`${amount} ${type} were added to ${team}.`, client);
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'ships') {
                    const ships = await TeamUnits.update({ ships: unitAmount }, { where: { team: team } });

                    if (ships > 0) {
                        log(`${amount} ${type} were added to ${team}.`, client);
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
            }
            catch (error) {
                err(`${amount} ${type} training failed for ${team}`, error, client);
                return interaction.reply(`Something went wrong with training ${amount} ${type}`);
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
            err(`Tag **${tag.name}** failed to add.`, error, client)
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
        log(`Bot has been disabled by ${interaction.user.username}.`, interaction)
        setTimeout(() => {
            client.destroy();
        }, 5000 );
    }
});

client.login(token);
