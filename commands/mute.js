const mutedUsersList = require('../utils/muted.json');
const moment = require('moment');
const {RichEmbed} = require('discord.js');
const {writeFile} = require('fs');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'mute',
	description: 'Mutes a mentioned user with a given reason',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'mute <user> <reason>',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const memberToMute = message.mentions.members.first();
		const reason = args.join(' ').slice('22');

		if (!memberToMute) {
			message.channel.send('Please mention a user to mute!');
			return;
		}

		if (!reason) {
			message.channel.send('Please include a reason');
			return;
		}
		const muteEmbed = new RichEmbed()
			.setAuthor(getDiscordId(memberToMute.user), memberToMute.user.avatarURL)
			.setTitle('User Muted')
			.setColor('#FF0000')
			.addField('Muted by', `${message.author}`)
			.addField('Reason', `${reason}`)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		mutedUsersList.mutedUsers.push(memberToMute.id);
		writeFile('utils/muted.json', JSON.stringify(mutedUsersList), (err) => {
			if (err) {
				throw err;
			}

			message.react('✅');
			message.client.channels.get(adminLogging).send(muteEmbed);
		});
	}
};
