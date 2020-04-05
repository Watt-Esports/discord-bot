/* eslint-disable no-case-declarations */
/* eslint-disable indent */
module.exports = {
	name: 'vote',
	description: 'All functionality around intiating a vote',
	usage: 'vote prep <users>, vote start, vote proxy, vote stop, vote bind <channelid>',
	execute(message, args) {
		const command = args.shift();

		switch (command) {
			case 'bind':
				const channelToBind = args[0];

				if (message.guild && message.guild.available) {
					message.guild.channels.forEach(channel => {
						// Message ID is stored as string since it's too big a number to store
						if (channel.id.toString() === channelToBind) {
							message.client.voteConfig.channelBound = true;
							message.client.voteConfig.channelId = channelToBind;
							message.channel.send(`<#${channel.id}> has been bound for voting!`);
						}
					});

					if (!message.client.voteConfig.channelBound) {
						message.reply('Sorry, I can\'t find a channel with that ID!');
					}
				} else {
					message.reply('Sorry I can\'t do this in DMs!');
				}
				break;
			case 'prep':
				if (message.client.voteConfig.channelBound) {
					let stringOfCandidates = '';

					message.client.voteConfig.role = args[0];
					message.mentions.users.forEach(member => {
						message.client.voteConfig.peopleStandingIds.push(member.id);
						stringOfCandidates += `${member}\n`;
					});

					message.channel.send(`Vote is prepared for "${message.client.voteConfig.role}" in <#${message.client.voteConfig.channelId}>\nThe people standing are:\n ${stringOfCandidates}`);
				} else {
					message.channel.send('Please bind a channel to vote in first!');
				}
				break;
			case 'start':
				if (!message.client.voteConfig.channelBound) {
					message.channel.send('Please bind a channel to vote in first!');
					break;
				}

				if (!message.client.voteConfig.role) {
					message.channel.send('Please define what role is being voted on, along with who is running!');
					break;
				}
		}
	}
};
