const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = {
	name: 'member',
	description: 'Verifies that you have paid for the society member role',
	guildOnly: true,
	helpMsg: true,
	usage: 'member <MatriculationNumber>',
	async execute(message, args) {
		const member = message.member;
		const hwID = args[0].toUpperCase();
		const {roleIDs, spreadsheetID, spreadsheetConfig} = message.client.config;

		message.delete();
		if (hwID.length === 9 && hwID.startsWith('H')) {
			const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
			let hwIDInSheet = false;

			await spreadsheet.useServiceAccountAuth({
				/* eslint-disable-next-line camelcase */
				client_email: spreadsheetConfig.client_email,
				/* eslint-disable-next-line camelcase */
				private_key: spreadsheetConfig.private_key
			});

			await spreadsheet.loadInfo();

			const idSheet = spreadsheet.sheetsByIndex[0];
			const rows = await idSheet.getRows();

			for (const row of rows) {
				if (row.MatriculationNumber == hwID) {
					hwIDInSheet = true;
					row.DiscordName = member.user.username + '#' + member.user.discriminator;
					row.Updated = 'Yes';
					await row.save();
					member.addRole(roleIDs.socMember);
					break;
				}
			}

			if (!hwIDInSheet) {
				const pendingSheet = spreadsheet.sheetsByIndex[2];

				await pendingSheet.addRow({
					'MatriculationNumber': hwID,
					'DiscordID': member.id
				});
			}
		}
	}
};
