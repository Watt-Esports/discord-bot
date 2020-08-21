const messageMap = require('../utils/reactRoleMap');
const {messageReactionAdd} = require('../utils/commandToggles.json');

module.exports = (client, reaction, user) => {
	if (messageReactionAdd) {
		const {guildID} = client.config;
		const guildObj = client.guilds.cache.get(guildID);

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
		const {moderation, suggestions} = client.config.channelIDs;

		if (reaction.message.channel === client.channels.cache.get(moderation)) {

			if (user.id !== client.user.id) {

				if (reaction.emoji.name === '✔') {

					const {content} = reaction.message;
					const lastIndex = content.lastIndexOf(' ');
					const suggestion = content.slice(1, lastIndex - 3);

					console.log(content);
					console.log(lastIndex);
					console.log(suggestion);

					client.channels.cache.get(suggestions).send(suggestion)
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
