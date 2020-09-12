const {messageReactionAdd} = require('../utils/commandToggles.json');

module.exports = (client, reaction, user) => {
	if (messageReactionAdd) {
		// AnonSuggestion reaction listening
		const {moderation, suggestions} = client.config.channelIDs;

		if (reaction.message.channel === client.channels.cache.get(moderation)) {
			if (user.id !== client.user.id) {
				if (reaction.emoji.name === '✔') {
					const {content} = reaction.message;
					const lastIndex = content.lastIndexOf(' ');
					const suggestion = content.slice(1, lastIndex - 3);

					client.channels.cache.get(suggestions).send(suggestion)
						.then(async sent => {
							await sent.react('👍');
							await sent.react('👎');
						});
					return;
				}
			}
		}
	}
};
