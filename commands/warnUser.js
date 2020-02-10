const GoogleSpreadsheet = require('google-spreadsheet');
const moment = require('moment');
const {RichEmbed} = require('discord.js');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'warn',
	description: 'Creates a wanring for the mentioned user with a reason',
	guildOnly: true,
	adminOnly: true,
	modOnly: true,
	usage: 'warn <user> <reason>',
	execute(message, args) {
		const user = message.mentions.users.first();
		const admin = message.member;
		const reason = args.join(' ').slice('22');
		const memberIdArray = [];
		const counts = {};
		const {channelIDs, spreadsheetID, spreadsheetConfig} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

		if (!user) {
			message.channel.send('Please mention a user to warn');
			return;
		}

		if (!reason) {
			message.channel.send('Please give a reason!');
			return;
		}

		spreadsheet.useServiceAccountAuth(spreadsheetConfig, () => {
			spreadsheet.getRows(3, (err, rows) => {
				for (const row of rows) {
					memberIdArray.push(row.memberid);
				}

				memberIdArray.forEach((index) => {
					counts[index] = (counts[index] || 0) + 1;
				});

				const rowToAdd = {
					'warningid': 1,
					'memberid': user.id,
					'reason': reason,
					'modid': admin.id,
					'warningdate': moment().format('Do MMM YY')
				};

				if (memberIdArray.includes(user.id)) {
					for (const entry of Object.entries(counts)) {
						if (entry[0] === user.id) {
							rowToAdd.warningId = entry[1] + 1;
						}
					}
				}

				spreadsheet.addRow(3, rowToAdd, () => {
					console.log('Added to warning');
				});
			});
		});

		const warnEmbed = new RichEmbed()
			.setAuthor(getDiscordId(user), user.avatarURL)
			.setTitle('Warning Issued')
			.setColor('#FF0000')
			.addField('Moderator', `${message.author}`, true)
			.addField('Reason', `${reason}`, true)
			.setFooter(`${message.createdAt}`);

		message.react('✅');
		message.client.channels.get(channelIDs.adminLogging).send(warnEmbed);
	}
};
