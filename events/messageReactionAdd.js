const messageMap = require('../utils/reactRoleMap');
const {messageReactionAdd} = require('../utils/commandToggles.json');

module.exports = (client, reaction, user) => {
	if (messageReactionAdd) {
		const {guildID} = client.config;
		const guildObj = client.guilds.get(guildID);

		for (const messageMapKey of Object.keys(messageMap)) {
			// Message ID is stored as string since it's too big a number to store
			if (messageMapKey === reaction.message.id.toString()) {
				for (const roleMap of messageMap[messageMapKey]) {
					if (reaction.emoji.name === roleMap.emoji) {
						guildObj.members.forEach((member) => {
							if (member.id === user.id) {
								const roleToAdd = guildObj.roles.find(r => r.name === roleMap.role);

								member.addRole(roleToAdd);
								if (roleToAdd.name === 'Members' || roleToAdd.name === 'HW Members') {
									member.addRole(guildObj.roles.find(r => r.name === 'LFG'));
								}
							}
						});
					}
				}
			}
		}


		// AnonSuggestion reaction listening
		const {modBot, suggestions} = client.config.channelIDs;

		if (reaction.message.channel === client.channels.get(modBot)) {
			if (user.id !== client.user.id) {
				if (reaction.emoji.name === '✔') {
					const {content} = reaction.message;
					const lastIndex = content.lastIndexOf(' ');
					const suggestion = content.slice(1, lastIndex - 2);

					client.channels.get(suggestions).send(suggestion)
						.then(async sent => {
							await sent.react('👍');
							await sent.react('👎');
						});
					return;
				}
			}
		}
	}
};
