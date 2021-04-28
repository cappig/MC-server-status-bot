#!/usr/bin/python3
import os, sys, json, fileinput

opts = [opt for opt in sys.argv[1:] if opt.startswith("-")]
args = [arg for arg in sys.argv[1:] if not arg.startswith("-")]

# Help option
if "-h" in opts:
    print("""
    This python script builds, configures and deploys the bot. The bot is open source and 
    avalible on github: https://github.com/cappig/MC-server-status-bot Have fun, Matt :)

    Usage: python build.py -option <argument> ...

     Option ┃   Usage      ┃      Explanation
    ━━━━━━━━╋━━━━━━━━━━━━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     -h     ┃ -h           ┃  Lists all argument and options. The option you just used.
    ────────╂──────────────╂────────────────────────────────────────────────────────────
     -sd    ┃ -sd <token>  ┃  Setup and deploy the bot rigth away. Enter the bot token 
            ┃              ┃  after the option. If a argument is provided it will write 
            ┃              ┃  it as a tokin in the config file and start the bot.
    ────────╂──────────────╂────────────────────────────────────────────────────────────
     -env   ┃ -env <token> ┃  Will modify the bot so that the TOKEN is stored as a env 
            ┃              ┃  variable. If a argument is provided it will write a .env
            ┃              ┃  file with the argument as the token.
    """)
# --- \ OPTIONS / -----

# Setup and deploy
elif "-sd" in opts:
    print("\nInstalling the node modules...")
    os.system("npm install")

    print("done \nWriting config file ...")
    content = {}
    if args:
        content['TOKEN'] = str(args[0])
    else:
        content['TOKEN'] = ''
    content['PREFIX'] = 'mc!'
    content['LOGGING'] = 'on'
    content['IP'] = ''
    content['SID'] = ''
    content['NID'] = ''
    content['CID'] = ''
    content['UPINT'] = '5min'

    with open('config.json', 'w') as outfile:
        json.dump(content, outfile, indent=2)

    if args:
        print("done \nStarting the bot...")
        os.system("node .")
    else:
        print("done")

# Add env variable
elif "-env" in opts:
    print("\nInstalling the node modules...")
    os.system("npm install")
    os.system("npm i dotenv")

    with fileinput.FileInput('index.js', inplace=True) as file:
        for line in file:
            print(line.replace('jsonf.TOKEN', 'process.env.TOKEN'), end='')
            
    print("\nWriting config file ...")
    content = {}
    content['PREFIX'] = 'mc!'
    content['LOGGING'] = 'on'
    content['IP'] = ''
    content['SID'] = ''
    content['NID'] = ''
    content['CID'] = ''
    content['UPINT'] = '5min'

    with open('index.js', 'r+') as f:
        rawfile = f.read()
        f.seek(0, 0)
        f.write("require('dotenv').config()\n" + rawfile)
    
    if args:
        with open('.env', 'w') as f:
            f.write('TOKEN=' + str(args[0]))
    
    if args:
        print("done \nStarting the bot...")
        os.system("node .")
    else:
        print("done")


else:
    raise SystemExit("That option doesnt exist! Use build.py -h for help.")