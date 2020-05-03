const messageMap = require('../utils/reactRoleMap');

module.exports = (client, reaction, user) => {
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
	const {modBot} = client.config.channelIDs;
	const {suggestions} = client.config.channelIDs;

	if (reaction.message.channel == client.channels.get(modBot)) {
		if(user != client) {
			// Doesn't work yet
			if(reaction.emoji.name == '✔') {
				console.log(reaction.count);
				console.log(reaction.users.size);
				if(reaction.users.size == 2) {
					// Unreactions break this way of doing it
					console.log('Count is 2');
					console.log(suggestions);
					let content = reaction.message.content;

					content = content + content;
					// Need to strip the ping from it. The above is there to let me commit
					client.channels.get(suggestions).send(content).then(async sent => {
						await sent.react('👍');
						await sent.react('👎');
					});
				}
				console.log('Is Tick');
				return;
			}
		}
	}
};
