const fs = require('fs');
const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
    name:'setupint',
    description: 'Ping a specifed ip adress',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        } 
        if(!args || /^\d+$/.test(args) == false) {
            message.channel.send('Please specify a valid interval in minutes! Only numbers are a valid imput, no text!')
            return;
        }

        var json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        // Check if args only contains numbers
        json.UPINT = args;

        fs.writeFileSync('./config.json', JSON.stringify(json, null, 2));
        message.channel.send(`The update interval has been set to ${args} minutes. Please restart the bot for the changes to take effect!`)
    }
}