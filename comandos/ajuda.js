const { prefix } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	nome: 'ajuda',
	apelidos: ['help', 'comandos'],
	descricao: 'Lista de todos os comandos ou informações de um específico.',
	uso: '[comando]',
	execute(msg, args) {

		const { comandos } = msg.client;
		const infoEmbed = new Discord.MessageEmbed();

		if (!args.length) {

			infoEmbed.setTitle('Aqui está uma lista de todos meus comandos!');
			infoEmbed.setDescription(`\`${comandos.map(comando => comando.nome).join('\`, \`')}\`
      													\n**Envie \`${prefix} ajuda [comando]\` para receber informações sobre um específico!**`);

		} else {

			const nome = args[0].toLowerCase();
			const comando = comandos.get(nome) || comandos.find(c => c.apelidos && c.apelidos.includes(nome));

			if (!comando) return msg.channel.send(`Não há nenhum comando com o nome \`${nome}\`, ${msg.author}!`);

			infoEmbed.setTitle(`Informações de \`${prefix} ${comando.nome}\`!`);
			if (comando.descricao) infoEmbed.addField('Descrição:', comando.descricao);
			if (comando.apelidos) infoEmbed.addField('Apelidos:', `\`${comando.apelidos.join('\`, \`')}\``);
			if (comando.uso) infoEmbed.addField('Uso:', `\`${prefix} ${comando.nome} ${comando.uso}\``);
		}

		msg.reply(infoEmbed);

	},
};
