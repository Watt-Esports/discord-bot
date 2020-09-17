const config = require('../config.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'welcomemsg',
	descrption: 'Change the welcome message for the bot',
	guildOnly: true,
	adminOnly: true,
	usage: 'welcomemsg <new welcomemsg>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const welcomemsg = args.join(' ');

		if (!welcomemsg) {
			message.client.channels.cache.get(adminLogging).send(`${message.author}, you need to include a welcome message!`);
			return;
		}

		config.welcomeMsg = `${welcomemsg}`;
		writeFile('config.json', JSON.stringify(config), (err) => {
			if (err) {
				throw err;
			}
		});
		message.react('✅');
	}
};
