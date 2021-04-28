# MC server status bot

***This bot is still in development and some features aren't yet available***
The [mcsrvstatus](https://api.mcsrvstat.us/) api is used to get the info about the server.

## *Commands*
Admin command:

`mc!log [on/off]` Turn logging on or off. 

`mc!setip [ip]` Set the main ip. This will edit config.json

`mc!setup` Create the two channels that will display the server status.

`mc!setupdint [number in minutes]` Set how often the two voice channels update their status.


Normal commands:

`mc!ping [ip]` Ping a specified ip. You can use the command with no arguments to ping the ip specified in the json file.

<br>

## *Install and configuration*
#### *Python script*
You can use the `build.py` python script to quickly build, configure and deploy the bot.

Usage: `python build.py (-h | -sd | -env) <argument>...`

`-h` - help - will list all the options and arguments.
`-sd <token>`  - setup and deploy - if you provide a token in the argument it will write it to the config file and start the bot right away. If no argument is provided it will install dependacise and create a empty config file.
`-env` - env variable - will modify the index.js file so that the TOKEN is stored in a env variable and not the config file. If you provide a token in the argument it will write it to the `.env` file and start the bot right away. If no argument is provided it will install dependacise and create a empty config file with no token option.

#### *Config file*
This is the standard empty config file taht the python script will create:
```json
{
    "TOKEN": "",
    "PREFIX": "mc!",
    "LOGGING": "on",
    "IP":"",
    "SID": "",
    "NID": "",
    "UPINT": "5min"
}
```
The TOKEN is replaced with the bot token. 

SID is the status channel id and NID is the number of of players channel id. You can leave these to be blank and use the  `mc!setup` command to automatically create these channels and save the id's to the file or paste thise id's into the json yourself. 

LOGGING can be turned of in the config file or an admin can use the `mc!log [on/off]` command to turn it off or on. Time is logged in the [UNIX format](https://en.wikipedia.org/wiki/Unix_time).

#### *Other files*
`icon.png` is the icon I created and use for the bot. Feel free to use it for yourself.
`Procfile` is the config file will declare the worker for hosting the bot on Heroku.

<br>

## *Logging, graphing and displaying data*
If `LOGGING` is set to on in the config.json file the bot will log the status of the server every time the channels update. Nothing will be logged if you didn't set these channels up. **Im still working on the logging and graphing so graphing the logs is not available yet.**