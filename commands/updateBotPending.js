const {GoogleSpreadsheet} = require('google-spreadsheet');
const {getDiscordId} = require('../utils/functions.js');

module.exports = {
	name: 'update',
	description: 'Updates Society Member list',
	guildOnly: true,
	adminOnly: true,
	modOnly: false,
	usage: 'update',
	async execute(message) {
		const {guildID, roleIDs, spreadsheetID, spreadsheetConfig} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);

		await spreadsheet.useServiceAccountAuth({
			/* eslint-disable-next-line camelcase */
			client_email: spreadsheetConfig.client_email,
			/* eslint-disable-next-line camelcase */
			private_key: spreadsheetConfig.private_key
		});

		await spreadsheet.loadInfo();

		const idSheet = spreadsheet.sheetsByIndex[0];
		const pendingSheet = spreadsheet.sheetsByIndex[1];
		const idRows = await idSheet.getRows();
		const pendingRows = await pendingSheet.getRows();

		for (const pendingRow of pendingRows) {
			for (const idRow of idRows) {
				if (pendingRow.MatriculationNumber === idRow.MatriculationNumber) {
					const guildObj = message.client.guilds.get(guildID);

					guildObj.members.forEach(async (member) => {
						if (member.id === pendingRow.DiscordID) {
							idRow.DiscordName = getDiscordId(member.user);
							idRow.Updated = 'Yes';
							await idRow.save();
							member.addRole(roleIDs.socMember);
						}
					});
					await pendingRow.delete();
				}
			}
		}
		message.react('✅');
	},
};
