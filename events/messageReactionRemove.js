const messageMap = require('../utils/reactRoleMap');
const {messageReactionRemove} = require('../utils/commandToggles.json');

module.exports = (client, reaction, user) => {
	if (messageReactionRemove) {
		const {guildID} = client.config;
		const guildObj = client.guilds.get(guildID);

		for (const messageMapKey of Object.keys(messageMap)) {
			// Message ID is stored as string since it's too big a number to store
			if (messageMapKey === reaction.message.id.toString()) {
				for (const roleMap of messageMap[messageMapKey]) {
					if (reaction.emoji.name === roleMap.emoji) {
						guildObj.members.forEach((member) => {
							if (member.id === user.id) {
								const roleToRemove = guildObj.roles.find(r => r.name === roleMap.role);

								member.removeRole(roleToRemove).then(() => {
									const memberRole = member.roles.find(r => r.name === 'Members');
									const hwMemberRole = member.roles.find(r => r.name === 'HW Members');

									if (!memberRole && !hwMemberRole) {
										if (roleToRemove.name === 'Members' || roleToRemove.name === 'HW Members') {
											member.removeRole(guildObj.roles.find(r => r.name === 'LFG'));
										}
									}
								});
							}
						});
					}
				}
			}
		}
	}
};
