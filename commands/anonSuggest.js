const {GuildChannel} = require('discord.js');

module.exports = {
	name: 'anonsuggest',
	description: 'Posts an anonymous Suggestion',
	usage: 'anonsuggest',
	helpMsg: true,
	execute(message, args) {
		const {modBot} = message.client.config.channelIDs;
		const suggestion = args.join(' ');

		const lastChar = args[0].slice(args[0].length - 1, args[0].length);
		let number;

		if (!isNaN(lastChar)) {
			number = args[0];
		}else {
			number = args[0].slice(0, args[0].length - 1);
		}

		if (isNaN(number)) {
			message.author.send('Please put a number at the start');
			if (message.channel instanceof GuildChannel) {
				message.delete();
			}
		}

		message.client.channels.get(modBot).send('"' + suggestion + '": ' + message.author)
			.then(async sent => {
				await sent.react('✔');
				await sent.react('❌');
			});

		message.author.send('Your suggestion has been submitted pending approval!');
		if (message.channel instanceof GuildChannel) {
			message.delete();
		}
	}
};
