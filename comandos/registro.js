const Discord = require('discord.js');

module.exports = {
	nome: 'registro',
	apelidos: ['registrar', 'db'],
	descricao: 'Registre seu perfil!',
	async execute(msg, args, db) {
		
		var redesNomes = ['Twitter', 'Instagram', 'Artstation'], registroEmbed, redes, embedEnviado;

		let filter = m => {
			return m.author.id == msg.author.id; 
		}		

		await db.get(msg.author.id).then(value => {
			if(value){
				redes = value;
			} else {
				redes = [null, null, null];
			}
		});

		async function criarEmbed(redeNome) {
			cadastroEmbed = new Discord.MessageEmbed()
				.setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
				.setTitle(`Registrando \`${redeNome}\` de ${msg.author.username}`)
				.setDescription(`Digite o \`user\` para registrar, \`pular\` para deixar como está ou \`apagar\` para apagar`)
				.addFields(
					{ name: 'twitter', value: redes[0]? redes[0] : 'indefinido', inline: true },
					{ name: 'instagram', value: redes[1]? redes[1] : 'indefinido', inline: true },
					{ name: 'artstation', value: redes[2]? redes[2] : 'indefinido', inline: true }
				)
				.setFooter(msg.client.user.username, msg.client.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();
		}

		var i=0;
			
		for(var i=0; i<(redesNomes.length); i+=1) {
			await criarEmbed(redesNomes[i]);
			if(i===0)
				await msg.channel.send(cadastroEmbed).then((enviado) => espera(enviado));
			else 
				await embedEnviado.edit(cadastroEmbed).then((enviado) => espera(enviado));
		}

		async function espera(enviado) {
			await	msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				if(collected.first().content.toLowerCase() === 'pular') return i;
				else if(collected.first().content.toLowerCase() === 'apagar') return redes[i] = null;
				else return redes[i] = collected.first().content.toLowerCase();
			})
			.catch(collected => {
				return i;
			});
			embedEnviado = enviado;
		}			

		db.set(msg.author.id, redes).then(() => {
			embedEnviado.delete();
			const registroEmbed = new Discord.MessageEmbed()
				.setTitle('Dados salvos com sucesso!')
				.setDescription('Digite \`!c perfil\` para visualizar')
				.setFooter(msg.client.user.username, msg.client.user.displayAvatarURL({ dynamic: true }))
				.setTimestamp();

			msg.channel.send(registroEmbed);
		});
	},
};
