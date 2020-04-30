const bannedWords = require('../utils/profanities.json');

module.exports = {
	name: 'listbanwords',
	description: 'Lists out the banned words in the server',
	guildOnly: true,
	adminOnly: true,
	usage: 'listbanwords',
	execute(message) {
		const exactBannedWordsString = bannedWords.exact.join(', ');
		const wildcardBannedWordsString = bannedWords.wildcard.join(', ');
		const bannedWordList = `**Exacts**: ${exactBannedWordsString}\n**Wildcards**: ${wildcardBannedWordsString}`;
		const {adminLogging} = message.client.config.channelIDs;

		message.client.channels.get(adminLogging).send(bannedWordList);
	}
};
