const {readdirSync, readdir} = require('fs');
const {Client, Collection} = require('discord.js');
const client = new Client();

client.config = require('./config.json');
client.voteConfig = {
	channelBound: false,
	channelId: null,
	role: null,
	voteOpen: false,
	peopleStandingIds: [],
	votes: []
};

// No empty return either and return breaks function
// eslint-disable-next-line consistent-return
readdir('./events/', (err, files) => {
	if (err) {
		return console.error(err);
	}

	files.forEach(file => {
		const event = require(`./events/${file}`);
		const eventName = file.split('.')[0];

		client.on(eventName, event.bind(null, client));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});

client.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.login(client.config.token);
