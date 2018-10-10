const { prefix } = require('../config.json') ;

module.exports = {
  name: 'help',
  description: 'Get info in a command or list all commands. If dm present, will DM you instead of sending to channel',
  aliases: ['h','command','commands'],
  usage: '(blank)/command (blank)/dm',

  execute(message, args) {
    const toReply = [] ;
    const { commands } = message.client ;

    // if no arguments, send all commands to DM
    if (!args.length) {
      toReply.push('Commands:') ;
      toReply.push(commands.map(command => command.name).join(', ')) ;

      return message.author.send(toReply, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') { return ; }
          message.reply('I\'ve sent you a DM.') ;
        })
        .catch(error => {
          console.error('Could not send help DM to ${message.author.tag}.\n', error) ;
          message.reply('I can\'t DM you.') ;
        }) ;
    }

    var sendToDm = (args.indexOf("dm") > -1) ;

    const name = args[0].toLowerCase() ;
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name)) ;

    // if not a command and don't send to dm then invalid
    if (!command && !sendToDm) {
      return message.reply('that\'s not a valid command!') ;
    } 

    toReply.push(`**Command**`) ; 
    toReply.push(`**Name:** ${command.name}`) ;

    if (command.aliases) { toReply.push(`**Aliases:** ${command.aliases.join(', ')}`) ; }
    if (command.description) { toReply.push(`**Description:** ${command.description}`) ; }
    if (command.usage) { toReply.push(`**Usage:** ${prefix}${command.name} ${command.usage}`) ; }
    if (command.cooldown) { toReply.push(`**Cooldown:** ${command.cooldown || 3} second(s)`) ; }

    // if command found and send to dm, sends user a dm
    if (sendToDm) {
      return message.author.send(toReply, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') { return ; }
          message.reply('I\'ve sent you a DM.') ;
        })
        .catch(error => {
          console.error('Could not send help DM to ${message.author.tag}.\n', error) ;
          message.reply('I can\'t DM you.') ;
        }) ;
    // else command is found send it to channel
    } else {
       return message.channel.send(toReply, { split: true }) ;
    }
  },
} ;
