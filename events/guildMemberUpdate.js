const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {guildMemberUpdate} = require('../utils/commandToggles.json');

module.exports = (client, oldMember, newMember) => {
	if (guildMemberUpdate) {
		const {channelIDs} = client.config;

		if (oldMember.displayName !== newMember.displayName) {
			const nicknameEmbed = createRichEmbed(newMember.user)
				.setTitle('Nickname Change')
				.setColor('#0098DB')
				.addField('Before', `${oldMember.displayName}`, true)
				.addField('After', `${newMember.displayName}`, true);

			client.channels.cache.get(channelIDs.adminLogging).send(nicknameEmbed);
		}
	}
};
