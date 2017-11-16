// example bot
// https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3

// music bot examples
//https://www.reddit.com/r/discordapp/comments/6hf4vm/tutorial_creating_a_discord_music_bot_from/
//https://github.com/Zentrik/DiscordBot/blob/master/bot.js

// discord.js documentation
// https://discord.js.org/#/docs/main/stable/general/welcome
// https://github.com/hydrabolt/discord.js
// https://forum.codingwithstorm.com/index.php?topic=69.0

// read on stream dispatcher
// https://github.com/hydrabolt/discord.js/blob/3e460162cac33e6381ad7247e24791ad6d94bb12/src/client/voice/dispatcher/StreamDispatcher.js

const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'Mzc5NDg4MzUzMTgwOTc1MTA0.DOq1Iw.FYaGuTQCjFr9IUvtpEYob9lk0QE';

// https://github.com/fent/node-ytdl-core#ytdlgetinfourl-options-callbackerr-info
// https://npmdoc.github.io/node-npmdoc-ytdl-core/build/apidoc.html
// https://github.com/fent/node-ytdl-core/blob/master/example/info.json
const yt = require('ytdl-core');

// what is a webhook?
//const hook = new Discord.WebhookClient('webhook id', 'webhook token');
// hook.send('I am now alive!');

const prefix = "!";
var playing = 0;
var servers = {};

function play(connection, message)
{
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(yt(server.queue[0], {filter: "audioonly"}));
  server.dispatcher.setVolume(0.1);

  yt.getInfo(server.queue[0], function(err, info) {
    console.log(info.title)
    console.log(info.length_seconds)
    let duration = new Date(null);
    duration.setSeconds(info.length_seconds);
    console.log(duration.toISOString().substr(14,8));
    duration = duration.toISOString().substr(14,6)
    message.channel.send(`:musical_score **${info.title}** [${duration}]`)
  });

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
    //message.channel.send("Song finished...");
  });
}

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.username}!`);
});

bot.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find('name', 'member-log');
  if (!channel) return;
  channel.send(`Welcome to Kidult Zone, ${member}`);
});

bot.on('message', (message) => {
  if (message.author.bot) return;

  if(!message.content.startsWith(prefix)) message.reply("handyBot cannot understand :scream:!");;

  const receivedMsg = message.content.split(" ");
  let command = receivedMsg[0].slice(prefix.length).toLowerCase();
  const params = receivedMsg.slice(prefix.length);

  switch(command) {
    case "ping":
      message.channel.send(`Pong! Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms.`); //(`\`${Date.now() - message.createdTimestamp} ms\``)
      break;

    case "handy":
      message.channel.send('dandy bot I am!');
      break;

    case "hi":
    case "hello":
      message.reply('Hello, I am handyBot.');
      break;

    case "cue": // if URL received play it or if it is a bunch of words search them on YT
      if (!params[0]) return message.channel.send("Please provide a link!");

      if (!message.member.voiceChannel) {
        message.reply('You need to join a voice channel first!');
        return;
      }

      console.log(servers[message.guild.id])

      if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      }

      var server = servers[message.guild.id];

      server.queue.push(params[0]);

      if (!message.guild.voiceConnection) message.member.voiceChannel.join()
        .then(connection => {
          play(connection, message);
          });
      break;

    case "skip":
      var server = servers[message.guild.id];

      if (server.dispatcher) server.dispatcher.end();
      break;

    case "stop":
      message.member.voiceChannel.leave();
      break;

    case "clean":
    //clean up some messages
      // message.delete()
      // .then (msg => console.log(`Deleted message from ${msg.author}`))
      // .catch(console.error);

      //param 2 == one message deleted
      var toDelete = params[0] + 1;
      if (toDelete > 99) toDelete = 99;
      if(typeof params[0] === 'undefined') return message.reply("You must specify no. msgs to delete [1, 99]")
      message.channel.bulkDelete(toDelete)
      .catch(console.error); //must be at least one.. and deletes n - 1
      break;

    case "test":

      break;

    default:
      message.reply("handyBot cannot understand :scream:!");
  }
});


bot.login(token);

// TO DO:
// modularise, weather forecast, remind alarm, tinyurl, webhooks, get uptime

// References:
// https://forum.codingwithstorm.com/index.php?topic=163.0
// //https://stackoverflow.com/questions/46799679/how-do-i-make-my-discord-music-bot-have-a-queue-for-music
