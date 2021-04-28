const fs = require('fs');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name:'ping',
    description: 'Ping a specifed ip adress',

    execute(message, args) {

        // This function pings a ip adress and returns the json.
        function pinger(ip) {
            let url = `https://api.mcsrvstat.us/2/${ip}`;

            fetch(url, { method: "Get" })
                .then(res => res.json())
                .then((json) => {
                    if(json.online == true) {
                        const attachment = new Discord.MessageAttachment(Buffer.from(json.icon.substr('data:image/png;base64,'.length), 'base64'), "icon.png")
                        const embed = new Discord.MessageEmbed()
                            .setColor('#008000')
                            .setTitle(`${ip} is online`)
                            .setDescription(json.motd.clean)
                            .addFields(
                                { name: 'Playesrs: ', value: `Online: ${json.players.online}\nMax: ${json.players.max}`, inline: true },
                                { name: 'Version: ', value: json.version, inline: true },
                            )
                            .attachFiles(attachment)
                            .setThumbnail("attachment://icon.png")
                        message.channel.send(embed);
                    } else {
                        const embed = new Discord.MessageEmbed()
                            .setColor('#FF0000')
                            .setTitle(`${ip} is offline`)
                            .setThumbnail('https://i.ibb.co/xzPRSmV/down.jpg')
                            .setDescription(`The server didn't return a ping.\nCheck if you entered the right ip.`)
                        message.channel.send(embed);
                    }
                }
            );
        }

        // This is the main driver code
        var jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

        // Call the pinger function with the correct variables
        if (args) {
            pinger(args);
            return;
        } else if(jsonf.IP) {
            pinger(jsonf.IP);
            return
        } else {
            message.channel.send('Please specify a IP adress to ping!');
            return;
        }

    }
}