const moment = require('moment');
const {GoogleSpreadsheet} = require('google-spreadsheet');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'listwarn',
	description: 'List all the warnings for a certain user',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'listwarn <user>',
	async execute(message) {
		const user = message.mentions.users.first();
		const {channelIDs, spreadsheetID, spreadsheetConfig, guildID} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
		let warningsFound = false;

		if (!user) {
			message.channel.send('Please mention a user to get their list of warnings!');
			return;
		}

		const listWarningEmbed = new RichEmbed()
			.setAuthor(getDiscordId(user), user.avatarURL)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		await spreadsheet.useServiceAccountAuth({
			/* eslint-disable-next-line camelcase */
			client_email: spreadsheetConfig.client_email,
			/* eslint-disable-next-line camelcase */
			private_key: spreadsheetConfig.private_key
		});

		await spreadsheet.loadInfo();

		const warningSheet = spreadsheet.sheetsByIndex[2];
		const warningRows = await warningSheet.getRows();

		for (const warningRow of warningRows) {
			if (warningRow.MemberID === user.id) {
				warningsFound = true;
				let adminUser;
				const guildObj = message.client.guilds.get(guildID);

				guildObj.members.forEach((member) => {
					if (member.id === warningRow.ModID) {
						adminUser = member;
					}
				});
				listWarningEmbed
					.addField('Reason', `(${warningRow.WarningID}) - ${warningRow.Reason}`, true)
					.addField('Moderator', `${adminUser}`, true)
					.addField('Date', `${warningRow.WarningDate}`, true);
			}
		}

		if (warningsFound) {
			listWarningEmbed
				.setTitle('List of Warnings')
				.setColor('#FF0000');
			message.client.channels.get(channelIDs.adminLogging).send(listWarningEmbed);
		} else {
			listWarningEmbed
				.setTitle('No Warnings. This is a good boio')
				.setColor('#008000');
			message.client.channels.get(channelIDs.adminLogging).send(listWarningEmbed);
		}
	}
};
