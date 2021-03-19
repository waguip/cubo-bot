const Discord = require('discord.js');

module.exports = {
	nome: 'serverinfo',
	apelidos: ['infoserver'],
	descricao: 'Informações sobre o servidor',
	execute(msg) {

		const {name, createdAt, memberCount, owner} = msg.guild;

		let tempoCriacao = Date.now() - msg.guild.createdTimestamp;	
		let anosCriacao = tempoCriacao/31536000000;
		let mesesCriacao = (tempoCriacao%31536000000)/2628000000;
		let diasCriacao = ((tempoCriacao%31536000000)%2628000000)/86400000;

		const infoEmbed = new Discord.MessageEmbed()
			.setTitle(`A taverna do cubo padrão é o espaço onde artistas e entusiastas de 3D e 2D se reunem! 🍻 `)
			.setDescription('**Sinta-se à vontade para:** \nAjudar ou tirar suas dúvidas em <#765939761214783525>\nPostar seus wips em <#766049734287687691>\nPostar suas artes finalizadas em <#765939761214783524> ou <#765940415886524416>\nJogar conversa fora no <#765939761214783523>\n**Explorar todos os cantos e ver tudo o que temos a oferecer!**\n\n**Informações adicionais:**')	
			.setThumbnail(msg.guild.iconURL())
			.addFields(
				{ name: 'Fundada há:', value: `${Math.floor(anosCriacao)>0?`${Math.floor(anosCriacao)}ano(s)` : ''} ${Math.floor(mesesCriacao)} mes(es) e ${Math.floor(diasCriacao)} dia(s)`, inline: true},
				{ name: '\u200B', value: '\u200B', inline: true},
				{ name: 'Quant. de fregueses:', value: memberCount, inline: true},
				{ name: 'Twitter:', value: '[@BardoCubo](https://twitter.com/BardoCubo)', inline: true},
				{ name: '\u200B', value: '\u200B', inline: true},
				{ name: 'Telegram:', value: '[Bar do Cubo](https://t.me/joinchat/G5WP7Ik2l2jiCala)', inline: true}
			)	
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
