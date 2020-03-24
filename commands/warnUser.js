const {GoogleSpreadsheet} = require('google-spreadsheet');
const moment = require('moment');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'warn',
	description: 'Creates a warning for the mentioned user with a reason',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'warn <user> <reason>',
	async execute(message, args) {
		const user = message.mentions.users.first();
		const admin = message.member;
		const reason = args.join(' ').slice('22');
		const memberIdArray = [];
		const counts = {};
		const {channelIDs, spreadsheetID, spreadsheetConfig} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

		if (!user) {
			message.channel.send('Please mention a user to warn!');
			return;
		}

		if (!reason) {
			message.channel.send('Please give a reason!');
			return;
		}

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
			memberIdArray.push(warningRow.MemberID);
		}

		memberIdArray.forEach((index) => {
			counts[index] = (counts[index] || 0) + 1;
		});

		const rowToAdd = {
			'WarningID': 1,
			'MemberID': user.id,
			'Reason': reason,
			'ModID': admin.id,
			'WarningDate': moment().format('Do MMM YY')
		};

		if (memberIdArray.includes(user.id)) {
			for (const entry of Object.entries(counts)) {
				if (entry[0] === user.id) {
					rowToAdd.WarningID = entry[1] + 1;
				}
			}
		}

		await warningSheet.addRow(rowToAdd);

		const warnEmbed = new RichEmbed()
			.setAuthor(getDiscordId(user), user.avatarURL)
			.setTitle('Warning Issued')
			.setColor('#FF0000')
			.addField('Moderator', `${message.author}`, true)
			.addField('Reason', `${reason}`, true)
			.setFooter(moment().format('h:mm a, Do MMMM YYYY'));

		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(warnEmbed);
	}
};
