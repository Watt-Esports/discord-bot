module.exports = {
	name: 'link',
	description: 'Provides discord invite link',
	usage: 'link',
	helpMsg: true,
	execute(message) {
		const {inviteLink, channelIDs} = message.client.config;

		if (message.channel.id == channelIDs.botSpam) {
			message.channel.send(`Oh look, it's a good boy using the bot channel! \n ${inviteLink}`);
		} else {
			message.client.channels.get(channelIDs.botSpam).send(`${message.member} ${inviteLink}`);
		}
	}
};
