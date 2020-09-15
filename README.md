# Watt Esports Discord Bot

### The bot for the Heriot Watt Esports society discord server.

## Implementation Details

### Command Handler

**NOTE** - This is only used in the `message` event of discord.js. If adding functionality to another event, or without the prefix, please look at [event handler](#event-handler).

This handles all commands that prefixed with the defined prefix in your `config.json` file.

To add a new command, follow these steps: 

1. Create a new file under the `commands` directory (Descriptive names are the best!)
2. Add the following in the file and edit accordingly :
```
module.exports = {
	name: 'The triggerword of the command',
	description: 'Short description of what the command does',
	guildOnly : true, // Boolean, is not necessary depending on the command
	modOnly: true, // Boolean, defines if only mods can use the command, is not necessary
	usage: 'example usage of the command using <> to show variables',
	execute(message, args) {
		// code goes here
	},
```


### Event Handler
Each discord.js event has been split into it's own file

To add a new event, create a file in the `/events/` directory, and this **HAS** to be named the exact same as as discord.js event, passing on the correct arguments ([Docs here](https://discord.js.org/#/docs/main/stable/class/Client))

**NOTE** The first argument regardless of event will **ALWAYS** be `Client`

If the event already exists, you can do into the corresponding file and add the functionality into that file.

## Branch Naming Convention

`feat/featureName` - New features  
`fix/fixName` - Bug fixes  
`refactor/refactorName` - Refactoring code  
`dep/dependancyName` - Dependancy Work  

## config.json example

```
{
	{
	"token": "Bot Token here",
	"prefix": "Desired prefix",
	"inviteLink": "Permanent discord invite link",
	"channelIDs": {
		"adminLogging": "Relevant ID",
		"welcome": "Relevant ID",
		"botSpam": "Relevant ID",
		"moderation": "Relevant ID",
		"suggestions": "Relevant ID",
	},
	"guildID": "Relevant ID",
	"roleIDs": {
		"games": "Relevant ID",
		"admin": "Relevant ID",
		"comLead": "Relevant ID",
		"discOfficer": "Relevant ID",
		"misc": "Relevant ID",
		"socMember": "Relevant ID",
		"muted": "Relevant ID"
	}
}
```

*If you want to help with the development of this, message Nightwing#2603 on discord*