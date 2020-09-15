const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = {
	name: 'mute',
	description: 'Mutes a mentioned user with a given reason',
	guildOnly: true,
	modOnly: true,
	usage: 'mute <user> <time>',
	execute(message, args) {
		const {channelIDs, roleIDs} = message.client.config;
		const memberToMute = message.mentions.members.first();
		const length = args[1].slice(0, -1);
		const lengthDetermine = args[1].slice(-1);
		const acceptedLengthsDetermines = ['m', 'h', 'd'];
		let muteDeteminer, muteMutlipier;

		if (!memberToMute) {
			message.channel.send('Please mention a user to mute!');
			return;
		}

		if (!length) {
			message.channel.send('Please specify a time for the mute!');
			return;
		}

		if (!acceptedLengthsDetermines.find(element => element === lengthDetermine)) {
			message.channel.send('Please use M, H, or D');
			return;
		}

		if (memberToMute.roles.cache.has(roleIDs.muted)) {
			message.channel.send('User is already muted');
			return;
		}

		switch (lengthDetermine) {
			case 'm':
				if (length > 1) {
					muteDeteminer = 'minutes';
				} else {
					muteDeteminer = 'minute';
				}
				muteMutlipier = 1;
				break;
			case 'h':
				if (length > 1) {
					muteDeteminer = 'hours';
				} else {
					muteDeteminer = 'hour';
				}
				muteMutlipier = 60;
				break;
			case 'd':
				if (length > 1) {
					muteDeteminer = 'days';
				} else {
					muteDeteminer = 'day';
				}
				muteMutlipier = 1440;
				break;
		}

		const muteEmbed = createRichEmbed(memberToMute.user)
			.setTitle('User Muted')
			.setColor('#FF0000')
			.addField('Muted by', `${message.author}`)
			.addField('Length', `${length} ${muteDeteminer}`);

		const muteExpired = createRichEmbed(memberToMute.user)
			.setTitle('User Mute Expired')
			.setColor('#FFA500');

		memberToMute.roles.add(roleIDs.muted);
		setTimeout(() => {
			if (memberToMute.roles.cache.has(roleIDs.muted)) {
				memberToMute.roles.remove(roleIDs.muted);
				message.client.channels.cache.get(channelIDs.adminLogging).send(muteExpired);
			}
		}, length * 60000 * muteMutlipier);

		message.react('✅');
		message.client.channels.cache.get(channelIDs.adminLogging).send(muteEmbed);
	}
};
