const fs = require('fs');

module.exports = {
    name:'setip',
    description: 'Set up a default IP andress',

    execute(message, args) {
        // Check if the person is admin
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send('You have to be a admin to use this command!');
            return;
        } 
        if(!args) {
            message.channel.send('Please specify a valid IP!');
            return;
        }
        
        var json = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        json.IP = args.toString();

        fs.writeFileSync('./config.json', JSON.stringify(json, null, 2));
        message.channel.send(`The main IP has been set to: ${args.toString()}`)
    }
}