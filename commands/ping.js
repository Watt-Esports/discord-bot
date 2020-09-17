module.exports = {
	name: 'ping',
	description: 'Short description of what the command does',
	guildOnly: true,
	usage: 'example usage of the command using <> to show variables',
	execute(message) {

		const pingTime = Date.now() - message.createdTimestamp + ' ms';

		message.channel.send('pong ' + pingTime);

	}
};
