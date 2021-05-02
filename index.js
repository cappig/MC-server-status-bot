const Discord = require('discord.js');
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read the JSON config file with token, log in and set the prefix
var jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
client.login(jsonf.TOKEN);

// / / / / / / / / / / / / / / / / / / /
// This functin updates the status of the bot
const updatestatus = async() => { 
    // Update status
    if (jsonf.IP) {
        client.user.setActivity(jsonf.IP, {type: "WATCHING"});
    } else {
        client.user.setActivity('your Minecraft server', {type: "WATCHING"});
    }
    console.log(`[${moment().format('YYYY-MM-DD, h:mm:ss a')}] Status changed!`)
}

// / / / / / / / / / / / / / / / / / /
// This function updates the channels
const updateChannel = async () => {
    // Read the file again to update any changes
    jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

    if(jsonf.IP) {

        // Change the name of the category to the right ip if it isnt
        if(jsonf.SID && jsonf.NID) { 
            if(!(client.channels.cache.get(jsonf.CID).name == jsonf.IP + `'s status`)) {
                client.channels.cache.get(jsonf.CID).setName(jsonf.IP + `'s status`);
            }
        }

        fetch(`https://api.mcsrvstat.us/2/${jsonf.IP}`).then(async response => {
            try {
                const json = await response.json();
				
                if(json.online == true) {
                    if(jsonf.SID && jsonf.NID) {
                        client.channels.cache.get(jsonf.SID).setName('🟢 ONLINE');
                        const chann = client.channels.cache.get(jsonf.NID);
                        chann.updateOverwrite(chann.guild.roles.everyone, { VIEW_CHANNEL: true });
                        chann.setName(`👥 Players online: ${json.players.online}`);    
                    }

                    if (!json.players.list || jsonf.LOGPLAYERS == 'off') { 
                        var logdata =  `\n${moment().unix()},${jsonf.IP},${json.online},${json.players.online},x`;
                    } else {
                        var logdata =  `\n${moment().unix()},${jsonf.IP},${json.online},${json.players.online},${json.players.list.toString().replace(/,/g, '.')}`;
                    }
                    
                } else {
                    if(jsonf.SID && jsonf.NID) {
                        client.channels.cache.get(jsonf.SID).setName('🔴 OFFLINE');
                        client.channels.cache.get(jsonf.NID).updateOverwrite(client.channels.cache.get(jsonf.NID).guild.roles.everyone, { VIEW_CHANNEL: false });
                    }

                    var logdata = `\n${moment().unix()},${jsonf.IP},${json.online},0,x`;
                }

                console.log(`[${moment().format('YYYY-MM-DD, h:mm:ss a')}] Channels updated!`);

                // Log chanhes if logging is turned on
                if (jsonf.LOGGING == "on") {
                    fs.writeFileSync('log.csv', logdata, {'flag':'a'});
                    console.log(`[${moment().format('YYYY-MM-DD, h:mm:ss a')}] Just logged a change!`);
                }

            } catch(error) {
                console.error(error); 
            }
        });

    }

    // Call the update status function to update the status of the bot
    updatestatus()
}

client.once('ready', () => {
    console.log(`[${moment().format('YYYY-MM-DD, h:mm:ss a')}] The bot is up and running!`);

    // Call the update status function to update the status of the bot
    updatestatus()

    // Call the function that will ping the specifed server, update the channel names, log etc.
    setInterval(() => {
        updateChannel()
    }, jsonf.UPINT * 60000) 
});

// Command handeler stuff
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

client.on('message', message => {
    if(!message.content.startsWith(jsonf.PREFIX) || message.author.bot) return;

    const args = message.content.slice(jsonf.PREFIX.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args.toString());
    } catch(error) {
        console.error(error);
        message.reply("Uh, oh! An error occured!")
    }
});