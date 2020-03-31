const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = (client, member) => {
	const {adminLogging} = client.config.channelIDs;
	const {user} = member;
	const leaveEmbed = createRichEmbed(user)
		.setColor('#0098DB')
		.setTitle('RIP User left discord');

	client.channels.get(adminLogging).send(leaveEmbed);
};
