# MC server status bot

***This bot is still in development and some features aren't yet available***

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
Create a file called `config.json`. It should look like this:
```json
{
    "TOKEN": "0000000000000000000000000000000000000000000000000000000000000000",
    "PREFIX": "mc!",
    "LOGGING": "on",
    "IP":"example.com",
    "SID": "00000000000000000",
    "NID": "00000000000000000",
    "UPINT": "5min"
}
```
The TOKEN is replaced with the bot token. 

SID is the status channel id and NID is the number of of players channel id. You can leave these to be blank and use the  `mc!setup` command to automatically create these channels and save the id's to the file or paste thise id's into the json yourself. 

LOGGING can be turned of in the config file or an admin can use the `mc!log [on/off]` command to turn it off or on. 

<br>

## *Logging, graphing and displaying data*
If `LOGGING` is set to on in the config.json file the bot will log the status of the server every time the channels update. Nothing will be logged if you didn't set these channels up. *Im still working on the logging and graphing so graphing the logs is not available yet*.