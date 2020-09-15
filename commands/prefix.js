const config = require('../config.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'prefix',
	descrption: 'Change the prefix for the bot',
	guildOnly: true,
	adminOnly: true,
	usage: 'prefix <prefix>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const desiredPrefix = args[0];

		if (!desiredPrefix) {
			message.client.channels.cache.get(adminLogging).send(`${message.author}, you need to include a prefix!`);
			return;
		}

		config.prefix = `${desiredPrefix}`;
		writeFile('config.json', JSON.stringify(config), (err) => {
			if (err) {
				throw err;
			}
		});
		message.react('✅');
	}
};
