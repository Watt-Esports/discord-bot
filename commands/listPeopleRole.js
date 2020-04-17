module.exports = {
	name: 'members',
	description: 'Lists all the members that have a certain role',
	usage: 'members <rolename>',
	guildOnly: true,
	modOnly: true,
	execute(message, args) {
		const {adminLogging} = message.client.config.channelIDs;
		const roleToFind = args[0];
		const roleObj = message.guild.roles.find(r => r.name === roleToFind);
		let listOfMembers = `Members with the role ${roleToFind} \n`;

		if (!roleObj) {
			return;
		}

		for (const member of roleObj.members.values()) {
			listOfMembers += `${member} \n`;
		}

		message.client.channels.get(adminLogging).send(listOfMembers);
	}
};

