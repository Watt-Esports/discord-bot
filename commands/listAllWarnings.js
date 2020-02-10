const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = {
	name: 'allwarnings',
	description: 'Lists all warnings for every user',
	guildOnly: true,
	modOnly: true,
	adminOnly: true,
	usage: 'allwarnings',
	execute(message) {
		const {channelIDs, spreadsheetID, spreadsheetConfig} = message.client.config;
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
		const memberIdArray = [];
		const counts = {};
		let logMessage = 'Below are the warnings with counts \n';

		spreadsheet.useServiceAccountAuth(spreadsheetConfig, () => {
			spreadsheet.getRows(3, (err, rows) => {
				for (const row of rows) {
					memberIdArray.push(row.memberid);
				}

				memberIdArray.forEach((index) => {
					counts[index] = (counts[index] || 0) + 1;
				});

				for (const entry of Object.entries(counts)) {
					const member = message.guild.members.get(entry[0]);

					logMessage += `${member} has ${entry[1]} warning(s) \n`;
				}

				message.client.channels.get(channelIDs.adminLogging).send(logMessage);
			});
		});
	}
};
