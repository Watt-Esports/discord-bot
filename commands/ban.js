const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = {
	name: 'ban',
	description: 'Bans a member from the server',
	guildOnly: true,
	modOnly: true,
	usage: 'Ban <user> reason',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const userToKick = message.mentions.users.first();
		const moderatorBanning = message.member;
		const reason = args.join(' ').slice('22');

		if (!userToKick) {
			message.client.channels.cache.get(adminLogging).send(`${moderatorBanning}, you need to mention a user to ban them!`);
			return;
		}

		if (!reason) {
			message.client.channels.cache.get(adminLogging).send(`${moderatorBanning}, you need to provide a reason!`);
			return;
		}

		const kickEmbed = createRichEmbed(userToKick)
			.setTitle('Member Banned')
			.setColor('#FF0000')
			.addField('Moderator', `${moderatorBanning}`)
			.addField('Reason', `${reason}`);

		userToKick.send(`You have been banned from Watt esports due to ${reason}`).then(() => {
			message.guild.member(userToKick).ban();
			message.client.channels.cache.get(adminLogging).send(kickEmbed);
			message.react('✅');
		});
	}
};
