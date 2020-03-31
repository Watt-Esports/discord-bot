const {createRichEmbed} = require('../utils/createRichEmbed.js');

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

		const unmuteEmbed = createRichEmbed(memberToUnmute.user)
			.setTitle('User Unmute')
			.setColor('#FFA500')
			.addField('Unmuted By', `${message.author}`);

		memberToUnmute.removeRole(roleIDs.muted);
		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(unmuteEmbed);
	}
};
