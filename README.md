# MC server status bot

A BETTER VERSION OF THIS BOT IS COMING SOON!
I AM NO LONGER WORKING ON THIS REPO!

Let everyone in your Discord server quickly see the status of a mc server:

![img1](https://i.ibb.co/kQ05Pjx/example1.png)

Create graphs, and log the status of a server:

![img2](https://i.ibb.co/grR1NY9/chartex.png)

<br>

## *Commands*
**Admin command:**

`mc!log [on/off]` Turn logging on or off. 

`mc!setip [ip]` Set the main ip. This will edit config.json

`mc!setup` Create the two channels that will display the server status.

`mc!setupdint [number in minutes]` Set how often the two voice channels update their status.

<br>

**Normal commands:**

`mc!ping [ip]` Ping a specified ip. You can use the command with no arguments to ping the ip specified in the config.

`mc!log uptime` Create a chart of players online over time on the server.

`mc!log playersonline` Create a chart of server uptime and calculate the uptime percentage.

<br>

## *Install and configuration*
#### *Python script*
You can use the `build.py` python script to quickly build, configure and deploy the bot.

Usage: `python build.py (-h | -sd | -env) <argument>...`

`-h` - help - will list all the options and arguments.

`-sd <token>`  - setup and deploy - if you provide a token in the argument it will write it to the config file and start the bot right away. If no argument is provided it will install dependencies and create a empty config file.

`-env` - env variable - will modify the index.js file so that the TOKEN is stored in a env variable and not the config file. If you provide a token in the argument it will write it to the `.env` file and start the bot right away. If no argument is provided it will install dependencies and create a empty config file with no token option.

#### *Config file*
This is the standard empty config file that the python script will create:
```json
{
    "TOKEN": "",
    "PREFIX": "mc!",
    "LOGGING": "on",
    "LOGPLAYERS": "on",
    "IP":"",
    "UPINT": "5",
    "SID": "",
    "NID": "",
    "CID": ""
   
}
```
`SID` is the status channel id and `NID` is the number of of players channel id. You can leave these to be blank and use the `mc!setup` command to automatically create these channels and save the id's to the file or paste these id's into the json yourself. `CID` is the id of the category these channels are in.

`UPINT` is the time between updates to sthe status and logs.

`LOGGING` can be turned of in the config file or an admin can use the `mc!log [on/off]` command to turn it off or on. Time is logged in the [UNIX format](https://en.wikipedia.org/wiki/Unix_time). If `LOGGING` is set to on in the config.json file the bot will log the status of the server every update interval. You can log the usernames of the connected players. This can be changed by changing the `LOGPLAYERS` to on or off in the config file. *Note that players are only logged for smaller servers*
