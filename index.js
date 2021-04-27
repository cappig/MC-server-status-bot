const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const ms = require('ms');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read the JSON config file with token, log in and set the prefix
var jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
client.login(jsonf.TOKEN);
const prefix = jsonf.PREFIX;

// This function updates the channels
const updateChannel = async () => {
    console.log('sdsdsds')
    if(!jsonf.SID && !jsonf.NID) return;

    let url = `https://mcapi.us/server/status?ip=${jsonf.IP}`;

    fetch(url, { method: "Get" })
        .then(res => res.json())
        .then((json) => {

        if(json.online == true) {
            client.channels.cache.get(jsonf.SID).setName('🟢 ONLINE')
        }
        if(json.online == false) {
            client.channels.cache.get(jsonf.SID).setName('🔴 OFFLINE')
        }

        client.channels.cache.get(jsonf.NID).setName(`👥 Players online: ${json.players.now}`)

        // Log the status of the server to a file (log.csv)
        if (jsonf.LOGGING == 'on') {
            if (fs.existsSync('./log.csv') == false) { 
                fs.writeFileSync('log.csv', 'time,ip,online,playersonline,playersmax\n');
            }

            fs.writeFileSync('log.csv', `${Date()},${jsonf.IP},${json.online},${json.players.now},${json.players.max}\n`, {'flag':'a'});
                console.log('Just logged a change!')
            } 
        }        
    );
}

client.once('ready', () => {
    console.log('The bot is up and running!');

    client.user.setActivity('for a mc! command', {type: "WATCHING"});

    // Call the function that will ping the specifed server, update the channel names, log etc.
    setInterval(() => {
        updateChannel()
    }, ms(jsonf.UPINT))
});

// Command handeler stuff
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args.toString());
    } catch(error) {
        console.error(error);
        message.reply("Uh, oh! An error occured!")
    }
});