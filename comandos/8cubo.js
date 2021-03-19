const Discord = require('discord.js');

module.exports = {
	nome: '8cubo',
	apelidos: ['8ball', 'responda'],
	descricao: '8ball só que cubo (respostas de sim ou não)',
	uso: '[pergunta]',
	async execute(msg, args) {

		const respostas = [
			"É certo",
			"Definitivamente",
			"Sem dúvidas",
			"Sim, com certeza",
			"Pode contar com isso",
			"Sim",
			"Provavelmente sim",

			"Não",
			"Com certeza não",
			"Nem pensar",
			"Provavelmente não",
			"Não conte com isso",
			"Definitivamente não",
		];

		const indexAleatorio = Math.floor(Math.random() * respostas.length);

		const respostaEmbed = new Discord.MessageEmbed()
			.setTitle(`O cubo diz:`)
			.setDescription(`${respostas[indexAleatorio]}!`)
			.setFooter(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		msg.channel.send(respostaEmbed);
	}
};