const fs = require('fs');
const fetch = require('node-fetch');
const Discord = require('discord.js');

const bot = new Discord.Client();

module.exports = {
    name:'setup',
    description: 'Set up 2 channels that display the status an number of players connected',

    execute(message, args) {
        var jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }
        if (!jsonf.IP) {
            message.channel.send('Please use the `' + jsonf.PREFIX + '!setip` command to set a ip to monitor!');
            return;
        }

        // Create category
        message.guild.channels.create(`${jsonf.IP}'s status`, {
            type: 'category'
        }) .then(channel=>{
            var cid = channel.id;
            channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
        })

        // Crate channels, lock and add to category
        message.guild.channels.create('Updating status. . .', {
            type: 'voice'
        }) .then(channel => {
            jsonf.SID = channel.id
            console.log(cid);
            channel.setParent(cid)
                .then(() => channel.lockPermissions())
        })
        message.guild.channels.create('Updating players . . .', {
            type: 'voice'
        }) .then(channel => {
            jsonf.NID = channel.id
            channel.setParent(cid)
                .then(() => channel.lockPermissions())
            fs.writeFileSync('./config.json', JSON.stringify(jsonf, null, 2));
        })
        
        message.channel.send('The channels heve been created sucesfuly!')
    }
}