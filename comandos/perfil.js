const Discord = require('discord.js');

module.exports = {
	nome: 'perfil',
	apelidos: ['user'],
	descricao: 'Veja seu perfil ou o de outra pessoa',
	uso: 'ou !c perfil [usuário]',
	async execute(msg, args, db) {
		
		var user, redes, redesTexto = '';

		if (args[0]) {
			user = getUserFromMention(args[0]);
			if (!user) {
				return msg.reply('Usuario invalido!');
			}
		} else {
			user = msg.author;
		}

		function getUserFromMention(mention) {
			if (!mention) return;
			if (mention.startsWith('<@') && mention.endsWith('>')) {
				mention = mention.slice(2, -1);
				if (mention.startsWith('!')) {
					mention = mention.slice(1);
				}
				return msg.client.users.cache.get(mention);
			}
		}

		await db.get(user.id).then(value => {redes = value});

		if(redes) {
			if(redes[0]) redesTexto += `Twitter: [@${redes[0]}](https://twitter.com/${redes[0]})\n`;
			if(redes[1]) redesTexto += `Instagram: [${redes[1]}](https://artstation.com/${redes[1]})\n`;
			if(redes[2]) redesTexto += `Artstation: [${redes[2]}](https://artstation.com/${redes[2]})\n`;
		} else {
			redesTexto = `${user.username} ainda não registrou nenhuma rede. \nPara registra-las use o comando \`!c registro\`!`;
		}

		let tempoCriacao = Date.now() - user.createdTimestamp;	
		let anosCriacao = tempoCriacao/31536000000;
		let mesesCriacao = (tempoCriacao%31536000000)/2628000000;
		let diasCriacao = ((tempoCriacao%31536000000)%2628000000)/86400000;

		let tempoEntrada = Date.now() - msg.guild.members.cache.get(user.id).joinedTimestamp;
		let anosEntrada = tempoEntrada/31536000000;
		let mesesEntrada = (tempoEntrada%31536000000)/2628000000;
		let diasEntrada = ((tempoEntrada%31536000000)%2628000000)/86400000;

		let perfilEmbed = new Discord.MessageEmbed()
			.setThumbnail(user.displayAvatarURL({ dynamic: true }))
			.setTitle(`Perfil de ${user.username}:`)
			.addFields(
				{ name: 'Geral:', value: `Discord: <@${user.id}>\nConta criada há: ${Math.floor(anosCriacao)} ano(s), ${Math.floor(mesesCriacao)} mes(es) e ${Math.floor(diasCriacao)} dia(s)\nEntrou no server há: ${Math.floor(anosEntrada)} ano(s), ${Math.floor(mesesEntrada)} mes(es) e ${Math.floor(diasEntrada)} dia(s)`},
				{ name: 'Redes sociais e portfólios:', value: redesTexto}
			)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		msg.channel.send(perfilEmbed);
	},
};
