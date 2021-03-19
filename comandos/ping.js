const Discord = require('discord.js');

module.exports = {
	nome: 'ping',
	descricao: 'Devolve sua latência!',
	execute(msg, args) {

		ping = Date.now() - msg.createdTimestamp; 
		pingServidor = Math.round(msg.client.ws.ping);

		const pingEmbed = new Discord.MessageEmbed()
			.setTitle('Pong  🏓')
			.addFields(
				{ name: 'Sua latência:', value: `${ping}ms`},
				{ name: 'Latência do servidor:', value: `${pingServidor}ms`}
			)
			.setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		msg.channel.send(pingEmbed);	

	},
};
