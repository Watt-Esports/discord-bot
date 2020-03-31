const {createRichEmbed} = require('../utils/createRichEmbed.js');

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
		const muteEmbed = createRichEmbed(memberToMute.user)
			.setTitle('User Muted')
			.setColor('#FF0000')
			.addField('Muted by', `${message.author}`)
			.addField('Length', `${length} minute(s)`);

		const muteExpired = createRichEmbed(memberToMute.user)
			.setTitle('User Mute Expired')
			.setColor('#FFA500');

		memberToMute.addRole(roleIDs.muted);
		setTimeout(() => {
			if (memberToMute.roles.has(roleIDs.muted)) {
				memberToMute.removeRole(roleIDs.muted);
				message.client.channels.get(channelIDs.adminLogging).send(muteExpired);
			}
		}, length * 60000);

		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(muteEmbed);
	}
};
