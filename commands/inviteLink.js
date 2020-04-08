module.exports = {
	name: 'link',
	description: 'Provides discord invite link',
	usage: 'link',
	helpMsg: true,
	execute(message) {
		const {inviteLink, channelIDs} = message.client.config;

		message.client.channels.get(channelIDs.botSpam).send(`${message.member} ${inviteLink}`);
	}
};
