const Discord = require('discord.js'),
fs = require('fs'),
c = require('chalk'),
ms = require('ms')

//Discord client - I like "bot" more, then "client"
const bot = new Discord.Client({disableEveryone: true});

const config = require('./config'),
activites = ['PLAYING', 'WATCHING', 'COMPETING', 'LISTENING'], //Supported activites, discord.js supports more (but I don't care)
error = c.keyword('red').bold,
kill = c.white('\nKilling process...'),
warn = c.keyword('yellow').bold,
server = Array,
commands = Array
bot.token = config.bot.token;
bot.prefix = config.bot.prefix;
bot.status = config.bot.status;
bot.activity = config.bot.activity.toUpperCase();
server.type = config.server.type.toLowerCase();
server.ip = config.server.iptoLowerCase();
server.port = config.server.port

//Config check
if(bot.token === '') { //Checks if you have entered bot token to config
    console.log(error('Bot token in config is empty!') + kill);
    return process.exit(1);
} else if (bot.prefix === '') { //Checks if you have entered bot prefix to config
    console.log(error('Bot prefix in config is empty!') + kill);
    return process.exit(1);
} else if (bot.status === '') { //Checks if you have enteredcustom status for bot to config
    console.log(warn('Bot status in config was empty! Bot status was disabled.'));
    bot.status = false;
} else if (bot.activity === '' && bot.status !== false) { //Checks if you have entered status activity type to config
    console.log(warn('Bot activity type in config was empty! Activity type is now "playing"'));
    bot.activity = 'PLAYING';
} else if (!new Set(activites).has(bot.activity)) { //Checks if you have entered supported activity
    console.log(warn(`"${bot.activity}" activity is not supported. Bot status was disabled.`));
    bot.status = false;
} else if (!server.type || server.type !== 'java' || server.type !== 'bedrock') {
    if(!server.type) {
        console.log(warn(`You did not specify server's edition, setting it to java.`));
        server.type = 'java';
    } else {
        console.log(error('Unknown server edition') + kill);
        return process.exit(1);
    }
} else if (!server.port) {
    console.log(warn(`You did not specify server port, setting it to default.`));
    if(server.type === 'bedrock') {
        server.port = '19132'
    } else {
        server.port = '25565'
    }
}

//Event handler
const eventsFolder = fs.readdirSync('./events'); //Finds files in event folder
for (const file of eventsFolder) {
    const event = require(`./events/${file}`); //The file
    bot.on(file.split(".")[0], event.bind(null, bot)); //Runs the file
};

//Bot login
bot.login(bot.token);