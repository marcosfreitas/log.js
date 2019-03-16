/*!
 * Trabalha alguns fatores do acesso do usuario, como local e session storage, cookie
 * v 1.0
 * - requere 'jquery.cookie.js' (v1.4.0), 'jquery.storageapi.min.js'
 * - este modelo tem capacidade de repassar parâmetros a partir da instância do plugin para os métodos ou eventos
 */

;(function($) {
	'use strict'; // ecma script 5

	$.Log = function (nome_funcao, opcoes) {

		// objetos padrões
		var padrao = {},

		// mesclando opções aos valores padrão
		config = $.extend({}, padrao, opcoes),

		metodos = {

			init : function () {
				console.log('nothing to do in \'init()\'.');
			},

			// usa sessão o plugin 'storage api' para armazenar os dados do usuário
			// tipo varia entre 'cookie', 'local' e 'session' storage
			// para cookies o nome do cookie é o nome repassado
			// tempo cookie é definido em dias
			set_log : function (nome, dados, delimitador, tipo, tempo) {

				var tempo_cookie = (typeof tempo !== 'undefined') ? tempo : false,
					storage;

				switch (tipo) {
					case 'cookie':
						storage = $.cookieStorage;
						break;
					case 'local':
						storage = $.localStorage;
						break;
					case 'session':
						storage = $.sessionStorage;
						break;
					default:
						storage = $.cookieStorage;
				
				}				// define se tem separador mesmo
				var separador = (delimitador !== '') ? delimitador : '';

				if (storage.isSet(nome) && !storage.isEmpty(nome)) {
					dados  = storage.get(nome) + separador + dados;
				}
				
				if (tempo_cookie !== false && storage._type === 'cookieStorage') {
					storage.setExpires(tempo_cookie);
				}

				storage.set(nome, dados);

				return storage.isSet(nome);

			},

			get_log : function (nome, tipo) {

				var storage;
				
				if (tipo === 'session') {
					storage = $.sessionStorage;
				} else if (tipo === 'local') {
					storage = $.localStorage;
				} else {
					storage = $.cookieStorage;
				}

				if (storage.isSet(nome) && !storage.isEmpty(nome)) {
					return storage.get(nome);
				} 

				return false;

			},

			// deleta um item do storage definido ou todos
			// para deletar todos é só passar o nome como null
			delete_log : function (nome, tipo) {

				var storage;
				
				if (tipo === 'session') {
					storage = $.sessionStorage;
				} else if (tipo === 'local') {
					storage = $.localStorage;
				} else {
					storage = $.cookieStorage;
				}

				// se não existir o log
				if (!storage.isSet(nome)) {
					return false;
				}

				if (nome !== null) {
					storage.remove(nome);
				} else {
					storage.removeAll();
				}

				// verifica se existe
				if (!storage.isSet(nome)) {
					return true;
				} 

				return false;
			
			}
		},

		eventos = {

			// quando o broser fechar
			on_browser_close : function () {

			}
		};

		var array_argumentos = Array();

		if (typeof opcoes !== 'undefined') {

	    	try{
				// Array.prototype.slice não funciona até o IE 8 e no chrome 14
		        // http://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work
		        // se não for um array ele vai separar a string em letras
		        // para passar corretamente parâmetros para os métodos ou funçõesé preciso que opções seja um array,
		        // ou um array-like (um objeto com índices numéricos e uma propriedade 'length')
		        // repassa todos os elementos do array, mas depende de quantos a função está esperando receber
		        array_argumentos = Array.prototype.slice.call(opcoes, 0);

		    } catch(err){

		        // lento mas funciona no IE
		        	array_argumentos = [];
		        var length = opcoes.length;

		        for(var o=0; o < length; o++){
		            array_argumentos.push(opcoes[o]);
		        }
		    }
		}

		// as funções dos objetos de métodos e eventos podem ser retornadas com metodo['nome_metodo'] por exemplo
		if ( metodos[nome_funcao] ) {
			// O método apply() chama uma função com um dado valor this e arguments providos como array (ou um objeto array-like ).
			return metodos[nome_funcao].apply( this, array_argumentos);
	    }
	    else if ( eventos[nome_funcao] ) {
	    	return eventos[nome_funcao].apply( this, array_argumentos);
	    }
	    // não achou nenhum método e evento com o nome daquela função
	    // chama o método init passando opcoes se for um objeto
	    else if ( typeof opcoes === 'object' ) {
	    	return metodos.init.apply( this, opcoes );
	    }
	    // chama o método init passando o objeto jquery seletor ou não
	    else if ( typeof nome_funcao === 'undefined' && typeof opcoes === 'undefined' ) {
	    	return metodos.init();
	    	// somente se a função do plugin for do do tipo $.fn 
	    	// return metodos.init(this);
	    }
	    else {
	    	$.error( 'O Metodo ou Evento "' +  nome_funcao + '" nao existe em log.min.js' );
	    }

	};

})(jQuery);
