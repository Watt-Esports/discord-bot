const {voiceStateUpdate, toggleVCSpam} = require('../utils/commandToggles.json');

module.exports = async (client, oldMemberState, newMemberState) => {
	const {channelIDs, stackVCIDs} = client.config;

	if (voiceStateUpdate) {
		// To increase stack names when over filled
		if (newMemberState.voiceChannelID in stackVCIDs) {
			const intendedStackSize = stackVCIDs[newMemberState.voiceChannelID];

			if (newMemberState.voiceChannel.members.size > intendedStackSize) {
				await newMemberState.voiceChannel.setUserLimit(newMemberState.voiceChannel.members.size);
				await newMemberState.voiceChannel.setName(`${newMemberState.voiceChannel.members.size} Stack`);
			}
		}

		// To decrease stack names when under filled
		if (oldMemberState.voiceChannelID in stackVCIDs) {
			const intendedStackSize = stackVCIDs[oldMemberState.voiceChannelID];

			if (oldMemberState.voiceChannel.members.size + 1 > intendedStackSize) {
				// +1 because oldMemberState only has the new members left in the channel (not counting the user that just left)
				await oldMemberState.voiceChannel.setUserLimit(oldMemberState.voiceChannel.members.size);
				await oldMemberState.voiceChannel.setName(`${oldMemberState.voiceChannel.members.size} Stack`);
			}
		}
	}

	if (toggleVCSpam) {
		const vcSpam = client.channels.get(channelIDs['vcSpam']);

		// Give read perms on vcSpam when someone joins
		if (!oldMemberState.voiceChannelID) {
			vcSpam.overwritePermissions(oldMemberState.user, {VIEW_CHANNEL: true});
		}
		// Remove read perms on vcSpam when someone leaves, note: this will completely remove that users overwrite perms
		if (!newMemberState.voiceChannelID) {
			vcSpam.permissionOverwrites.get(newMemberState.user.id).delete();
		}

	}
};
