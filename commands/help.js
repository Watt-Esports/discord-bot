const {RichEmbed} = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all commands, usage and description',
	usage: 'help',
	guildOnly: true,
	helpMsg: true,
	execute(message) {
		const {commands, config} = message.client;
		const {prefix, roleIDs} = config;
		const helpEmbed = new RichEmbed()
			.setTitle('Commands Info')
			.setColor('#000080')
			.setFooter('Got a suggestion for a command? Let a moderator know!');
		const adminEmbed = new RichEmbed()
			.setTitle('Admin Commands')
			.setColor('#00080')
			.setFooter('owo what\'s this');

		for (const command of commands.values()) {
			if (command.adminOnly && message.member.roles.has(roleIDs.admin)) {
				adminEmbed.addField(`\`${prefix}${command.usage}\``, `${command.description}`);
			} else if (command.modOnly && (message.member.roles.has(roleIDs.discOfficer) || message.member.roles.has(roleIDs.comLead))) {
				adminEmbed.addField(`\`${prefix}${command.usage}\``, `${command.description}`);
			} else if (command.helpMsg) {
				helpEmbed.addField(`\`${prefix}${command.usage}\``, `${command.description}`);
			}
		}

		message.author.send(helpEmbed);
		if (message.member.roles.has(roleIDs.admin) || message.member.roles.has(roleIDs.discOfficer) || message.member.roles.has(roleIDs.comLead)) {
			message.author.send(adminEmbed);
		}

		message.react('📧');
	}
};
