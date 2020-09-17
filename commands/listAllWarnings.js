const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = {
	name: 'allwarnings',
	description: 'Lists all warnings for every user',
	guildOnly: true,
	modOnly: true,
	usage: 'allwarnings',
	async execute(message) {
		const {channelIDs, spreadsheetID, spreadsheetConfig} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
		const memberIdArray = [];
		const counts = {};
		let logMessage = 'Below are the warnings with counts\n';

		await spreadsheet.useServiceAccountAuth({
			/* eslint-disable-next-line camelcase */
			client_email: spreadsheetConfig.client_email,
			/* eslint-disable-next-line camelcase */
			private_key: spreadsheetConfig.private_key
		});

		await spreadsheet.loadInfo();

		const warningSheet = spreadsheet.sheetsByIndex[3];
		const warningRows = await warningSheet.getRows();

		for (const warningRow of warningRows) {
			memberIdArray.push(warningRow.MemberID);
		}

		memberIdArray.forEach((index) => {
			counts[index] = (counts[index] || 0) + 1;
		});

		for (const entry of Object.entries(counts)) {
			const member = message.guild.members.cache.get(entry[0]);

			logMessage += `${member} has ${entry[1]} warning(s)\n`;
		}

		message.client.channels.cache.get(channelIDs.adminLogging).send(logMessage);
	}
};
