require('discord.js');

module.exports = {
	name: 'anonsuggest',
	description: 'Posts an anonymous Suggestion',
	usage: 'anonsuggest',
	helpMsg: true,
	execute(message, args) {
		const {modBot} = message.client.config.channelIDs;

		console.log('running');
		const suggestion = args.join(' ');

		message.client.channels.get(modBot).send('"' + suggestion + '": ' + message.author).then(async sent => {
			await sent.react('✔');
			await sent.react('❌');
		});
	}
};
