/* eslint-disable no-case-declarations */
/* eslint-disable indent */
module.exports = {
	name: 'vote',
	description: 'All functionality around intiating a vote',
	usage: 'vote prep <role> <users>, vote start, vote proxy, vote stop, vote bind <channelid>',
	execute(message, args) {
		const command = args.shift();
		const {guildID, roleIDs} = message.client.config;
		const guildObj = message.client.guilds.get(guildID);

		switch (command) {
			case 'bind':
				const channelToBind = args[0];
				const personBinding = message.member;
				const personBindingDiscord = guildObj.members.get(personBinding.id);

				if (personBindingDiscord.roles.has(roleIDs.admin)) {
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
				}
				break;
			case 'prep':
				const personPrepping = message.member;
				const personPreppingVote = guildObj.members.get(personPrepping.id);

				if (personPreppingVote.roles.has(roleIDs.admin)) {
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
				}
				break;
			case 'start':
				const personStarting = message.member;
				const personStartingVote = guildObj.members.get(personStarting.id);

				if (personStartingVote.roles.has(roleIDs.admin)) {
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
				}
				break;
			case 'add':
				const voteToCast = parseInt(args[0]);
				const memberVoting = message.author;
				const memberVotingGuild = guildObj.members.get(memberVoting.id);
				let memberVoted = false;
				let memberRunning = false;

				message.client.voteConfig.votes.forEach((voteEntry) => {
					if (voteEntry.voter === message.author.id) {
						memberVoted = true;
					}
				});

				message.client.voteConfig.peopleStandingIds.forEach((standee) => {
					if (standee === message.author.id) {
						memberRunning = true;
					}
				});

				if (message.client.voteConfig.voteOpen) {
					if (memberRunning) {
						memberVoting.send('You are standing for this position, therefore cannot vote!');
					}
					if (!memberVotingGuild.roles.has(roleIDs.socMember)) {
						memberVoting.send('Sorry, you aren\'t a society member, and cannot vote. If you think this is incorrect, please DM a commitee member');
						break;
					}

					if (message.channel.type === 'text') {
						message.delete();
						memberVoting.send('Please DM me your vote!');
						break;
					}

					if (memberVoted) {
						memberVoting.send('You\'ve already cast your vote!');
						break;
					}


					if (isNaN(voteToCast)) {
						memberVoting.send('Please use a number to vote!');
						break;
					}

					if (voteToCast > message.client.voteConfig.peopleStandingIds.length + 2) {
						memberVoting.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
						break;
					}

					const candidateId = message.client.voteConfig.peopleStandingIds[voteToCast - 1];
					const candidate = guildObj.members.get(candidateId);

					memberVoting.send(`You have voted for ${candidate}. If this is incorrect, please reply with !vote cancel, and revote!`);
					message.client.voteConfig.votes.push({voter: message.author.id, vote: voteToCast});

				} else if (message.channel.type === 'text') {
					message.delete();
					memberVoting.send('Hold your horses! Votes aren\'t open yet!');
					break;
				} else {
					message.author.send('Hold your horses! Votes aren\'t open yet!');
					break;
				}
				break;
			case 'cancel':
				const memberCancellingVote = message.author;
				let memberHasVoted = false;
				let voteToRemove = {};

				message.client.voteConfig.votes.forEach((votePair) => {
					if (votePair.voter === memberCancellingVote.id) {
						voteToRemove = message.client.voteConfig.votes.indexOf(votePair);
						memberHasVoted = true;
					}
				});

				if (memberHasVoted) {
					message.client.voteConfig.votes.splice(voteToRemove, 1);
					message.author.send('Vote removed successfully. Please DM me with your new vote');
				} else {
					message.author.send('You haven\'t placed a vote yet!');
				}
		}
	}
};
