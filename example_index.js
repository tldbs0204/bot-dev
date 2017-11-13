// Example of Ping Pong

const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('message', (message) => {

  if(message.content == '!Ping') {
    //message.reply('Pong!'); // replies to the commander
    message.channel.sendMessage('Pong!');
  }

});

bot.login('Mzc5NDg4MzUzMTgwOTc1MTA0.DOq1Iw.FYaGuTQCjFr9IUvtpEYob9lk0QE');
