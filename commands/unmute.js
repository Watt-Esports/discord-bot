const moment = require('moment');
const mutedUserList = require('../utils/muted.json');
const {writeFile} = require('fs');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'unmute',
	description: 'Unmuted a mentioned user',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'unmute <user>',
	execute(message) {
		const {adminLogging} = message.client.config.channelIDs;
		const memberToUnmute = message.mentions.members.first();

		if (!memberToUnmute) {
			message.channel.send('Please mention a user to unmute!');
			return;
		}

		if (!mutedUserList.mutedUsers.includes(memberToUnmute.id.toString())) {
			message.channel.send('User is not muted!');
			return;
		}

		const unmuteEmbed = new RichEmbed()
			.setAuthor(getDiscordId(memberToUnmute.user), memberToUnmute.user.avatarURL)
			.setTitle('User Unmute')
			.setColor('#00FF00')
			.addField('Unmuted By', `${message.author}`)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		for (const [index, userId] of mutedUserList.mutedUsers.entries()) {
			if (userId === memberToUnmute.id) {
				mutedUserList.mutedUsers.splice(index, 1);
				break;
			}
		}

		writeFile('utils/muted.json', JSON.stringify(mutedUserList), (err) => {
			if (err) {
				throw err;
			}

			message.react('✅');
			message.client.channels.get(adminLogging).send(unmuteEmbed);
		});
	}
};
