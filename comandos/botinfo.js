const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
	nome: 'botinfo',
	apelidos: ['infobot'],
	descricao: 'Informações sobre o bot',
	execute(msg) {

		const infoEmbed = new Discord.MessageEmbed()
		.setTitle(`Minhas informações! 🤖`)
		.setDescription('Olá! eu sou o robô da taverna, meu objetivo é ajudar e entreter os clientes.\nSe tiver reclamações ou sugestões fale para meu criador: <@224200822299295744>\nPara ver todos meus comandos digite \`!c ajuda\`')
		.addField('**Estou online a**', moment().to(msg.client.startTime, true), true)
    .addField('**Criado em**', formatDate('DD/MM/YYYY, às HH:mm:ss', msg.client.user.createdAt), true)
		.setFooter(msg.client.user.username, msg.client.user.displayAvatarURL({ dynamic: true }))
		.setTimestamp();

		msg.reply(infoEmbed);
	},
};

function formatDate (template, date) {
  var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':')
  date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4)
  return date.toISOString().split(/[-:.TZ]/).reduce(function (template, item, i) {
    return template.split(specs[i]).join(item)
  }, template)
}
