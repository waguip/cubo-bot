const fetch = require('node-fetch');
const Discord = require('discord.js');
const Canvas = require('canvas');

module.exports = {
	nome: 'textura',
	apelidos: ['tex', 'texture'],
	descricao: 'Devolve texturas do CC0 textures',
	args: true,
	uso: '[busca] [nº da página (opcional)]',
	async execute(msg, args) {

		var texturas = [], offset=0, enviado, textoEmbed="";

		if(!isNaN(args[args.length-1])) {
			offset = parseInt(args[args.length-1], 10)-1;
			args.pop();
		}
		busca = args.join("+");

		const carregandoEmbed = new Discord.MessageEmbed()
			.setTitle(`Buscando "${busca}" no cc0textures.com...`)
			.setDescription('Por favor aguarde um pouco!')
			.setFooter(msg.client.user.username, msg.client.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		msg.channel.send(carregandoEmbed).then(msg => enviado = msg);

    let url = `https://cc0textures.com/api/v1/full_json?category=&date=&q=${busca}&method=&type=&sort=Popular&limit=6&offset=${offset*6}`;
    let response = await fetch(url);
    let json = await response.json();

		const canvas = Canvas.createCanvas(600, 400);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		var i = 0, j = 0;
		for (material in json.Assets) {
			texturas[i] = material;
			let urlImagem = `https://cdn3.struffelproductions.com/file/CC0-Textures/media/sphere/1024-JPG-FFFFFF/${material}_PREVIEW.jpg`;
			var imagemTextura = await Canvas.loadImage(urlImagem);

			if(i<3) y=0;
			else y=200;	

			if(j>2) j=0;

			ctx.drawImage(imagemTextura, 0+(j*200), y, 200, 200);

			i++; j++;			
		}

		if(i==0 && j==0) {
			const background = await Canvas.loadImage('./texturaNaoEncontrada.png');
			ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
			textoEmbed = `Nenhuma textura com o nome \`${busca}\` foi encontrada!`;
		} else if (i==6) {
			textoEmbed = `Página ${offset+1}\n\nDigite \`!c tex ${busca} ${offset+2}\` para ver a próxima!`;
		}

		enviado.delete();		

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'texturas.png');
		const materiaisEmbed = new Discord.MessageEmbed()
			.attachFiles(attachment)
			.setThumbnail('https://cdn3.struffelproductions.com/file/CC0-Textures/media/meta-logo.jpg')
			.setTitle(`Resultado da busca por "${busca}":`)
			.setDescription(textoEmbed)
			.setURL(`https://cc0textures.com/list?q=${busca}`)
			.setImage('attachment://texturas.png')
			.setTimestamp()
			.setFooter('Texturas de cc0textures.com');
		msg.channel.send(materiaisEmbed).then(enviado => reagir(enviado));
		
		const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
		async function reagir (enviado){
			for(var i = 0; i<texturas.length; i++) {
				await enviado.react(emojis[i]);
			}
			aguardarReacao(enviado);
		}

		const filter = (reaction, user) => {
			return user.id === msg.author.id;
		};

		async function aguardarReacao(enviado){
			enviado.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					const reacao = collected.first().emoji.name;
					mostrarTextura(reacao, enviado);
				})
				.catch(collected => {	
					enviado.reactions.removeAll();
				});
		}

		function mostrarTextura(reacao, enviado) {
			enviado.delete();
			let index = emojis.findIndex(elemento => elemento === reacao);
			let texNome = texturas[index];

			const materialEmbed = new Discord.MessageEmbed()
				.setTitle(`Infos de ${texNome}`)
				.setImage(`https://cdn3.struffelproductions.com/file/CC0-Textures/media/sphere/1024-JPG-FFFFFF/${texNome}_PREVIEW.jpg`)
				.setDescription(`
					**Tags:** ${(json.Assets[texNome].Tags).replace(/,/g,', ')}
					**Tipo de asset:** ${json.Assets[texNome].AssetDataTypeID}
					**Método de criação:** ${json.Assets[texNome].CreationMethodID}
					**Data de lançamento:** ${json.Assets[texNome].AssetReleasedate}
					**Quantidade de downloads:** ${json.Assets[texNome].DownloadCount}
				`)	
				.setTimestamp()
				.setFooter('Texturas de cc0textures.com')
				.setURL(json.Assets[texNome].Weblink);

			let jpgs=[], pngs=[];
			for (link in json.Assets[texNome].Downloads) {
				if(link.match(/JPG/)) {
					jpgs.push(`[${link.replace('-JPG','')} (${(parseFloat(json.Assets[texNome].Downloads[link].Size)*0.000001).toFixed(1)} MB)](${json.Assets[texNome].Downloads[link].PrettyDownloadLink})`);
				} else if (link.match(/PNG/)) {
					pngs.push(`[${link.replace('-PNG','')} (${(parseFloat(json.Assets[texNome].Downloads[link].Size)*0.000001).toFixed(1)} MB)](${json.Assets[texNome].Downloads[link].PrettyDownloadLink})`);
				}
			}

			materialEmbed.addField("PNG's:", jpgs.join('\n'), true);
			materialEmbed.addField("JPG's:", pngs.join('\n'), true);

			msg.channel.send(materialEmbed);
		}
	},
};
