module.exports = (client) => {
	const {channelIDs, guildID, messageIDs} = client.config;
	const guildObj = client.guilds.get(guildID);
	const welcomeChannel = guildObj.channels.get(channelIDs.welcome);
	const getRoleChannel = guildObj.channels.get(channelIDs.getRole);

	client.user.setPresence({
		game: {
			name: 'you.',
			type: 'WATCHING'
		}
	});
	// Without this first reaction add and remove to the message doesn't register, whcih doesn't trigger giving roles
	console.log('Initialising all reaction messages...');

	welcomeChannel.fetchMessage(messageIDs.memberToggle)
		.then(() => {
			console.log('Member Toggle Initialised!');
			getRoleChannel.fetchMessage(messageIDs.strategyReact);
		}).then(() => {
			console.log('Stratgey Reacts Initialised!');
			getRoleChannel.fetchMessage(messageIDs.shooterReact);
		}).then(() => {
			console.log('Shooters React Initialised!');
			getRoleChannel.fetchMessage(messageIDs.mobaReact);
		}).then(() => {
			console.log('MOBA Reacts Initialised!');
			getRoleChannel.fetchMessage(messageIDs.arcadeReact);
		}).then(() => {
			console.log('Arcade Reacts Initialised!');
			getRoleChannel.fetchMessage(messageIDs.miscReact);
		}).then(() => {
			console.log('Misc Roles Initialised!');
			getRoleChannel.fetchMessage(messageIDs.lfgToggle);
		}).then(() => {
			console.log('LFG Toggle Initialised!');
			console.log('All reaction messages initialised!');
			console.log('Ready to serve!');
		});
};
