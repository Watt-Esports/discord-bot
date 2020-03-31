const {createRichEmbed} = require('../utils/createRichEmbed.js');

module.exports = (client, oldMessage, newMessage) => {
	const {adminLogging} = client.config.channelIDs;
	const user = newMessage.author;

	if (oldMessage.content === newMessage.content) return;
	if (!oldMessage.partial) {
		const editEmbed = createRichEmbed(user)
			.setColor('#0098DB')
			.addField('Message Edit', `[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id})`)
			.addField('Before', `${oldMessage.content}`)
			.addField('After', `${newMessage.content}`);

		client.channels.get(adminLogging).send(editEmbed).catch(console.error);
	}
};
