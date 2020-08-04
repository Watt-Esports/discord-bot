module.exports = {
	name: 'link',
	description: 'Provides discord invite link',
	usage: 'link',
	aliases: ['invite'],
	helpMsg: true,
	execute(message) {
		const {inviteLink, channelIDs} = message.client.config;

		// To avoid facepinging the good boy that uses the bot channel <3
		if (message.channel.id == channelIDs.botSpam) {
			message.channel.send(`Oh look, it's a good boy using the bot channel! \n ${inviteLink}`);
		} else {
			message.client.channels.cache.get(channelIDs.botSpam).send(`${message.member} ${inviteLink}`);
		}
	}
};
