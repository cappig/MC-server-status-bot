const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
    name:'log',
    description: 'Turn logging on',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        }

        if (!(args == 'on' || args == 'off') || !args) {
            message.channel.send('Please specify a valid option (on/off)')
        } else {
            // Read and change logging to on
            var json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
            json.LOGGING = args;
            // Write to file
            fs.writeFileSync('./config.json', JSON.stringify(json, null, 2));
            message.channel.send(`Logging has been turned ${args}`)
        }
    }
}