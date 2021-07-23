export const validarDados = obj => {
	var tamData = 0;
	var verifica = 0;
	/*Percorre o objeto data e verifica todos os seus campos, obtendo o tamanho do objeto
    * e incrementando o contador de verificações se o campo for preenchido
    */
	for (var props in obj) {
		if (obj.hasOwnProperty(props)) {
			tamData++;
		}
		if (obj[props] !== '') {
			verifica++;
		}
	}
	if (verifica !== tamData) {
		return false; //Faltam itens
	}
	else {
		return true; //Todos os itens preenchidos
	}
}
//Validar um telefone
export const validarTelefone = telefone => {
	let tel = telefone.replace(/[^\d]+/g, '');
	if (tel.length < 10) return false; //Se o telefone tiver menos de 9 digitos
	else if (/^(\d)\1+$/.test(tel)) return false;
	else {
		let ddd = tel.substring(0,2); //Pega o DDD
		let regexDDD = new RegExp('^((1[1-9])|([2-9][0-9]))$'); //Regex para verificar se o DDD está entre 11 e 99
		if(!regexDDD.test(ddd)){
			return false;
		}
		else{
			return true;
		}
	}
}

export const validarCPF = cpf => {
	// Elimina CPFs invalidos conhecidos	
	if (/^(\d)\1+$/.test(cpf)) return false;
	// Valida 1o digito	
	let add = 0;
	for (let i = 0; i < 9; i++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
	let rev = 11 - (add % 11);
	if (rev === 10 || rev === 11)
		rev = 0;
	if (rev !== parseInt(cpf.charAt(9)))
		return false;
	// Valida 2o digito	
	add = 0;
	for (let i = 0; i < 10; i++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev === 10 || rev === 11)
		rev = 0;
	if (rev !== parseInt(cpf.charAt(10)))
		return false;
	return true;
}

export const validarCNPJ = cnpj => {
	// Elimina CNPJs invalidos conhecidos
	// Elimina inválidos com todos os caracteres iguais
	if (/^(\d)\1+$/.test(cnpj)) return false;
	// Cáculo de validação
	let t = cnpj.length - 2;
	let d = cnpj.substring(t);
	let d1 = parseInt(d.charAt(0));
	let d2 = parseInt(d.charAt(1));
	let calc = x => {
		let n = cnpj.substring(0, x);
		let y = x - 7;
		let s = 0;
		let r = 0;
		for (let i = x; i >= 1; i--) {
			s += n.charAt(x - i) * y--;
			if (y < 2)
				y = 9
		}

		r = 11 - s % 11
		return r > 9 ? 0 : r
	}

	return calc(t) === d1 && calc(t + 1) === d2
}