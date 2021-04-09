/* eslint-disable no-case-declarations */
module.exports = {
	name: 'vote',
	description: 'All functionality around intiating a vote',
	usage: 'vote prep <role> <users>, vote start, vote proxy, vote stop, vote bind <channelid>',
	execute(message, args) {
		const command = args.shift();
		const {guildID, roleIDs} = message.client.config;
		const guildObj = message.client.guilds.cache.get(guildID);
		const associateMemberIDs = [
			150630241189101568,
			117585790292197382,
			496670898267619359,
			229611611780939776,
			205323535667822592
		];

		switch (command) {
			case 'bind':
				const channelToBind = args[0];
				const personBindingChannel = message.member;

				if (personBindingChannel.roles.cache.has(roleIDs.admin)) {
					if (message.guild && message.guild.available) {
						message.guild.channels.cache.find(channel => {
							// Message ID is stored as string since it's too big a number to store
							if (channel.id.toString() === channelToBind) {
								message.client.voteConfig.channelBound = true;
								message.client.voteConfig.channelId = channelToBind;
								message.channel.send(`<#${channel.id}> has been bound for voting!`);
							}
						});

						if (!message.client.voteConfig.channelBound) {
							message.reply('Sorry, I can\'t find a channel with that ID!');
							break;
						}
					} else {
						message.reply('Sorry I can\'t do this in DMs!');
						break;
					}
				}
				break;
			case 'type':
				const personSettingType = message.member;
				const voteType = args[0];

				if (personSettingType.roles.cache.has(roleIDs.admin)) {
					if (voteType === 'closed') {
						message.client.voteConfig.type = voteType;
						message.channel.send('Vote type has been set to a closed vote');
						break;
					}

					if (voteType === 'election') {
						message.client.voteConfig.type = voteType;
						message.channel.send('Vote type has been set to election');
						break;
					}
					message.channel.send('Sorry, this is not a vote type! Please try again with either closed or election');
				}
				break;
			case 'prep':
				const personPreppingVote = message.member;

				message.client.voteConfig.peopleStandingIds = [];

				if (personPreppingVote.roles.cache.has(roleIDs.admin)) {
					if (message.client.voteConfig.channelBound) {
						if (message.client.voteConfig.type === 'election') {
							let stringOfCandidates = '';

							message.client.voteConfig.role = args[0];
							message.mentions.users.forEach(member => {
								message.client.voteConfig.peopleStandingIds.push(member.id);
								stringOfCandidates += `${member}\n`;
							});

							message.channel.send(`Vote is prepared for "${message.client.voteConfig.role}" in <#${message.client.voteConfig.channelId}>\nThe people standing are:\n${stringOfCandidates}`);
							break;
						} else if (message.client.voteConfig.type === 'closed') {
							const statement = args.join(' ');

							message.client.voteConfig.statement = statement;

							message.channel.send(`Vote is prepared for "${statement}" in <#${message.client.voteConfig.channelId}>`);
							break;
						} else {
							message.channel.send('Please set a vote type first');
							break;
						}
					} else {
						message.channel.send('Please bind a channel to vote in first!');
						break;
					}
				}
				break;
			case 'start':
				const personStartingVote = message.member;

				if (personStartingVote.roles.cache.has(roleIDs.admin)) {
					if (!message.client.voteConfig.channelBound) {
						message.channel.send('Please bind a channel to vote in first!');
						break;
					}

					if (message.guild && message.guild.available) {
						if (!message.client.voteConfig.type) {
							message.channel.send('Please set a vote type first');
							break;
						}

						if (message.client.voteConfig.type === 'election') {
							if (!message.client.voteConfig.role) {
								message.channel.send('Please define what role is being voted on, along with who is running!');
								break;
							}
							const peopleStanding = message.client.voteConfig.peopleStandingIds;
							let votingOpenMessage = `Please vote on the following candidates for the position of ${message.client.voteConfig.role}\n`;


							for (const person of peopleStanding) {
								const discordUsername = message.guild.members.cache.get(person);
								const voteKey = peopleStanding.indexOf(person) + 1;

								votingOpenMessage += `[${voteKey}] - ${discordUsername}\n`;
							}

							const peopleRunningTotal = peopleStanding.length;

							for (let i = 0; i < peopleRunningTotal + 2; i++) {
								message.client.voteConfig.voteCounts.push(0);
							}

							votingOpenMessage += `[${peopleRunningTotal + 1}] - RON\n[${peopleRunningTotal + 2}] - Abstain\nTo vote, DM ${message.client.user} "!vote add <number>" where number is the assigned to the person you want to vote for\nFor proxy votes, this should have been set up and explained to you prior to this. If this is not the case, please let a committee member know`;

							message.client.channels.cache.get(message.client.voteConfig.channelId).send(votingOpenMessage);
							message.client.voteConfig.voteOpen = true;
							break;
						}

						if (message.client.voteConfig.type === 'closed') {
							if (!message.client.voteConfig.statement) {
								message.channel.send('Please define what the vote is!');
								break;
							}
							const votingOpenMessage = `Please vote on the following\n${message.client.voteConfig.statement}\n[1] - Yes\n[2] - No\n[3] - Abstain\nTo vote, DM ${message.client.user} "!vote add <number>" where number is the assigned to the person you want to vote for`;

							message.client.channels.cache.get(message.client.voteConfig.channelId).send(votingOpenMessage);
							message.client.voteConfig.voteCounts.push(0, 0, 0);
							message.client.voteConfig.voteOpen = true;
							break;
						}
					}
				}
				break;
			case 'add':
				const voteToCast = parseInt(args[0]);
				const memberVoting = message.author;
				const memberVotingGuild = guildObj.members.cache.get(memberVoting.id);
				let memberVoted = false;
				let memberRunning = false;

				message.client.voteConfig.votes.find((voteEntry) => {
					if (voteEntry.voter === message.author.id) {
						memberVoted = true;
					}
				});

				if (message.client.voteConfig.voteOpen) {
					if (!memberVotingGuild.roles.cache.has(roleIDs.socMember)) {
						memberVoting.send('Sorry, you aren\'t a society member, and cannot vote. If you think this is incorrect, please DM a commitee member');
						break;
					}

					if (associateMemberIDs.includes(memberVoting.id)) {
						memberVoting.send('Sorry, you are an associate member and cannot vote.');
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

					if (message.channel.type === 'text') {
						message.delete();
						memberVoting.send('Please DM me your vote!');
						break;
					}

					if (message.client.voteConfig.type === 'election') {
						message.client.voteConfig.peopleStandingIds.find((standee) => {
							if (standee === message.author.id) {
								memberRunning = true;
							}
						});

						if (memberRunning) {
							memberVoting.send('You are standing for this position, therefore cannot vote!');
							break;
						}

						if ((voteToCast > message.client.voteConfig.peopleStandingIds.length + 2) || (voteToCast < 0) || (voteToCast === 0)) {
							memberVoting.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
							break;
						}

						const candidateId = message.client.voteConfig.peopleStandingIds[voteToCast - 1];
						let candidate = guildObj.members.cache.get(candidateId);

						if (voteToCast === message.client.voteConfig.peopleStandingIds.length + 1) {
							candidate = 're-opening nominations';
						}

						if (voteToCast === message.client.voteConfig.peopleStandingIds.length + 2) {
							candidate = 'abstaining';
						}

						memberVoting.send(`You have voted for ${candidate}. If this is incorrect, please reply with !vote cancel, and revote!`);
						message.client.voteConfig.votes.push({voter: message.author.id, vote: voteToCast});
						message.client.voteConfig.voteCounts[voteToCast - 1] += 1;
						break;
					}

					if (message.client.voteConfig.type === 'closed') {
						if (isNaN(voteToCast)) {
							memberVoting.send('Please use a number to vote!');
							break;
						}

						if ((voteToCast < 0) || (voteToCast > 3) || (voteToCast === 0)) {
							memberVoting.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
							break;
						}

						if (voteToCast === 1) {
							memberVoting.send(`You have voted yes to ${message.client.voteConfig.statement}. If this is incorrect, please reply with !vote cancel, and revote!`);
						}

						if (voteToCast === 2) {
							memberVoting.send(`You have voted no to ${message.client.voteConfig.statement}. If this is incorrect, please reply with !vote cancel, and revote!`);
						}

						if (voteToCast === 3) {
							memberVoting.send(`You have voted to abstain for ${message.client.voteConfig.statement}. If this is incorrect, please reply with !vote cancel, and revote!`);
						}
						message.client.voteConfig.votes.push({voter: message.author.id, vote: voteToCast});
						message.client.voteConfig.voteCounts[voteToCast - 1] += 1;
						break;
					}
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
				let voteToRemoveIndex = {};

				if (message.client.voteConfig.voteOpen) {
					message.client.voteConfig.votes.find((votePair) => {
						if (votePair.voter === memberCancellingVote.id) {
							voteToRemove = votePair.vote;
							voteToRemoveIndex = message.client.voteConfig.votes.indexOf(votePair);
							memberHasVoted = true;
						}
					});

					if (memberHasVoted) {
						message.client.voteConfig.votes.splice(voteToRemoveIndex, 1);
						message.author.send('Vote removed successfully. Please DM me with your new vote');
						message.client.voteConfig.voteCounts[voteToRemove - 1] -= 1;
						break;
					} else {
						message.author.send('You haven\'t placed a vote yet!');
						break;
					}
				}
				break;
			case 'addproxy':
				const proxyVoter = message.mentions.users.first();
				const proxyVotee = message.member.id;
				const proxyVote = parseInt(args[1]);
				let proxyVoted = false;
				let proxyRunning = false;

				if (message.client.voteConfig.voteOpen) {
					if (message.channel.name === 'proxy-votes') {
						if (message.client.voteConfig.type === 'election') {
							if (proxyVoter) {
								const proxyVoterGuild = guildObj.members.cache.get(proxyVoter.id);

								message.client.voteConfig.votes.find((voteEntry) => {
									if (voteEntry.voter === proxyVoter.id) {
										proxyVoted = true;
									}
								});

								message.client.voteConfig.peopleStandingIds.find((standee) => {
									if (standee === proxyVoter.id) {
										proxyRunning = true;
									}
								});

								if (proxyVoter.id === message.member.id) {
									message.channel.send('You can\'t proxy for yourself. Please use !vote add <number>');
									break;
								}
								if (proxyRunning) {
									message.channel.send('This person is running for the position being voted on, therefore is not eligible for voting');
									break;
								}

								if (proxyVoted) {
									message.channel.send('This user has already submitted a vote via another proxy or themselves');
									break;
								}

								if (!proxyVoterGuild.roles.cache.has(roleIDs.socMember)) {
									message.channel.send('This person is not a society member, and is ineligible to vote. If you think this incorrect, please get in touch with a committee member');
									break;
								}

								if (associateMemberIDs.includes(proxyVoter.id)) {
									message.channel.send('This person is an associate member and not eligible to vote');
									break;
								}

								if (isNaN(proxyVote)) {
									message.channel.send('Please use a number to vote!');
									break;
								}

								if ((proxyVote > message.client.voteConfig.peopleStandingIds.length + 2) || (proxyVote < 0)) {
									message.channel.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
									break;
								}

								const candidateId = message.client.voteConfig.peopleStandingIds[proxyVote - 1];
								let candidate = guildObj.members.cache.get(candidateId);

								if (proxyVote === message.client.voteConfig.peopleStandingIds.length + 1) {
									candidate = 're-opening nominations';
								}

								if (proxyVote === message.client.voteConfig.peopleStandingIds.length + 2) {
									candidate = 'abstaining';
								}

								message.channel.send(`You have voted for ${candidate} on behalf of ${proxyVoter}.\n If this is incorrect, please reply with !vote cancelproxy, and revote!`);
								message.client.voteConfig.votes.push({voter: proxyVoter.id, vote: proxyVote});
								message.client.voteConfig.voteCounts[proxyVote - 1] += 1;
								message.client.voteConfig.proxyVoters.push({voter: proxyVoter.id, proxy: proxyVotee});
								break;
							} else {
								message.channel.send('Please mention someone to add their proxy vote!');
								break;
							}
						}

						if (message.client.voteConfig.type === 'closed') {
							if (proxyVoter) {
								const proxyVoterGuild = guildObj.members.cache.get(proxyVoter.id);

								message.client.voteConfig.votes.find((voteEntry) => {
									if (voteEntry.voter === proxyVoter.id) {
										proxyVoted = true;
									}
								});

								if (proxyVoter.id === message.member.id) {
									message.channel.send('You can\'t proxy for yourself. Please use !vote add <number>');
									break;
								}

								if (proxyVoted) {
									message.channel.send('This user has already submitted a vote via another proxy or themselves');
									break;
								}

								if (!proxyVoterGuild.roles.cache.has(roleIDs.socMember)) {
									message.channel.send('This person is not a society member, and is ineligible to vote. If you think this incorrect, please get in touch with a committee member');
									break;
								}

								if (associateMemberIDs.includes(proxyVoter.id)) {
									message.channel.send('This person is an assocaite member and is ineligible to vote');
									break;
								}

								if (isNaN(proxyVote)) {
									message.channel.send('Please use a number to vote!');
									break;
								}

								if ((proxyVote > 3) || (proxyVote < 0) || (proxyVote === 0)) {
									message.channel.send(`Please enter a number shown in <#${message.client.voteConfig.channelId}>`);
									break;
								}

								if (proxyVote === 1) {
									message.channel.send(`You have voted yes to ${message.client.voteConfig.statement} on behalf of ${proxyVoter}. If this is incorrect, please reply with !vote cancelproxy, and revote!`);
								}

								if (proxyVote === 2) {
									message.channel.send(`You have voted no to ${message.client.voteConfig.statement} on behalf of ${proxyVoter}. If this is incorrect, please reply with !vote cancelproxy, and revote!`);
								}

								if (proxyVote === 3) {
									message.channel.send(`You have voted to abstain for ${message.client.voteConfig.statement} on behalf of ${proxyVoter}. If this is incorrect, please reply with !vote cancelproxy, and revote!`);
								}

								message.client.voteConfig.votes.push({voter: proxyVoter.id, vote: proxyVote});
								message.client.voteConfig.voteCounts[proxyVote - 1] += 1;
								message.client.voteConfig.proxyVoters.push({voter: proxyVoter.id, proxy: proxyVotee});
								break;
							}
						}
					}
				}
				break;
			case 'cancelproxy':
				const proxyVoterCancel = message.mentions.users.first();
				const proxyVoteeCancel = message.member;
				let proxyHasVoted = false;
				let notOriginalProxy = false;
				let proxyVoteToRemove = {};
				let proxyVoteToRemoveIndex = {};
				let proxyPairToRemoveIndex = {};

				if (message.client.voteConfig.voteOpen) {

					if (!proxyVoterCancel) {
						message.channel.send('Please mention a user to remove their proxy');
						break;
					}

					message.client.voteConfig.votes.find((votePair) => {
						if (votePair.voter === proxyVoterCancel.id) {
							proxyVoteToRemove = votePair.vote;
							proxyVoteToRemoveIndex = message.client.voteConfig.votes.indexOf(votePair);
							proxyHasVoted = true;
						}
					});

					message.client.voteConfig.proxyVoters.find((votePair) => {
						if (votePair.voter === proxyVoterCancel.id && votePair.proxy !== proxyVoteeCancel.id) {
							proxyPairToRemoveIndex = message.client.voteConfig.votes.indexOf(votePair);
							notOriginalProxy = true;
						}
					});

					if (notOriginalProxy) {
						message.channel.send('You can only remove proxy votes for people you have proxied for');
						break;
					}

					if (proxyHasVoted) {
						message.client.voteConfig.votes.splice(proxyVoteToRemoveIndex, 1);
						message.client.voteConfig.voteCounts[proxyVoteToRemove - 1] -= 1;
						message.client.voteConfig.proxyVoters.splice(proxyPairToRemoveIndex, 1);
						message.channel.send(`Vote removed for ${proxyVoterCancel}. Please re add the vote via the addproxy command`);
						break;
					}

				} else {
					message.channel.send('This person has no proxy vote in currently!');
					break;
				}
				break;
			case 'results':
				const personRequestingResults = message.member;
				let resultMessage = '';

				if (personRequestingResults.roles.cache.has(roleIDs.admin)) {
					message.client.channels.cache.get(message.client.voteConfig.channelId).send('----------------------------------------------------------------\nResults time!');

					if (message.client.voteConfig.type === 'election') {
						for (const personStanding of message.client.voteConfig.peopleStandingIds) {
							const personStandingDiscord = message.guild.members.cache.get(personStanding);
							const votesRecieved = message.client.voteConfig.voteCounts[message.client.voteConfig.peopleStandingIds.indexOf(personStanding)];

							resultMessage += `${personStandingDiscord} recieved ${votesRecieved} votes\n`;
						}
						resultMessage += `${message.client.voteConfig.voteCounts[message.client.voteConfig.peopleStandingIds.length]} people want to re-open nominations\n`;
						resultMessage += `${message.client.voteConfig.voteCounts[message.client.voteConfig.peopleStandingIds.length + 1]} people want to abstain`;
						message.client.channels.cache.get(message.client.voteConfig.channelId).send(resultMessage);
						message.client.voteConfig = {
							channelBound: message.client.voteConfig.channelBound,
							channelId: message.client.voteConfig.channelId,
							type: message.client.voteConfig.type,
							role: null,
							voteOpen: false,
							peopleStandingIds: [],
							votes: [],
							voteCounts: [],
							proxyVoters: []
						};
					}
					if (message.client.voteConfig.type === 'closed') {
						resultMessage += `Yes recieved ${message.client.voteConfig.voteCounts[0]}\n`;
						resultMessage += `No recieved ${message.client.voteConfig.voteCounts[1]}\n`;
						resultMessage += `${message.client.voteConfig.voteCounts[2]} people want to abstain`;
						message.client.channels.cache.get(message.client.voteConfig.channelId).send(resultMessage);
						message.client.voteConfig = {
							channelBound: message.client.voteConfig.channelBound,
							channelId: message.client.voteConfig.channelId,
							type: message.client.voteConfig.type,
							role: null,
							voteOpen: false,
							peopleStandingIds: [],
							votes: [],
							voteCounts: [],
							proxyVoters: []
						};
					}
				}

		}
	}
};
