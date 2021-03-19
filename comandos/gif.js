const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	nome: 'gif',
	apelidos: ['tenor'],
	descricao: 'Devolve um gif do Tenor!\nDica: Poste seu gif com a tag __taverna do cubo padrao__',
	uso: '[busca (opcional)]',
	async execute(msg, args) {
		
    let busca = "taverna do cubo padrao";
		let url = `https://api.tenor.com/v1/random?q=${busca}&key=${process.env.TENORKEY}&limit=1&contentfilter=high&locale=pt_BR`;
		let index = 0;
		let titulo = "GIF aleatório da taverna!"
		
    if (args.length){	

			const accents = 'ÀÁÂÃÄÅĄĀāàáâãäåąßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËĘèéêëęðÇçČčĆćÐÌÍÎÏĪìíîïīÙÚÛÜŰùűúûüĽĹŁľĺłÑŇŃňñńŔŕŠŚŞšśşŤťŸÝÿýŽŻŹžżźđĢĞģğ',
			accents_out = "AAAAAAAAaaaaaaaasOOOOOOOOoooooooDdDZdzEEEEEeeeeeeCcCcCcDIIIIIiiiiiUUUUUuuuuuLLLlllNNNnnnRrSSSsssTtYYyyZZZzzzdGGgg",
			accents_map = new Map();
			for (const i in accents)
				accents_map.set(accents.charCodeAt(i), accents_out.charCodeAt(i))

			function removeAccents(str) {
				const nstr = new Array(str.length);
				let x, i;
				for (i = 0; i < nstr.length; i++)
					nstr[i] = accents_map.get(x = str.charCodeAt(i)) || x;
				return String.fromCharCode.apply(null, nstr);
			}
			
			if(args[(args.length)-1] === '1'){
				args.pop();
				index = 0;
			} else {
				index = Math.floor(Math.random() * 20);
			}
			
      busca = removeAccents(args.join(" "));
			url = `https://api.tenor.com/v1/search?q=${busca}&key=${process.env.TENORKEY}&limit=20&contentfilter=high&locale=pt_BR`;
			titulo = `Resultado aleatório para "${busca}"`;
    }

    let response = await fetch(url);
    let json = await response.json();

		let gifEmbed = new Discord.MessageEmbed()

		if(json.results.length){
			gifEmbed.setColor('#f0f0f0');
			gifEmbed.setTitle(titulo);
			gifEmbed.setThumbnail('https://www.gstatic.com/tenor/web/attribution/via_tenor_logo_white.png');
			gifEmbed.setImage(json.results[index].media[0].gif.url);
			gifEmbed.setTimestamp();
			
		} else {		
			url = `https://api.tenor.com/v1/search?q=sad&key=${process.env.TENORKEY}&limit=8&contentfilter=high`;
			response = await fetch(url);
			json = await response.json();

			let index = Math.floor(Math.random() * 8);
			gifEmbed.setColor('#f0f0f0');
			gifEmbed.setTitle(`Não foi encontrado nenhum gif para "${busca}"`);
			gifEmbed.setThumbnail('https://www.gstatic.com/tenor/web/attribution/via_tenor_logo_white.png');
			gifEmbed.setImage(json.results[index].media[0].gif.url);

			url = `https://api.tenor.com/v1/search_suggestions?q=${busca}&key=${process.env.TENORKEY}&limit=3&contentfilter=high&locale=pt_BR`;
			response = await fetch(url);
			json = await response.json();
			if(json.results.length)
				gifEmbed.setFooter(`Tente \"${json.results.join('\" ou \"')}\"`);
		}

		msg.channel.send(gifEmbed);
	},
};
