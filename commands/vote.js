/* eslint-disable no-case-declarations */
/* eslint-disable indent */
module.exports = {
	name: 'vote',
	description: 'All functionality around intiating a vote',
	usage: 'vote prep <role> <users>, vote start, vote proxy, vote stop, vote bind <channelid>',
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

					message.channel.send(`Vote is prepared for "${message.client.voteConfig.role}" in <#${message.client.voteConfig.channelId}>\nThe people standing are:\n${stringOfCandidates}`);
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

				if (message.guild && message.guild.available) {
					const peopleStanding = message.client.voteConfig.peopleStandingIds;
					let votingOpenMessage = `Please vote on the following candidates for the position of ${message.client.voteConfig.role}\n`;


					for (const person of peopleStanding) {
						const discordUsername = message.guild.members.get(person);
						const voteKey = peopleStanding.indexOf(person) + 1;

						votingOpenMessage += `[${voteKey}] - ${discordUsername}\n`;
					}

					const peopleRunningTotal = peopleStanding.length;

					votingOpenMessage += `[${peopleRunningTotal + 1}] - RON\n[${peopleRunningTotal + 2}] - Abstain\nTo vote, DM ${message.client.user} "!vote add <number>" where number is the assigned to the person you want to vote for`;

					message.client.channels.get(message.client.voteConfig.channelId).send(votingOpenMessage);
					message.client.voteConfig.voteOpen = true;
					break;
				}
				break;
			case 'add':
				const voteToCast = parseInt(args[0]);

				if (message.client.voteConfig.voteOpen) {
					if (message.client.voteConfig.votersList.includes(message.author.id)) {
						message.author.send('Seems like you\'ve already voted');
						break;
					}

					if (message.channel.type === 'text') {
						message.delete();
						message.author.send('Please DM me your vote!');
						break;
					}

					if (isNaN(voteToCast)) {
						message.author.send('Please use a number to vote!');
						break;
					}

					if (voteToCast > message.client.voteConfig.peopleStandingIds.length + 2) {
						message.author.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
						break;
					}

					message.client.voteConfig.voteCount.push(voteToCast);
					message.client.voteConfig.votersList.push(message.author.id);
					message.react('✅');
				} else if (message.channel.type === 'text') {
					message.delete();
					message.author.send('Hold your horses! Votes aren\'t open yet!');
				} else {
					message.author.send('Hold your horses! Votes aren\'t open yet!');
				}
		}
	}
};
