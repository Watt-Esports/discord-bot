const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {guildMemberRemove} = require('../utils/commandToggles.json');

module.exports = async (client, member) => {
	if (guildMemberRemove) {
		const {channelIDs, guildID} = client.config;
		const guild = client.guilds.cache.get(guildID);
		const {user} = member;
		const banLog = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());

		if (banLog.target === user) {
			console.log('ban');
			return;
		}

		const banEmbed = createRichEmbed(user)
			.setColor('#0098DB')
			.setThumbnail(user.avatarURL())
			.setTitle('RIP User left discord');

		client.channels.cache.get(channelIDs.adminLogging).send(banEmbed);
	}
};
