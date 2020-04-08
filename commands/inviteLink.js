module.exports = {
	name: 'link',
	description: 'Provides discord invite link',
	usage: 'link',
	helpMsg: true,
	execute(message) {
		const {inviteLink, channelIDs} = message.client.config;
		let flavour;

		// To avoid facepinging the good boy that uses the bot channel <3
		if (message.channel.id == channelIDs.botSpam) {
			flavour = 'Oh look, it\'s a good boy using the bot channel! \n';
		} else {
			flavour = message.member;
		}

		message.client.channels.get(channelIDs.botSpam).send(`${flavour} ${inviteLink}`);
	}
};
