module.exports = (client) => {
	client.user.setPresence({
		game: {
			name: 'you.',
			type: 'WATCHING'
		}
	});
	console.log('Ready to serve!');
};
