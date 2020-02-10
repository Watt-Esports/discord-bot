const moment = require('moment');
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
		const {channelIDs, roleIDs} = message.client.config;
		const memberToUnmute = message.mentions.members.first();

		if (!memberToUnmute) {
			message.channel.send('Please mention a user to unmute!');
			return;
		}

		const unmuteEmbed = new RichEmbed()
			.setAuthor(getDiscordId(memberToUnmute.user), memberToUnmute.user.avatarURL)
			.setTitle('User Unmute')
			.setColor('#00FF00')
			.addField('Unmuted By', `${message.author}`)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		memberToUnmute.removeRole(roleIDs.muted);
		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(unmuteEmbed);
	}
};
