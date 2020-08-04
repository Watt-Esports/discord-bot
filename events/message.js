const bannedWords = require('../utils/profanities.json');
const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = (client, message) => {
	const {prefix, channelIDs, roleIDs} = client.config;
	const args = message.content.slice(prefix.length).split(/ +/);
	const messageToArray = message.content.split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	for (const exactBannedWord of bannedWords.exact) {
		if (messageToArray.includes(exactBannedWord) && !message.author.bot && message.channel.type === 'text') {
			if (message.content.startsWith('!unbanword') && message.member.roles.has(roleIDs.admin)) {
				break;
			}

			message.delete();
			const exactBannedWordEmbed = createRichEmbed(message.author)
				.setTitle('Banned word used UwU')
				.setColor('#FF0000')
				.addField('Location', `${message.channel}`)
				.addField('Message', `${message.content}`);

			client.channels.cache.get(channelIDs.adminLogging).send(exactBannedWordEmbed);
			message.reply('Watch your language!')
				.then(msg => {
					msg.delete({timeout: 10000});
				});
			break;
		}
	}

	for (const wildcardBannedWord of bannedWords.wildcard) {
		if (message.content.includes(wildcardBannedWord) && !message.author.bot && message.channel.type === 'text') {
			if (message.content.startsWith('!unbanword') && message.member.roles.has(roleIDs.admin)) {
				break;
			}

			message.delete();

			const wildcardBannedWordEmbed = createRichEmbed(message.author)
				.setTitle('Banned word used UwU')
				.setColor('#FF0000')
				.addField('Location', `${message.channel}`)
				.addField('Message', `${message.content}`);

			client.channels.cache.get(channelIDs.adminLogging).send(wildcardBannedWordEmbed);
			message.reply('Watch your language!')
				.then(msg => {
					msg.delete({timeout: 10000});
				});
			break;
		}
	}

	if (message.content === '!') {
		message.channel.send('!!');
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		message.reply('I can\'t execute that command inside DMs!');
		return;
	}

	if (command.adminOnly && !message.member.roles.cache.has(roleIDs.admin)) return;

	if (command.modOnly && !(message.member.roles.cache.has(roleIDs.admin) || message.member.rolescache.has(roleIDs.discOfficer) || message.member.roles.cache.has(roleIDs.comLead))) return;

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply(' there was an error trying to execute that command!');
	}
};
