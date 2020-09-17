const {GoogleSpreadsheet} = require('google-spreadsheet');

module.exports = {
	name: 'associatemember',
	description: 'Populates spreadsheet with the associate member details',
	guildOnly: true,
	modOnly: true,
	usage: 'associateMember <user>',
	async execute(message) {
		const {roleIDs, spreadsheetID, spreadsheetConfig, channelIDs} = message.client.config;
		const member = message.mentions.members.first();
		const spreadsheet = new GoogleSpreadsheet(spreadsheetID);
		let alreadyAssociateMember;


		if (!member) {
			message.client.channels.cache.get(channelIDs.adminLogging).send('Please mention a user to get them to be an associate member');
			return;
		}

		await spreadsheet.useServiceAccountAuth({
			/* eslint-disable-next-line camelcase */
			client_email: spreadsheetConfig.client_email,
			/* eslint-disable-next-line camelcase */
			private_key: spreadsheetConfig.private_key
		});

		await spreadsheet.loadInfo();

		const associateMemberSheet = spreadsheet.sheetsByIndex[1];
		const rows = await associateMemberSheet.getRows();

		for (const row of rows) {
			if (row.DiscordID === member.id) {
				alreadyAssociateMember = true;
				message.client.channels.cache.get(channelIDs.adminLogging).send(`${message.author}, this person is already an assocaite member!`);
				return;
			}
		}

		if (!alreadyAssociateMember) {
			member.roles.add(roleIDs.associateMember);
			await associateMemberSheet.addRow({
				'Name': member.user.username + '#' + member.user.discriminator,
				'DiscordID': member.id,
				'RoleGiven?': 'Yes'
			});
		}
		message.react('✅');
	}
};
