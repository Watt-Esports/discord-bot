const reactMap = require('../utils/reactRoleMap.json');
const {writeFile} = require('fs');

module.exports = {
	name: 'addrole',
	description: 'Links a reaction to a role on a certain message',
	guildOnly: true,
	modOnly: true,
	usage: 'addrole <emote> <rolename> <messageID>',
	execute(message, args) {
		const {guildID, channelIDs} = message.client.config;
		const guildObj = message.client.guilds.get(guildID);
		const getRoleChannel = guildObj.channels.get(channelIDs.getRole);
		const emojiNameRaw = args[0];
		const roleName = args[1];
		const messageID = args[2];
		let messageIDExists = false;

		if (!emojiNameRaw || !roleName || !messageID) {
			message.channel.send('Oops! Try again with `addrole <emoji> <roleName> <messageID>`');
			return;
		}

		for (const reactMapKey of Object.keys(reactMap)) {
			if (reactMapKey === messageID.toString()) {
				messageIDExists = true;
				const reactArray = reactMap[reactMapKey];
				const emojiName = emojiNameRaw.substr(2).slice(0, -20);
				const subStrLength = emojiName.length + 3;

				reactArray.push({role: roleName, emoji: emojiName});
				writeFile('utils/reactRoleMap.json', JSON.stringify(reactMap), err => {
					if (err) {
						return;
					}
				});

				getRoleChannel.fetchMessage(messageID)
					.then(messageToAddReact => {
						messageToAddReact.react(emojiNameRaw.substr(subStrLength).slice(0, -1));
					});

				message.react('✅');
			}
		}

		if (!messageIDExists) {
			const emojiName = emojiNameRaw.substr(2).slice(0, -20);
			const subStrLength = emojiName.length + 3;
			const arrayToAdd = [{role: roleName, emoji: emojiName}];

			reactMap[messageID] = arrayToAdd;
			writeFile('utils/reactRoleMap.json', JSON.stringify(reactMap), err => {
				if (err) {
					return;
				}
			});

			getRoleChannel.fetchMessage(messageID)
				.then(messageToAddReact => {
					messageToAddReact.react(emojiNameRaw.substr(subStrLength).slice(0, -1));
				});

			message.react('✅');
		}
	}
};
