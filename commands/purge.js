const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = {
	name: 'purge',
	description: 'This command will purge any ammount of messages younger than two weeks',
	guildOnly: true,
	modOnly: true,
	usage: 'purge <Number of messages to purge>',
	execute(message, args) {

		const deleteNum = parseInt(args[0]);
		const {channelIDs} = message.client.config;

		if (isNaN(deleteNum)) {
			message.channel.send('Please enter a valid number');
		} else if (deleteNum <= 0) {
			message.channel.send('Please enter a valid number');

		} else {
			message.channel.bulkDelete(deleteNum + 1);

			const purgeEmbed = createRichEmbed(message.author)
				.setTitle('Purged Messages')
				.setColor('#FF0000')
				.addField('Purged by', `${message.author}`)
				.addField('Number of messages purged', `${deleteNum}`);

			message.client.channels.cache.get(channelIDs.adminLogging).send(purgeEmbed);
		}
	}

};
