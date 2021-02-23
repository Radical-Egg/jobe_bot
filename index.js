const Discord = require("discord.js");
const config = require("./config.json");
const { exec } = require('child_process');

const client = new Discord.Client();

try {
	client.login(config.BOT_TOKEN);
	console.log("You have logged in successfully");
} catch(err) {
	console.log(err);
}



const prefix = "!";

client.on("message", function(message) {
	if (message.author.bot) return;
	if(!message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(' ');
	const command = args.shift().toLowerCase();

	switch(command) {
		case "restart":
			exec("sudo systemctl restart valheimserver.service", (err, stdout, stderr) => {
				if (err) {
					const errorRestart = new Discord.MessageEmbed()
						.setColor("#FF4500")
						.setTitle("Valheim Restart")
						.setDescription("Error restarting valheim server");
					message.reply(errorRestart);
				}
				else {
					console.log(stdout);
					const restartEmbed = new Discord.MessageEmbed()
						.setColor("#3CB371")
						.setTitle("Valheim Restart")
						.setDescription("Server has been restarted");
					message.reply(restartEmbed);
				}

				if (stderr){
					console.log(stderr);
				}

			});
			break;
		case "status":
			exec("systemctl status valheimserver.service | egrep Active | sed 's/^[[:space:]]*//'", (err, stdout, stderr) => {
				if (err) {
					console.log(err);
				} else {
					let output = stdout;
					let stat = output.split(" ")[1];
					
					switch (stat) {
						case "active":
							// these embeds could 100% be turned into a function but im good for now
							const upEmbed = new Discord.MessageEmbed()
								.setColor("#3CB371")
								.setTitle("Valheim Server Status")
								.setDescription("Server is up!")
								.attachFiles(['./serverUp.gif'])
								.setImage("attachment://serverUp.gif");
							message.reply(upEmbed);
							break;
						case "inactive":
							const downEmbed = new Discord.MessageEmbed()
								.setColor("#FF4500")
								.setTitle("Valheim Server Status")
								.setDescription("Server is inactive - try restarting!");
							message.reply(downEmbed);
							break;
						default:
							const unknownEmbed = new Discord.MessageEmbed()
								.setColor("#FF4500")
								.setTitle("Valheim Server Status")
								.setDescription("Server is in an unknown or failed state");
							message.reply(unknownEmbed);
							console.log(stat);
							break;
					}
				}
			});
			break;
		default:
			message.reply("I have no idea what that means");
			break;
	}
});
