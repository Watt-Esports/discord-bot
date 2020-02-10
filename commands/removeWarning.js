const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = {
	name: 'removewarn',
	description: 'Removes a warning or all warning for a mentioned user',
	guildOnly: true,
	adminOnly: true,
	usage: 'removewarn <user> <warnID>',
	execute(message, args) {
		const {spreadsheetID, spreadsheetConfig} = message.client.config;
		const user = message.mentions.users.first();
		const warnID = args[1];
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

		spreadsheet.useServiceAccountAuth(spreadsheetConfig, () => {
			spreadsheet.getRows(3, (err, rows) => {
				for (const row of rows) {
					if (warnID) {
						if (row.memberid === user.id) {
							if (row.warningid === warnID) {
								row.del();
								message.react('✅');
								break;
							}
						}
					}

					if (warnID === undefined) {
						if (row.memberid === user.id) {
							row.del();
							message.react('✅');
						}
					}
				}
			});
		});
	}
};
