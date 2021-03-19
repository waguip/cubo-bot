const express = require('express');
const app = express();
const Database = require("@replit/database");
const db = new Database();

app.get('/', (req, res) => {
	const ping = new Date();
	ping.setHours(ping.getHours() - 3);
	console.log(`Ping recebido as ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  res.sendStatus(200);
});

app.listen(process.env.PORT);

const { prefix } = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.comandos = new Discord.Collection();
const arquivosComandos = fs.readdirSync('./comandos').filter(file => file.endsWith('.js'));

for (const arquivo of arquivosComandos) {
	const comando = require(`./comandos/${arquivo}`);
	client.comandos.set(comando.nome, comando);
}

client.on('ready', () => {
  console.log(`Logado como ${client.user.tag}!`);
	client.user.setActivity('!c', { type: 'LISTENING' });
});

client.on('message', msg => { //Sempre q recebe uma mensagem
	if(msg.content === '<@!786997923095248947>') {
		const comando = client.comandos.get('botinfo');
		try {
			comando.execute(msg);
		} catch (error) {
			console.error(error);
			msg.reply(`Erro ao executar o comando "${comando}"`);
		}
	}

  if (!msg.content.startsWith(prefix) || msg.author.bot) return; //Verifica se a msg começa com o prefixo e nao foi enviada por bot
	
	const args = msg.content.slice(prefix.length).trim().split(/ +/);	//argumentos
	const comandoNome = args.shift().toLowerCase();	//nome do comando
	const comando = client.comandos.get(comandoNome)
				|| client.comandos.find(cmd => cmd.apelidos && cmd.apelidos.includes(comandoNome)); //Pega o comando com esse nome ou apelido
	if (!comando) return; //Se nao encontrar o comando, retorna
	
	if (comando.args && !args.length) {

		const argsEmbed = new Discord.MessageEmbed()
		.setTitle(`O comando \`${comando.nome}\` requer argumentos!`)			
		.setFooter(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
		.setTimestamp();

		if (comando.uso) {
			argsEmbed.setDescription(`O uso correto seria: \`${prefix} ${comandoNome} ${comando.uso}\``)
		}
		return msg.channel.send(argsEmbed);

	} else {

		try {
			comando.execute(msg, args, db);
		} catch (error) {
			console.error(error);
			msg.reply(`Erro ao executar o comando "${comando}"`);
		}

	}
});

client.login(process.env.TOKEN);