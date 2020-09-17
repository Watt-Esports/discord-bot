const bannedWords = require('../utils/profanities.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'banword',
	description: 'Adds a word to the banned word list',
	guildOnly: true,
	adminOnly: true,
	usage: 'banword exact <wordToAdd>, banword wildcard <wordToAdd>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const typeOfAddition = args[0];
		const wordToAdd = args[1];

		if (!wordToAdd) {
			message.client.channels.cache.get(adminLogging).send('Please add a word to ban!');
			return;
		}

		switch (typeOfAddition) {
			case 'exact':
				bannedWords.exact.push(wordToAdd);
				writeFile('utils/profanities.json', JSON.stringify(bannedWords), (err) => {
					if (err) {
						throw err;
					}

					message.react('✅');
				});
				break;
			case 'wildcard':
				bannedWords.wildcard.push(wordToAdd);
				writeFile('utils/profanities.json', JSON.stringify(bannedWords), (err) => {
					if (err) {
						throw err;
					}

					message.react('✅');
				});
				break;
			default:
				message.client.channels.cache.get(adminLogging).send('Please add the type of word you\'re trying to ban (exact or wildcard)');
		}
	}
};
