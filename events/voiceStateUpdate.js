module.exports = async (client, oldState, newState) => {

	const {channelIDs, stackVCIDs} = client.config;
	const vcSpam = client.channels.get(channelIDs['vcSpam']);

	// if (client.settings.autoStackResizer) {
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
	// }

	// if (client.settings.vcSpamToggle) {
	// Give read perms on vcSpam when someone joins
	if (!oldState.voiceChannelID) {
		vcSpam.overwritePermissions(oldState.user, {VIEW_CHANNEL: true});
	}
	// Remove read perms on vcSpam when someone leaves, note: this will completely remove that users overwrite perms
	if (!newState.voiceChannelID) {
		vcSpam.permissionOverwrites.get(newState.user.id).delete();
	}

	// }
};
