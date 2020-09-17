const pepeDatabase = require('../utils/pepeDatabase.js');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'pepe',
	description: 'Posts a random pepe',
	usage: 'pepe',
	helpMsg: true,
	execute(message) {
		const randomPepe = pepeDatabase[Math.floor(Math.random() * pepeDatabase.length)];
		const pngPepe = randomPepe.slice(0, -1) + '.png';
		const pepeAttachment = new MessageAttachment(pngPepe);

		message.channel.send(pepeAttachment);
	}
};
