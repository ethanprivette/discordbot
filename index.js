const { Client, Collection, Formatters, GatewayIntentBits, IntentsBitField, SlashCommandBuilder, Routes, TextChannel, messageLink, Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction, EmbedBuilder, embedLength, Team, ClientUser, ThreadMemberManager, MessageComponentInteraction, Events } = require('discord.js');
const botIntents = new IntentsBitField(8);
const { clientId, guildId, token } = require('./config.json');
const { Sequelize, Transaction, Op, where } = require('sequelize');
const talkedRecently = new Set(); 
const { Users, CurrencyShop } = require('./dbObjects.js');
const { SqlError } = require('mariadb');

//TIME VARIABLES
var now = new Date();
var sentAlready = 0;
var updateDay = now.getDay()
var updateMonth = now.getMonth()+1
var updateYear = now.getFullYear()

//ADMIN USER IDS
const wooperID = '338080523886919680';
const ethonkosID = '601077405481828362';
const birdID = '933724550640848906';

//client initialization
const client = new Client({
    allowedMentions: {
        parse: [`users`, `roles`, `everyone`],
        repliedUser: true,
    },
    intents: [botIntents],
});
const currency = new Collection();

//TIME UPDATE ON DAILY 
try {
    client.on('ready', async client => {

    const time = await Times.findOne({ where: { name: 'time' } })

    if (now.getDate() != time.day) {
        sentAlready = 0;
        await Times.update({ day: updateDay }, { where: { name: 'time' } })
        await Times.update({ month: updateMonth }, { where: { name: 'time' } })
        await Times.update({ year: updateYear }, { where: { name: 'time' } })
        log(`Time updated: ${time}`, client)
    } else {
        sentAlready = 1;
        log(`Time: ${time}`, client)
    }})
} catch (error) {
    err(`dumbass`, error)
}

//LOG FUNCTION
function log(msg, key) {
	var undef;
	console.log(msg);
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
                if (sentAlready == 1) {
                    channel.then(channel=>channel.send(`>>> *${msg}*`))
                } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n>>> *${msg}*`))
                    sentAlready = 1
                }
	    });
        } else {
		        const channel = client.channels.fetch('1017927935488966697');
                if (sentAlready == 1) {
                    channel.then(channel=>channel.send(`>>> *${msg}*`))
                } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n >>> *${msg}*`))
                    sentAlready = 1
                }
        }
}

