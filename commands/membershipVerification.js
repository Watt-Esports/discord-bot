const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = {
	name: 'member',
	description: 'Verifies that you have paid for the society member role',
	guildOnly: true,
	helpMsg: true,
	usage: 'member <MatriculationNumber>',
	execute(message, args) {
		const member = message.member;
		const hwID = args[0].toUpperCase();
		const {roleIDs, spreadsheetID, spreadsheetConfig} = message.client.config;

		message.delete();
		if (hwID.length === 9 && hwID.startsWith('H')) {
			const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

			spreadsheet.useServiceAccountAuth(spreadsheetConfig, () => {
				spreadsheet.getRows(1, (err, rows) => {
					let hwIDInSheet = false;

					for (const row of rows) {
						if (row.matriculationnumber === hwID) {
							hwIDInSheet = true;
							row.discordname = member.user.username + '#' + member.user.discriminator;
							row.updated = 'Yes';
							row.save();
							member.addRole(roleIDs.socMember);
							break;
						}
					}

					if (!hwIDInSheet) {
						const rowToAdd = {
							'matriculation number': hwID,
							'discordid': member.id
						};

						spreadsheet.addRow(2, rowToAdd, () => {
							console.log('Added to Bot Pending');
						});
					}

					if (err) {
						console.log(err);
					}
				});
			});
		} else {
			message.channel.send(member + ' Incorrect Matriculation Number');
		}
	}
};
