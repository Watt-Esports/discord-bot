const moment = require('moment');
const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {guildMemberAdd} = require('../utils/commandToggles.json');

module.exports = (client, member) => {
	if (guildMemberAdd) {
		const {roleIDs, channelIDs} = client.config;
		const gamesRole = member.guild.roles.get(roleIDs.games);
		const miscRole = member.guild.roles.get(roleIDs.misc);
		const {adminLogging} = client.config.channelIDs;
		const {user} = member;

		member.addRole(gamesRole);
		member.addRole(miscRole);
		member.send(`Hey there! Welcome to Watt eSports! If you're a fresher please contact a moderator ASAP letting them know, otherwise take a read of <#${channelIDs.welcome}> and enjoy!`);

		const joinEmbed = createRichEmbed(user)
			.setColor('#008000')
			.setTitle('Member Joined!')
			.addField('Account Created', `${moment(user.createdTimestamp).format('Do MMMM YYYY')}`);

		client.channels.get(adminLogging).send(joinEmbed);
	}
};
