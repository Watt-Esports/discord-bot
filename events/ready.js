module.exports = (client) => {
	const {channelIDs, guildID, messageIDs} = client.config;
	const guildObj = client.guilds.cache.get(guildID);
	const welcomeChannel = guildObj.channels.cache.get(channelIDs.welcome);
	const getRoleChannel = guildObj.channels.cache.get(channelIDs.getRole);

	client.user.setPresence({
		game: {
			name: 'you.',
			type: 'WATCHING'
		}
	});
	// Without this first reaction add and remove to the message doesn't register, whcih doesn't trigger giving roles
	console.log('Initialising all reaction messages...');

	welcomeChannel.messages.fetch(messageIDs.memberToggle)
		.then(() => {
			console.log('Member Toggle Initialised!');
			getRoleChannel.messages.fetch(messageIDs.strategyReact);
		}).then(() => {
			console.log('Stratgey Reacts Initialised!');
			getRoleChannel.messages.fetch(messageIDs.shooterReact);
		}).then(() => {
			console.log('Shooters React Initialised!');
			getRoleChannel.messages.fetch(messageIDs.mobaReact);
		}).then(() => {
			console.log('MOBA Reacts Initialised!');
			getRoleChannel.messages.fetch(messageIDs.arcadeReact);
		}).then(() => {
			console.log('Arcade Reacts Initialised!');
			getRoleChannel.messages.fetch(messageIDs.miscReact);
		}).then(() => {
			console.log('Misc Roles Initialised!');
			getRoleChannel.messages.fetch(messageIDs.lfgToggle);
		}).then(() => {
			console.log('LFG Toggle Initialised!');
			console.log('All reaction messages initialised!');
			console.log('Ready to serve!');
		});
};
