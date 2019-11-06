const {writeFile} = require('fs');
const mutedUserList = require('../utils/muted.json');
const {RichEmbed} = require('discord.js');

module.exports = {
	name: 'unmute',
	description: 'Unmuted a mentioned user',
	guildOnly: true,
	modOnly: true,
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
			.setTitle('User Unmute')
			.setColor('#00FF00')
			.addField('User Unmuted', `${memberToUnmute}`)
			.addField('Unmuted By', `${message.author}`, true)
			.setFooter(`${message.createdAt}`);

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
