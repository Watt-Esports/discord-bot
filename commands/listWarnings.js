const moment = require('moment');
const GoogleSpreadsheet = require('google-spreadsheet');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'listwarn',
	description: 'List all the warnings for a certain user',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'listwarn <user>',
	execute(message) {
		const user = message.mentions.users.first();
		const {channelIDs, spreadsheetID, spreadsheetConfig, guildID} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
		const listWarningEmbed = new RichEmbed()
			.setAuthor(getDiscordId(user), user.avatarURL)
			.setTitle('List of Warnings')
			.setColor('#FF0000')
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		if (!user) {
			message.channel.send('Please mention a user to get their list of warnings');
			return;
		}

		spreadsheet.useServiceAccountAuth(spreadsheetConfig, () => {
			spreadsheet.getRows(3, (err, rows) => {
				for (const row of rows) {
					if (row.memberid === user.id) {
						let adminUser;
						const guildObj = message.client.guilds.get(guildID);

						guildObj.members.forEach((member) => {
							if (member.id === row.modid) {
								adminUser = member;
							}
						});

						listWarningEmbed
							.addField('Reason', `(${row.warningid}) - ${row.reason}`, true)
							.addField('Moderator', `${adminUser}`, true)
							.addField('Date', `${row.warningdate}`, true);
					}
				}

				message.client.channels.get(channelIDs.adminLogging).send(listWarningEmbed);

				if (err) {
					console.log(err);
				}
			});
		});
	}
};
