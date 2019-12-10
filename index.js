const {
    Client,
    Attachment
} = require('discord.js');
const bot = new Client();

const ytdl = require("ytdl-core");


const token = 'NjUyODE2NjkzMjY5MTAyNjE0.XezMZg.Ziy4R7rlK1FIW6AoS35EUL4oWbw';

const PREFIX = '!';

var version = '1.0';

var servers = {};


bot.on('ready', () => {
    console.log('Bot Ready!' + version);
    bot.user.setActivity('NhạcLord', { type: 'STREAMING'}).catch(console.error);

})




bot.on('message', message => {

    let args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]) {
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });


            }


             if(!args[1]){
                 message.channel.send("You need to provide a link!");
                 return;
             }

             if(!message.member.voiceChannel){
                 message.channel.send("You must be in a voice channel to play the bot!");
                 return;
             }

             if(!servers[message.guild.id]) servers[message.guild.id] = {
                 queue: []
             }

             var server = servers[message.guild.id];

             server.queue.push(args[1]);

             if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                 play(connection, message);
             })





        break;

        case 'skip':
             var server = servers[message.guild.id];
              if(server.dispatcher) server.dispatcher.end();
              message.channel.send("Skipping the song!")
        break;

        case 'stop':
             var server = servers[message.guild.id];
              if(message.guild.voiceConnection){
                  for(var i = server.queue.length -1; i >=0; i--){
                      server.queue.splice(i, 1);
                  }
                
                server.dispatcher.end();
                message.channel.send("Ending  the queue, Leaving this voice channel")
                console.log('Stopped the queue')
             }

             if(message.guild.connection) message.guild.voiceConnection.disconnect();
        break;

    }


});

bot.login(token);