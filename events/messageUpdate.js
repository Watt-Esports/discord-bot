const {createRichEmbed} = require('../utils/createRichEmbed.js');
const {messageUpdate} = require('../utils/commandToggles.json');

module.exports = (client, oldMessage, newMessage) => {
	if (messageUpdate) {
		const {adminLogging} = client.config.channelIDs;
		const user = newMessage.author;

		if (oldMessage.content === newMessage.content) return;
		if (!oldMessage.partial) {
			const editEmbed = createRichEmbed(user)
				.setColor('#0098DB')
				.setTitle('Message Edited')
				.setDescription(`[Jump to Message](https://discordapp.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}) in ${oldMessage.channel}`)
				.addField('Before', `${oldMessage.content}`)
				.addField('After', `${newMessage.content}`);

			client.channels.cache.get(adminLogging).send(editEmbed).catch(console.error);
		}
	}
};
