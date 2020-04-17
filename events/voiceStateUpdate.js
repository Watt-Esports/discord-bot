module.exports = async (client, oldState, newState) => {
	const stackVCIDs = client.config.stackVCIDs;

	// To increase stack names when over filled
	if (newState.voiceChannelID in stackVCIDs) {
		const intendedStackSize = stackVCIDs[newState.voiceChannelID];

		if (newState.voiceChannel.members.size > intendedStackSize) {
			await newState.voiceChannel.setUserLimit(newState.voiceChannel.members.size);
			await newState.voiceChannel.setName(`${newState.voiceChannel.members.size} Stack`);
		}
	}

	// To decrease stack names when under filled
	if (oldState.voiceChannelID in stackVCIDs) {
		const intendedStackSize = stackVCIDs[oldState.voiceChannelID];

		if (oldState.voiceChannel.members.size + 1 > intendedStackSize) {
			// +1 because oldState only has the new members left in the channel (not counting the user that just left)
			await oldState.voiceChannel.setUserLimit(oldState.voiceChannel.members.size);
			await oldState.voiceChannel.setName(`${oldState.voiceChannel.members.size} Stack`);
		}
	}
};
