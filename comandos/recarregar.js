module.exports = {
	nome: 'recarregar',
  apelidos: ['rec', 'reload'],
	descricao: 'Recarrega um comando',
	args: true,
	uso: '[comando]',
	execute(msg, args) {

    if (!args.length) return msg.channel.send(`Você não passou nenhum comando para ser recarregado, ${msg.author}!`);
    const comandoNome = args[0].toLowerCase();
    const comando = msg.client.comandos.get(comandoNome)
    	|| msg.client.comandos.find(cmd => cmd.apelidos && cmd.apelidos.includes(comandoNome));

    if (!comando) return msg.channel.send(`Não há nenhum comando com o nome \`${comandoNome}\`, ${msg.author}!`);

    delete require.cache[require.resolve(`./${comando.nome}.js`)];

    try {
    	const novoComando = require(`./${comando.nome}.js`);
    	msg.client.comandos.set(novoComando.nome, novoComando);
      msg.channel.send(`O comando \`${comando.nome}\` foi recarregado!`);
    } catch (error) {
    	console.error(error);
    	msg.channel.send(`Erro ao recarregar o comando \`${comando.nome}\`!`);
    }

	},
};
