module.exports = {
	name: 'ping',
	description: 'Pings the bot to the client and gives a time in (ms)',
	guildOnly: true,
	usage: 'ping',
	execute(message) {

		const pingTime = Date.now() - message.createdTimestamp + ' ms';

		message.channel.send('pong ' + pingTime);

	}
};
