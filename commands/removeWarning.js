const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = {
	name: 'removewarn',
	description: 'Removes a warning or all warning for a mentioned user',
	guildOnly: true,
	adminOnly: true,
	usage: 'removewarn <user> <warnID>',
	async execute(message, args) {
		const {spreadsheetID, spreadsheetConfig} = message.client.config;
		const user = message.mentions.users.first();
		const warnID = args[1];
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

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
			if (warnID) {
				if (warningRow.MemberID === user.id) {
					if (warningRow.WarningID === warnID) {
						await warningRow.delete();
						message.react('✅');
						break;
					}
				}
			}

			if (warnID === undefined) {
				if (warningRow.MemberID === user.id) {
					await warningRow.delete();
				}
				message.react('✅');
			}
		}
	}
};
