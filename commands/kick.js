const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = {
	name: 'kick',
	description: 'Kicks a member from the server',
	guildOnly: true,
	modOnly: true,
	usage: 'kick <user> reason',
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const userToKick = message.mentions.users.first();
		const moderatorKicking = message.member;
		const reason = args.join(' ').slice('22');

		if (!userToKick) {
			message.client.channels.cache.get(adminLogging).send(`${moderatorKicking}, you need to mention a user to kick them!`);
			return;
		}

		if (!reason) {
			message.client.channels.cache.get(adminLogging).send(`${moderatorKicking}, you need to provide a reason!`);
			return;
		}

		const kickEmbed = createRichEmbed(userToKick)
			.setTitle('Member Kicked')
			.setColor('#FF0000')
			.addField('Moderator', `${moderatorKicking}`)
			.addField('Reason', `${reason}`);

		message.guild.member(userToKick).kick();
		message.client.channels.cache.get(adminLogging).send(kickEmbed);
		message.react('✅');
	}
};