//ERR FUNCTION
function err(msg, err, key) {
	var undef;
	console.error(msg, err);
	var now = new Date();
	    if (key === undef) {
            client.on('ready', client => {
			    const channel = client.channels.fetch('1017927935488966697');
				if (sentAlready == 1) {
                    channel.then(channel=>channel.send(` >>> *${msg}*: \n \`\`\`ansi\r\n\u001B[2;31m${err}\`\`\``))
                    } else if (sentAlready == 0) {
                    channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*: \n >>> \`\`\`ansi\r\n\u001B[2;31m${err}\`\`\``))
                    sentAlready = 1
                }
	    });
        } else {
		    const channel = client.channels.fetch('1017927935488966697');
            if (sentAlready == 1) {
                channel.then(channel=>channel.send(` >>> *${msg}*: \n\`\`\`ansi\r\n\u001B[2;31m${err}\`\`\``))
            } else if (sentAlready == 0) {
                channel.then(channel=>channel.send(`**${now.toLocaleString()}** \n *${msg}*: \n >>> \`\`\`ansi\r\n\u001B[2;31m${err}\`\`\``))
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

//SQL TIME DEFINITION
const Times = sequelize.define('times', {
	name: {
        type: Sequelize.STRING,
        unique: true,
    },
    day: Sequelize.STRING,
    month: Sequelize.STRING,
    year: Sequelize.STRING,
});


//SQL TAG DEFINITION
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

//SQL TEAMUNITS DEFINITION
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

//SQL TEAM DEFINITION
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

//SQL COOLDOWN DEFINITION
const Cooldown = sequelize.define('cooldowns', {
    team: Sequelize.STRING,
    user: Sequelize.STRING,
    currentMinute: Sequelize.INTEGER,
    currentHour: Sequelize.INTEGER,
    currentDay: Sequelize.INTEGER,
    futureMinute: Sequelize.INTEGER,
    futureHour: Sequelize.INTEGER,
    futureDay: Sequelize.INTEGER,
});
 
//SQL TABLE CHECK
client.once('ready', async client => {
	await sequelize.sync({ alter: true });

	log(`Logged in as ${client.user.tag}!`, client)	
});

//TIME INITIALIZATION
try {
	
	client.on('ready', async client => {
		const now = new Date();
		const year = `${now.getFullYear()}`;
		const mes = `${now.getMonth()+1}`;
		const dia = `${now.getDate()}`;
		const time = Times.findOne({ where: { name: 'time' } }) ?? null;
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
			log(`Time initialized`, client)
			
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

			log(`Time initialized`, client)
        }
	});
	} catch (error) {
	err('youfuckedupwooper', error, client)
}





//EMBED TEST
client.on('ready', client => {
    log('Bot is online', client)
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'help') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Please run the command again in 20 seconds.'})
        } else {
            const team = await TeamUnits.findOne({ where: { team: 'embedtest' } })
            const testEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`Command List`)
                //.setURL('https://discord.js.org/')
                .setAuthor({ name: 'Victorum', iconURL: 'https://i.imgur.com/XiAmS2H.png', url: 'https://discord.js.org' })
                .setDescription(`List of all available command atm`)
                .setThumbnail('https://i.imgur.com/XiAmS2H.png')
                .addFields(
                    { name: 'traintest', value: `Takes a unit type and value to train units`, inline: true },
                    { name: `build`, value: `Builds infrastructure (WIP)`, inline: true },
                    { name: `teamcreate`, value: `Creates a team with the specified users`, inline: true },
                    { name: `teaminfo`, value: `Displays specified team\'s members`, inline: true },
                    { name: `disbandteam`, value: `Disband the team you are the founder of`, inline: true },
                    { name: `leavetest`, value: `Leaves the team you are apart of`, inline: true },
                    { name: `showteamunits`, value: `Displays a team\'s units`, inline: true },
                    { name: `showteams`, value: `Displays all created teams`, inline: true },
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
            interaction.reply({ embeds: [testEmbed] })
        } talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, 5000 );
    }
})

//MISC COMMANDS
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'embedtest') {
        if (talkedRecently.has(interaction.user.clientId)){
            interaction.reply({ content: 'Please run the command again in 5 seconds.'})
        } else {
            const testEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`${team.team}`)
                //.setURL('https://discord.js.org/')
                .setAuthor({ name: 'Victorum', iconURL: 'https://i.imgur.com/XiAmS2H.png', url: 'https://discord.js.org' })
                .setDescription(`Amount of units ${team.team} has currently`)
                .setThumbnail('https://i.imgur.com/XiAmS2H.png')
                .addFields(
                    { name: 'Infantry', value: `${team.infantry}`, inline: true },
                    { name: 'Tanks', value: `${team.tanks}`, inline: true },
                    { name: '\u200b', value: '\u200b' },
                    { name: 'Planes', value: `${team.planes}`, inline: true },
                    { name: 'Ships', value: `${team.ships}`, inline: true },
                )
                //.setImage('https://i.imgur.com/AfFp7pu.png')
                .setTimestamp()
                //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
        
            interaction.reply({ embeds: [testEmbed] })
        }
        talkedRecently.add(interaction.user.clientId);
        setTimeout(() => {
            talkedRecently.delete(interaction.user.clientId);
        }, 5000);
    }
});

