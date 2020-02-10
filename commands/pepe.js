const pepeDatabase = require('../utils/pepeDatabase.js');
const {Attachment} = require('discord.js');

module.exports = {
	name: 'pepe',
	description: 'Posts a random pepe',
	usage: 'pepe',
	helpMsg: true,
	execute(message) {
		const randomPepe = pepeDatabase[Math.floor(Math.random() * pepeDatabase.length)];
		const pngPepe = randomPepe.slice(0, -1) + '.png';
		const pepeAttachment = new Attachment(pngPepe);

		message.channel.send(pepeAttachment);
	}
};
