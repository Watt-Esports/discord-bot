const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {guildMemberRemove} = require('../utils/commandToggles.json');

module.exports = (client, member) => {
	if (guildMemberRemove) {
		const {adminLogging} = client.config.channelIDs;
		const {user} = member;
		const leaveEmbed = createRichEmbed(user)
			.setColor('#0098DB')
			.setTitle('RIP User left discord');

		client.channels.cache.get(adminLogging).send(leaveEmbed);
	}
};
