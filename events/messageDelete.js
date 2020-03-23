const moment = require('moment');
const {RichEmbed} = require('discord.js');
const {bannedWords} = require('../utils/profanities.json');
const {getDiscordId} = require('../utils/functions.js');

module.exports = async (client, deletedMessage) => {
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

	const deleteEmbed = new RichEmbed()
		.setAuthor(getDiscordId(user), user.avatarURL)
		.setTitle('Message delete')
		.setColor('#0098DB')
		.addField('Location', `${deletedMessage.channel}`)
		.addField('Message', `${deletedMessageContent ? deletedMessageContent : 'Image Message'}`)
		.addField('Deleted By', `${deletedBy}`)
		.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

	// Prevents double logging when banned word used
	for (const word of bannedWords) {
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

	client.channels.get(adminLogging).send(deleteEmbed);
};
