module.exports = {
	name: 'link',
	description: 'Provides discord invite link',
	usage: 'link',
	helpMsg: true,
	execute(message) {
		const {inviteLink} = message.client.config;
		const {botSpam} = message.client.config.channelIDs;

		message.client.channels.get(botSpam).send(`${message.member} ${inviteLink}`);
	}
};
