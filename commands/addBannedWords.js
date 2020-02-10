const bannedWordList = require('../utils/profanities.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'banword',
	description: 'Adds a word to the banned word list',
	guildOnly: true,
	adminOnly: true,
	usage: 'banword <wordToAdd>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const wordToAdd = args[0];

		if (args.length !== 1) {
			message.client.channels.get(adminLogging).send('Please add a word to ban!');
			return;
		}

		bannedWordList.bannedWords.push(wordToAdd);
		writeFile('utils/profanities.json', JSON.stringify(bannedWordList), (err) => {
			if (err) {
				throw err;
			}

			message.react('✅');
		});
	}
};
