// https://forum.codingwithstorm.com/index.php?topic=69.0


const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'Mzc5NDg4MzUzMTgwOTc1MTA0.DOq1Iw.FYaGuTQCjFr9IUvtpEYob9lk0QE';
const yt = require('ytdl-core');

let prefix = "!";

bot.on('ready', () => {
  console.log(`Logged in as  ${bot.user.username}!`);
});

bot.on('message', (message) => {
  if (message.author.bot) return;

  if(!message.content.startsWith(prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  // if(message.content.indexOf(prefix) == 0) {
  //   var text = message.content.substring(1).toLowerCase();

  switch(command) {
    case "ping":
      message.channel.send('Pong!');
      break;

    case "handy":
      message.channel.send('dandy bot I am!');
      break;

    case "hi":
    case "hello":
      message.reply('Hello, I am handyBot.');
      break;

    case "cue":
    const voiceChannel = message.member.voiceChannel;

    if (!voiceChannel) {
      return message.channel.send("You must be in a voice channel first!");
    }

    message.channel.send("Connected!");
    voiceChannel.join()
    .then(connection => {
      const args = message.content.split(" ").slice(1);
      let stream = yt(args.join(" "), {audioonly:true});
      yt.getInfo(args.join(" "){
        const title = info.title
        console.log(`${message.author.username}, Queued the song '${title}.'`)
        message.channel.send(`Now playing \'${title}\'`)
      })
      const dispatcher = connection.playStream(stream);
      dispatcher.on('end', () => {
        voiceChannel.leave();
      })
      });
    })
    break;



    default:
      message.reply("Invalid command!");
    }
  // }
});

bot.login(token);
