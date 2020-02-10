const moment = require('moment');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'mute',
	description: 'Mutes a mentioned user with a given reason',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'mute <user> <reason>',
	execute(message, args) {
		const {channelIDs, roleIDs} = message.client.config;
		const memberToMute = message.mentions.members.first();
		const length = args[1];

		if (!memberToMute) {
			message.channel.send('Please mention a user to mute!');
			return;
		}

		if (!length) {
			message.channel.send('Please specify a time for the mute in minutes');
			return;
		}

		if (memberToMute.roles.has(roleIDs.muted)) {
			message.channel.send('User is already muted');
			return;
		}
		const muteEmbed = new RichEmbed()
			.setAuthor(getDiscordId(memberToMute.user), memberToMute.user.avatarURL)
			.setTitle('User Muted')
			.setColor('#FF0000')
			.addField('Muted by', `${message.author}`)
			.addField('Length', `${length} minute(s)`)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		const muteExpired = new RichEmbed()
			.setAuthor(getDiscordId(memberToMute.user), memberToMute.user.avatarURL)
			.setTitle('User Mute Expired')
			.setColor('#FF0000')
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		memberToMute.addRole(roleIDs.muted);
		setTimeout(() => {
			memberToMute.removeRole(roleIDs.muted);
			message.client.channels.get(channelIDs.adminLogging).send(muteExpired);
		}, length * 60000);

		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(muteEmbed);
	}
};
