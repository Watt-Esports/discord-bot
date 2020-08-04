const bannedWords = require('../utils/profanities.json');
const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {messageDelete} = require('../utils/commandToggles.json');

module.exports = async (client, deletedMessage) => {
	if (messageDelete) {
		const {adminLogging} = client.config.channelIDs;
		const deletedMessageContent = deletedMessage.content;
		const user = deletedMessage.author;
		const deletionLog = await deletedMessage.guild.fetchAuditLogs({
			limit: 1,
			type: 'MESSAGE_DELETE'
		}).then(audit => audit.entries.first());
		const {executor, target} = deletionLog;
		let deletedBy = user;

		if (target.id == deletedMessage.author.id) {
			deletedBy = executor;
		}

		const deleteEmbed = createRichEmbed(user)
			.setTitle('Message delete')
			.setColor('#0098DB')
			.addField('Location', `${deletedMessage.channel}`)
			.addField('Message', `${deletedMessageContent ? deletedMessageContent : 'Image Message'}`)
			.addField('Deleted By', `${deletedBy}`);

		// Prevents double logging when banned word used
		for (const word of bannedWords.exact) {
			if (deletedMessageContent.includes(word)) {
				return;
			}
		}

		for (const word of bannedWords.wildcard) {
			if (deletedMessageContent.includes(word)) {
				return;
			}
		}

		// Prevents double logging when a report is issued
		if (deletedMessageContent.startsWith('!report')) {
			return;
		}

		// Prevents logging of HW IDs when posted for verification
		if (deletedMessageContent.startsWith('!member')) {
			return;
		}
		// Prevents double logging of anonymous suggestions
		if (deletedMessageContent.startsWith('!anonsuggest')) {
			return;
		}

		// Prevents logging of votes
		if (deletedMessageContent.startsWith('!vote')) {
			return;
		}

		if (deletedMessageContent.endsWith('Watch your language!') && user.bot) {
			return;
		}

		client.channels.cache.get(adminLogging).send(deleteEmbed);
	}
};
