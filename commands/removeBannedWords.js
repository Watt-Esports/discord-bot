const bannedWordList = require('../utils/profanities.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'unbanword',
	description: 'Removes a banned word from the list',
	guildOnly: true,
	adminOnly: true,
	usage: 'unbanword <wordToRemove>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const wordToRemove = args[0];

		if (args.length !== 1) {
			message.client.channels.get(adminLogging).send('Please add a word to remove!');
			return;
		}

		if (!bannedWordList.bannedWords.includes(wordToRemove.toString())) {
			message.client.channels.get(adminLogging).send('Word does not exist in banned list!');
			return;
		}

		for (const [index, word] of bannedWordList.bannedWords.entries()) {
			if (word === wordToRemove) {
				bannedWordList.bannedWords.splice(index, 1);
				break;
			}
		}

		writeFile('utils/profanities.json', JSON.stringify(bannedWordList), (err) => {
			if (err) {
				throw err;
			}

			message.react('✅');
		});
	}
};
