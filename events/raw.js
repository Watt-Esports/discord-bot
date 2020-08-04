const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};
const {raw} = require('../utils/commandToggles.json');

module.exports = async (client, event) => {
	if (raw) {
		// eslint-disable-next-line no-prototype-builtins
		if (!events.hasOwnProperty(event.t)) return;
		const {d: data} = event;
		const user = client.users.cache.get(data.user_id);
		const channel = client.channels.cache.get(data.channel_id) || await user.createDM();
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		const message = await channel.messages.fetch(data.message_id);
		const reaction = message.reactions.cache.get(emojiKey);

		if (channel.messages.cache.has(data.message_id)) return;

		client.emit(events[event.t], reaction, user);
	}
};
