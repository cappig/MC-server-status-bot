const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Discord = require('discord.js');
const moment = require('moment');
const fs = require('fs');


module.exports = {
    name:'chart',
    description: 'Chart the logs',

    execute(message, args) {
        // Read json config file
        jsonf = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

        // check if csv file exists
        if (!fs.existsSync('log.csv')) {
            message.channel.send('No log file was found. Nothing to be charted!');
            return;
        } if(!args) {
            message.channel.send(`Please specify what you want to chart! Use *${jsonf.PREFIX}chart uptime* or *${jsonf.PREFIX}chart playersonline*`);
            return;
        }

        // All the options for charting
        if(args == 'uptime') {
            var type = 'line';
            var label = 'uptime';
            var embedtitle = `Server uptime`;
            var fill = true;
            var max = 1;
        } 
        
        else if (args == 'playersonline') {
            var type = 'line';
            var label = '# of players';
            var embedtitle = `Number of players online on ${jsonf.IP}`;
            var fill = false;
        } 
        
        else {
            message.channel.send(`Unable to chart, ${args.replace(/,/g, ' ')} isn't a valid option! Use *${jsonf.PREFIX}chart uptime* or *${jsonf.PREFIX}chart playersonline*`);
            return;
        }

        // Read csv
        const xlbl = [];
        const ylbl = [];
        const errorlines = [];
        var data;
        var i = 1;
        try {
            data = fs.readFileSync('log.csv', 'utf-8');
        } catch (err) { 
            console.error(err);
            return;
        }
        const table = data.split('\n').slice(1);
        table.forEach(row => {
            const columns = row.split(',');
            i ++;

            if (columns[1] == jsonf.IP) {
                xlbl.push(moment.unix(columns[0]).format('h:mm A'));

                if (args == 'uptime') {
                    if (columns[2] == 'true') ylbl.push(1);
                    else if (columns[2] == 'false') ylbl.push(0);    
                } 
                
                if (args == 'playersonline') { 
                    ylbl.push(columns[3]);
                } 
            } else {
                errorlines.push(i);
            }
        })
        
        // Generate the descriptions for the embed:
        //playesronline
        if (args == 'playersonline') { 
            var sorted = ylbl.slice().sort(function(a, b) {
                return a - b;
            }); 
            var smallest = sorted[0],                      
                largest  = sorted[sorted.length - 1];
            
            var embeddescr = `There have been a maximum of ${largest} players online at onece, and a minimum of ${smallest}.`
        }
        // uptime
        var up = 0;
        var down = 0;
        var uppercent;
        if (args == 'uptime') {
            // calculate the uptime percentage
            ylbl.forEach(lbl => {
                if(lbl == 1) up++
                if(lbl == 0) down++
            })
            uppercent = (1 - (down/up)) * 100
            var embeddescr = `${jsonf.IP} was up for ${up * jsonf.UPINT} minutes and down for ${down * jsonf.UPINT} minutes. This means that ${jsonf.IP} has a uptime percentage of ${uppercent.toFixed(2)}%`
        }

        // Log the lines where the IP doesnt match the one in the config
        if (errorlines.length > 0) {
            console.log(`The IP on lines: ${errorlines.toString()} doest match the one in teh config! These lines werent graphed!`)
        }

        // Return a message if the chart is empty
        if (ylbl.length == 0) {
            const embed = new Discord.MessageEmbed()
                .setColor('#23272A')
                .setTitle('Empty chart!')
                .setDescription('Uh, oh! The chart that generated was empty! Make sure that the IP in the config is the same as the one in the logs and that the logs arent empty!')
            message.channel.send(embed);
            return;
        }

        // Change the width of the chart based on the number of lines in the log
        var width;
        if (ylbl.length <= 30)  {
            width = 500;
        } else if (ylbl.length <= 50) {
            width = 600;
        } else {
            width = 700;
        }
        const height = 400;
        // / / / / / / / / / / / / / / /
        // Chart.js stuff begins here
        const chartCallback = (ChartJS) => {
            ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
        };
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        (async () => {
            const configuration = {
                type,
                data: {
                    labels: xlbl,
                    datasets: [{
                        label,
                        data: ylbl,
                        fill,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1
                    }]
                },
                options: { 
                    legend: {
                        labels: {
                            fontColor: "rgb(247, 247, 247)",
                            fontSize: 15
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 15,
                                stepSize: 1,
                                max,
                                callback: function(value, index, values) {
		                            if(args == 'uptime') { 
		                                if(value == 1) return 'online';
		                            	if(value == 0) return 'offline';
		                            } else return value;
                                }
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                fontColor: "rgb(247, 247, 247)",
                                fontSize: 13,
                                stepSize: 1,
                            }
                        }]
                    }
                }
            }
            const image = await chartJSNodeCanvas.renderToBuffer(configuration);
            // Chart.js stuff ends here
            // / / / / / / / / / / / / / / /

            // Send embed
            const attachment = new Discord.MessageAttachment(image, "chart.png")
            const embed = new Discord.MessageEmbed()
                .setColor('#23272A')
                .setTitle(embedtitle)
                .attachFiles(attachment)
                .setDescription(embeddescr)
                .setImage("attachment://chart.png")
            message.channel.send(embed);
        })();
    }
}
