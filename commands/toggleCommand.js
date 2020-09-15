const toggles = require('../utils/commandToggles.json');
const {RichEmbed} = require('discord.js');
const {writeFile} = require('fs');

module.exports = {
	name: 'toggle',
	description: 'Toggles individual commands on or off',
	usage: 'toggle <commandName>, toggle list',
	aliases: ['toggleCommand', 'tc'],
	guildOnly: true,
	adminOnly: true,
	execute(message, args) {
		const commandName = args[0];
		const {adminLogging} = message.client.config.channelIDs;

		if (args.length === 0) {
			const toggleCommandEmbed = new RichEmbed()
				.setColor('#0098DB')
				.setTitle('Toggleable commands');
			let descriptionString = '';

			for (const command of Object.keys(toggles)) {
				descriptionString += `${command}: \`${toggles[command]}\`\n`;
			}

			toggleCommandEmbed.setDescription(descriptionString);
			message.client.channels.get(adminLogging).send(toggleCommandEmbed);
			return;
		}

		if (!Object.keys(toggles).includes(commandName)) {
			message.client.channels.get(adminLogging).send('Command doesn\'t exist');
			return;
		}

		if (args.length === 1) {
			toggles[commandName] = !toggles[commandName];
			const toggleSuccessEmbed = new RichEmbed()
				.setDescription(`Command \`${commandName}\` has been switched to \`${toggles[commandName]}\`.`)
				.setColor('#0098DB');

			message.client.channels.cache.get(adminLogging).send(toggleSuccessEmbed);
			writeFile('utils/commandToggles.json', JSON.stringify(toggles), (err) => {
				if (err) {
					throw err;
				}
			});
			return;
		}
	}
};
