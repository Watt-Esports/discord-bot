const getDiscordId = (user) => {
	return `${user.username}#${user.discriminator}`;
};

module.exports = {getDiscordId};
