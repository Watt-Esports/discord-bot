const moment = require('moment');
const {MessageEmbed} = require('discord.js');
const {getDiscordId} = require('./getDiscordId.js');

const createRichEmbed = (user) => {
	const newEmbed = new MessageEmbed()
		.setAuthor(getDiscordId(user), user.avatarURL())
		.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

	return newEmbed;
};

module.exports = {createRichEmbed};
