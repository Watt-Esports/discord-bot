const bannedWordList = require('../utils/profanities.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'unbanword',
	description: 'Removes a banned word from the list',
	guildOnly: true,
	adminOnly: true,
	usage: 'unbanword exact <wordToRemove>, unbanword wildcard <wordtoRemove>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const typeOfRemoval = args[0];
		const wordToRemove = args[1];

		if (!wordToRemove) {
			message.client.channels.cache.get(adminLogging).send('Please add a word to remove');
			return;
		}

		switch (typeOfRemoval) {
			case 'exact':
				if (!bannedWordList.exact.includes(wordToRemove.toString())) {
					message.client.channels.cache.get(adminLogging).send('Word does not exist in banned list!');
					return;
				}

				for (const [index, word] of bannedWordList.exact.entries()) {
					if (word === wordToRemove) {
						bannedWordList.exact.splice(index, 1);
						break;
					}
				}
				break;
			case 'wildcard':
				if (!bannedWordList.exact.includes(wordToRemove.toString())) {
					message.client.channels.cache.get(adminLogging).send('Word does not exist in banned list!');
					return;
				}

				for (const [index, word] of bannedWordList.wildcard.entries()) {
					if (word === wordToRemove) {
						bannedWordList.wildcard.splice(index, 1);
						break;
					}
				}
				break;
			default:
				message.client.channels.cache.get(adminLogging).send('Please add the type of word you\'re trying to remove from the list (exact or wildcard)!');
				break;
		}

		writeFile('utils/profanities.json', JSON.stringify(bannedWordList), (err) => {
			if (err) {
				throw err;
			}

			message.react('✅');
		});
	}
};
