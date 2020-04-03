/* eslint-disable no-case-declarations */
/* eslint-disable indent */
module.exports = {
	name: 'vote',
	description: 'All functionality around intiating a vote',
	usage: 'vote prep <users>, vote start, vote proxy, vote stop, vote bind <channelid>',
	execute(message, args) {
		const command = args.shift();
		let channelBound = false;
		let channelId, role;

		switch (command) {
			case 'bind':
				const channelToBind = args[1];

				if (message.guild && message.guild.available) {
					message.guild.channels.forEach(channel => {
						// Message ID is stored as string since it's too big a number to store
						if (channel.id.toString() === channelToBind) {
							channelBound = true;
							channelId = channelToBind;
							message.channel.send(`${channel.name} has been bound for voting!`);
						}
					});

					if (!channelBound) {
						message.reply('Sorry, I can\'t find a channel with that ID!');
					}
				} else {
					message.reply('Sorry I can\'t do this in DMs!');
				}
				break;
			case 'prep':
				role = args[0];
				message.mentions.users.forEach(member => {
					console.log(member.username);
				});

				message.channel.send(`Vote is prepared for ${role} in ${channelId}`);
		}
	}
};