//VARIOUS TEAM FUNCTIONS
client.on('interactionCreate', async interaction => {
    if(!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'teamcreate') {

        //fetch the params provided by user
        const teamName = interaction.options.getString('name')
        const target2 = interaction.options.getString('user2')
        const target3 = interaction.options.getString('user3')
        const target4 = interaction.options.getString('user4')

        //founder/clientID fetch
        const clientID = interaction.user.id
        const founder = interaction.user.username

        //founder/input user team find (WIP)
        const founderFind = await Teams.findOne({ where: { founder: founder } })
        const user2Find = await Teams.findOne({ where: { user2: target2 } })
        const user3Find = await Teams.findOne({ where: { user3: target3 } })
        const user4Find = await Teams.findOne({ where: { user3: target4 } })

        //ADMIN CHECK
        if(clientID === wooperID || clientID === ethonkosID) {
           var teamed = false
        }

        if (founderFind) {
            teamed = true
        } else if (user2Find) {
            teamed = true
        } else if (user3Find) {
            teamed = true
        } else if (user4Find) {
            teamed = true
        }
        
        log(teamed, client)

        //create a new team with desired users
        if (teamed) {
            log(`${clientID} tried to make a new team`, client)
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

        //initalize team units
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
    }}

    //Shows a teams; name, founder, user2, user3, user4 and when it was created
    else if (commandName === 'teaminfo') {
        const teamName = interaction.options.getString('name');

        const team = await Teams.findOne({ where: { name: teamName } });

        if (team) {
            log(`Team ${teamName} was accessed by ${interaction.user.username}.`, client)
            return interaction.reply(`${teamName} was created by ${team.founder} at ${team.createdAt} with members; <@${team.user2}>, <@${team.user3}>, and <@${team.user4}>.`);
        }

        return interaction.reply(`Could not find team ${teamName}`)
    }

    //Disbands team if you're the founder
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

    //Lists all teams
    else if (commandName === 'showteams') {
        const teamList = await Teams.findAll({attributes: ['name'] });
        const teamString = teamList.map(t => t.name).join(', ') || 'no teams created.';

        log(`Team list was accessed by ${interaction.user.username}.`, client)
        return interaction.reply(`List of teams: ${teamString}`);
    }

    //Displays desired teams units
    else if (commandName === 'showteamunits') {
        const team = interaction.options.getString('team')

        const units = await TeamUnits.findOne({ where: { team: team } });

        log(`The units of ${team} were accessed by ${interaction.user.username}`, client)
        return interaction.reply(`${team} has ${units.infantry} infantry, ${units.tanks} tanks, ${units.planes} planes, and ${units.ships} ships.`, client)
    }

    //Removes user from team they are currently on
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

//ADMIN COMMANDS
client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
    const { commandName } = interaction;
    const userID = interaction.user.id;
    const chnl = interaction.options.getChannel('channel');
    const msg = interaction.options.getString('message');

    //Sends a message through the bot into a specified channel
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

    //Disbands all teams created by the user (TESTING)
    } else if (commandName === 'disbandallteams') {
        if (userID === wooperID || userID === ethonkosID) {
            const team = await Teams.findOne({ where: { founder: interaction.user.username } })
            try {
                await Teams.destroy({ where: { name: team.name } })
                await TeamUnits.destroy({ where: { team: team.name } })
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

    //Restores a team if possible (WIP)
    } else if (commandName === 'restoreteam') {
        if (userID === wooperID || userID === ethonkosID) {
            const teamName = interaction.options.getString('team')

            try {
                await Teams.restore({ where: { name: teamName } })
                log(`${teamName} was restored`, client)
                return interaction.reply(`Team was restored.`)
            } catch (error) {
                err(`Something went wrong`, error, client)
                return interaction.reply(`Check logs.`)
            }
        } else {
            log(`${interaction.user.username} tried to restore a team`, client)
            return interaction.reply(`This is an admin only command.`)
        }
    
    //Drops an entire table of data (TESTING)
    } else if (commandName === 'droptable') {
        if (userID === wooperID || userID === ethonkosID) {

            try {
                await Times.drop()
                log(`Unit table dropped`, client)
                return interaction.reply(`table dropped`)
            } catch (error) {
                log(`something went wrong`, error, client)
                return interaction.reply(`check logs`)
            }
        } else {
            log(`${interaction.user.username} tried to drop a table`, client)
            return interaction.reply(`This is an admin only interation`)
        }

    //Live updating embed with team stats (WIP)
    } else if (commandName === 'updateembed') {
        if (userID === wooperID || userID === ethonkosID) {
            const team = await TeamUnits.findOne({ where: { team: 'updatetest' } })
            try {
                const updatetest = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(team.team)
                    .setAuthor({ name: 'Victorum', iconURL: 'https://i.imgur.com/XiAmS2H.png', url: 'https://discord.js.org' })
                    .setDescription(`test`)
                    .addFields(
                        { name: 'infantry', value: `${team.infantry}`, inline: true },
                        { name: 'tanks', value: `${team.tanks}`, inline: true },
                        { name: '**---------------**', value: '\n', },
                        { name: 'planes', value: `${team.planes}`, inline: true },
                        { name: 'ships', value: `${team.ships}`, inline: true },
                    )
                    .setTimestamp()

                    log(`updateembed test was used`, client)
                    return interaction.reply({ embeds: [updatetest] })
            } catch (error) {
                err(`something went wrong`, error, client)
                return interaction.reply(`check logs`)
            }
        } else {
            log(`${interaction.user.username} tried to use updateembed`)
            return interaction.reply(`this is an admin only command`)
        }
    }
});

//INFRASTRUCTURE (WIP)
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

//TRAINING COMMAND
client.on('interactionCreate', async interaction =>{
	if (!interaction.isChatInputCommand()) return;
	
	if (interaction.commandName === 'traintest') {

        //constants for date/username
        const date = new Date()
        const username = interaction.user.username

        //gets user specified params
		const unitAmount = interaction.options.getInteger('amount') ?? 0
		const unitType = interaction.options.getString('units')
 
        //SQL find teams/cooldowns
        const founderFind = await Teams.findOne({ where: { founder: interaction.user.username } })
        const user2Find = await Teams.findOne({ where: { user2: interaction.user.id } })
        const user3Find = await Teams.findOne({ where: { user3: interaction.user.id } })
        const user4Find = await Teams.findOne({ where: { user4: interaction.user.id } })
        var cooldownName = await Cooldown.findOne({ where: { user: username } })

        if (founderFind) {
            var teamName = founderFind.name
        } else if (user2Find) {
            teamName = user2Find.name
        } else if (user3Find) {
            teamName = user3Find.name
        } else if (user4Find) {
            teamName = user4Find.name
        } else (
            log(`Something went wrong lmao`, client)
        )

        //create cooldown tag if one is not found
        if (! await Cooldown.findOne({ where: { user: username } }) ) {
            await Cooldown.create({
                team: teamName,
                user: username,
                currentMinute: date.getMinutes(),
                currentHour: date.getHours(),
                currentDay: date.getDay(),
                futureMinute: date.getMinutes() - 1,
                futureHour: date.getHours(),
                futureDay: date.getDate(),
            })
            log(`Cooldown tag created`, client)
        } else {
            //update current minutes if tag is already found
            await Cooldown.update({ team: teamName }, { where: { user: username } })
            await Cooldown.update({ currentMinute: date.getMinutes() }, { where: { user: username } })
            await Cooldown.update({ currentHour: date.getHours() }, { where: { user: username } })
            await Cooldown.update({ currentDay: date.getDate() }, { where: { user: username } })

            log(`Cooldown tag updated`, client)
        }

        cooldownName = await Cooldown.findOne({ where: { user: username } })

        //check if cooldown has passed
        if (cooldownName.currentDay <= cooldownName.futureDay) {
            if (cooldownName.currentHour <= cooldownName.futureHour) {
                if (cooldownName.currentMinute <= cooldownName.futureMinute) {
                    var cooldown = false
                } else {
                    if (cooldownName.currentHour < cooldownName.futureHour) {
                        var cooldown = false
                    } else {
                        cooldown = true
                    }
                }
            } else {
                cooldown = true
            }
        } else {
            cooldown = true
        }

        
        if (interaction.user.id === ethonkosID) {
            cooldown = true
            log(`admin override`, client)
        }

        //variable checker
        if (!cooldown) {
            log(`${username} tried to train units on cooldown, what an idiot`, client)
            return interaction.reply(`You are on cooldown idot, you can train more units at ${cooldownName.futureHour}:${cooldownName.futureMinute}`)
        }

        //checks which unit to train
        try {
            switch (unitType) {
                case 'infantry' :
                    if (unitAmount >= 10) {
                        testfunction(unitType, teamName, unitAmount, true)
                    } else {
                        testfunction(unitType, teamName, unitAmount, false)
                    }
                    break;
                case 'tanks' :
                    if (unitAmount >= 9) {
                        testfunction(unitType, teamName, unitAmount, true)
                    } else {
                        testfunction(unitType, teamName, unitAmount, false)
                    } 
                    break;
                case 'planes' :
                    if (unitAmount >= 5) {
                        testfunction(unitType, teamName, unitAmount, true)
                    } else {
                        testfunction(unitType, teamName, unitAmount, false)
                    }
                    break;
                case 'ships' :
                    if (unitAmount >= 2) {
                        testfunction(unitType, teamName, unitAmount, true)
                    } else {
                        testfunction(unitType, teamName, unitAmount, false)
                    }
                    break;
                default:
                break;
                    
            }
        } catch (error) {
            err(`something went wrong`, error, client)
            return interaction.reply(`check logs`)
        }
	}

        //train function
        async function testfunction(type, team, amount, over) {

            //SQL find teamUnits/cooldown
            const teamNamed = await TeamUnits.findOne({ where: { team: teamName } })
            const cooldowName = await Cooldown.findOne({ where: { user: interaction.user.username } })

            //Amount of specified units TOTAL
            const infantryAmount = teamNamed.infantry + amount
            const tanksAmount = teamNamed.tanks + amount
            const planesAmount = teamNamed.planes + amount
            const shipsAmount = teamNamed.ships + amount

            //check if units are over the max
            if (over == true) {
                log(`${interaction.user.username} tried to train too many ${type}`, client)
                return interaction.reply('you selected too many ' + type)	
            }

            //checks which unit was selected
            try {
                if (type === 'infantry') {

                    //TIME CONSTANTS
                    const totalCooldown = 1800*amount
                    const minutes = totalCooldown/60000
                    const hours = totalCooldown/3600000
                    const day = totalCooldown/86400000
                    var time = new Date()

                    //TIME SETTERS
                    if (day < 1) {
                        if (hours < 1) {
                            if (minutes + cooldowName.futureMinute >= 60) {
                                time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                            } else {
                                time.setMinutes(minutes + cooldowName.currentMinute)
                            }
                        } else {
                            time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                        }
                    } else {
                        time.setDate(day + cooldowName.currentDay)
                        time.setHours(hours+ cooldowName.currentHour, minutes + cooldowName.currentMinute)
                    }

                    log(`${teamName}, ${teamNamed.name}`, client)
                    
                    //SQL FIND/UPDATE
                    const infantry = await TeamUnits.update({ infantry: infantryAmount }, { where: { team: teamName } });
                    await Cooldown.update({ futureHour: time.getHours() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureMinute: time.getMinutes() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureDay: time.getDate() }, { where: { user: interaction.user.username } })

                    //TEAM CHECK
                    if (infantry > 0) {
                        log(`${amount} ${type} were added to ${teamName.name}.`, client);
                        log(`Cooldown is: ${time}`, client)
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'tanks') {

                    //TIME CONSTANTS
                    const totalCooldown = 262500*amount
                    const minutes = totalCooldown/60000
                    const hours = totalCooldown/3600000
                    const day = totalCooldown/86400000
                    var time = new Date()

                    //TIME SETTERS
                    if (day < 1) {
                        if (hours < 1) {
                            if (minutes + cooldowName.futureMinute >= 60) {
                                time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                            } else {
                                time.setMinutes(minutes + cooldowName.currentMinute)
                            }
                        } else {
                            time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                        }
                    } else {
                        time.setDate(day + cooldowName.currentDay)
                        time.setHours(hours+ cooldowName.currentHour, minutes + cooldowName.currentMinute)
                    }

                    log(`${teamName}, ${teamNamed.name}`, client)
                    
                    //SQL FIND/UPDATE
                    const tanks = await TeamUnits.update({ tanks: tanksAmount }, { where: { team: teamName } });
                    await Cooldown.update({ futureHour: time.getHours() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureMinute: time.getMinutes() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureDay: time.getDate() }, { where: { user: interaction.user.username } })

                    //TEAM CHECK
                    if (tanks > 0) {
                        log(`${amount} ${type} were added to ${teamName.name}.`, client);
                        log(`Cooldown is: ${time}`, client)
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'planes') {

                    //TIME CONSTANTS
                    const totalCooldown = 900000*amount
                    const minutes = totalCooldown/60000
                    const hours = totalCooldown/3600000
                    const day = totalCooldown/86400000
                    var time = new Date()

                    //TIME SETTERS
                    if (day < 1) {
                        if (hours < 1) {
                            if (minutes + cooldowName.futureMinute >= 60) {
                                time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                            } else {
                                time.setMinutes(minutes + cooldowName.currentMinute)
                            }
                        } else {
                            time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                        }
                    } else {
                        time.setDate(day + cooldowName.currentDay)
                        time.setHours(hours+ cooldowName.currentHour, minutes + cooldowName.currentMinute)
                    }

                    log(`${teamName}, ${teamNamed.name}`, client)
                    
                    //SQL FIND/UPDATE
                    const planes = await TeamUnits.update({ planes: planesAmount }, { where: { team: teamName } });
                    await Cooldown.update({ futureHour: time.getHours() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureMinute: time.getMinutes() }, { where: { user: interaction.user.username } })
                    await Cooldown.update({ futureDay: time.getDate() }, { where: { user: interaction.user.username } })

                    //TEAM CHECK
                    if (planes > 0) {
                        log(`${amount} ${type} were added to ${teamName.name}.`, client);
                        log(`Cooldown is: ${time}`, client)
                        return interaction.reply(`${amount} ${type} are being trained.`);
                    }
                    log(`${team} does not exist`, client);
                    return interaction.reply(`No team with team name ${team} found`);
                }
                else if (type === 'ships') {

                   //TIME CONSTANTS
                   const totalCooldown = 10800000*amount
                   const minutes = totalCooldown/60000
                   const hours = totalCooldown/3600000
                   const day = totalCooldown/86400000
                   var time = new Date()

                   //TIME SETTERS
                   if (day < 1) {
                       if (hours < 1) {
                           if (minutes + cooldowName.futureMinute >= 60) {
                               time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                           } else {
                               time.setMinutes(minutes + cooldowName.currentMinute)
                           }
                       } else {
                           time.setHours(hours + cooldowName.currentHour, minutes + cooldowName.currentMinute)
                       }
                   } else {
                       time.setDate(day + cooldowName.currentDay)
                       time.setHours(hours+ cooldowName.currentHour, minutes + cooldowName.currentMinute)
                   }

                   log(`${teamName}, ${teamNamed.name}`, client)
                   
                   //SQL FIND/UPDATE
                   const ships = await TeamUnits.update({ ships: shipsAmount }, { where: { team: teamName } });
                   await Cooldown.update({ futureHour: time.getHours() }, { where: { user: interaction.user.username } })
                   await Cooldown.update({ futureMinute: time.getMinutes() }, { where: { user: interaction.user.username } })
                   await Cooldown.update({ futureDay: time.getDate() }, { where: { user: interaction.user.username } })

                   //TEAM CHECK
                   if (ships > 0) {
                       log(`${amount} ${type} were added to ${teamName.name}.`, client);
                       log(`Cooldown is: ${time}`, client)
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

//ALL TAG COMMANDS
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

//SQL CURRENCY SYSTEM???
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

client.once("MessageCreate", async message => {
    try {
        log(message.author.bot, client)
        if (message.author.bot) return;

        currency.add(message.author.id, 1);
        log(`1 coin added to ${message.author.id}`, client)
        
    } catch(error) {
        err(`something went wrong`, error, client)
    }
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
        const itemName = interaction.options.getString('name');
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

//DISABLE COMMAND
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
