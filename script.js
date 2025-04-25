document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script iniciado.");

    // --- Seleção dos Elementos ---
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadoDiv = document.getElementById('resultado');
    const imcValorP = document.getElementById('imcValor');
    // Mudança: ID para interpretação/classificação
    const imcInterpretacaoP = document.getElementById('imcInterpretacao');
    const infoAdicionalP = document.getElementById('infoAdicional'); // Novo P para infos extras
    const erroDiv = document.getElementById('erro');
    const erroMensagemP = erroDiv.querySelector('p'); // Seleciona o P dentro da div de erro

    // Novos elementos para tipo, idade e sexo
    const tipoUsuarioRadios = document.querySelectorAll('input[name="tipoUsuario"]');
    const infoCriancaDiv = document.getElementById('infoCrianca');
    const idadeInput = document.getElementById('idade');
    const sexoRadios = document.querySelectorAll('input[name="sexo"]');

    // Verifica elementos essenciais
    if (!pesoInput || !alturaInput || !calcularBtn || !resultadoDiv || !imcValorP || !imcInterpretacaoP || !erroDiv || !infoCriancaDiv || !idadeInput || !infoAdicionalP) {
        console.error("Erro: Um ou mais elementos do HTML não foram encontrados. Verifique os IDs.");
        if (erroMensagemP) erroMensagemP.textContent = "Erro interno na página. Elemento não encontrado.";
        erroDiv.style.display = 'block';
        return;
    }
    console.log("Elementos do HTML encontrados.");

    // --- Event Listeners ---

    // Listener para mostrar/ocultar campos de criança
    tipoUsuarioRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (document.querySelector('input[name="tipoUsuario"]:checked').value === 'crianca') {
                infoCriancaDiv.style.display = 'block';
            } else {
                infoCriancaDiv.style.display = 'none';
            }
            limparFeedback(); // Limpa resultados/erros ao mudar o tipo
        });
    });

    // Listener para o botão de calcular
    calcularBtn.addEventListener('click', processarCalculo);
    console.log("Ouvinte de clique adicionado ao botão.");

    // Listeners para limpar feedback ao digitar
    pesoInput.addEventListener('input', limparFeedback);
    alturaInput.addEventListener('input', limparFeedback);
    idadeInput.addEventListener('input', limparFeedback); // Limpa ao digitar idade também
    sexoRadios.forEach(radio => radio.addEventListener('change', limparFeedback)); // Limpa ao mudar sexo

    // --- Funções ---

    function processarCalculo() {
        console.log("Botão 'Calcular IMC' clicado.");
        limparFeedback(); // Garante que feedbacks antigos sejam limpos

        // --- Leitura e Validação dos Inputs ---
        const tipoSelecionado = document.querySelector('input[name="tipoUsuario"]:checked')?.value;
        const peso = parseFloat(pesoInput.value);
        const altura = parseFloat(alturaInput.value);

        // Validação básica (peso e altura)
        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            mostrarErro('Por favor, insira peso e altura válidos (use ponto "." para decimais).');
            return;
        }

        let idade = null;
        let sexo = null;

        // Validação específica para Criança/Adolescente
        if (tipoSelecionado === 'crianca') {
            idade = parseInt(idadeInput.value);
            sexo = document.querySelector('input[name="sexo"]:checked')?.value;

            if (isNaN(idade) || idade < 2 || idade > 19) {
                mostrarErro('Por favor, insira uma idade válida (entre 2 e 19 anos).');
                return;
            }
            if (!sexo) {
                mostrarErro('Por favor, selecione o sexo.');
                return;
            }
            console.log(`Dados Criança: Idade=${idade}, Sexo=${sexo}`);
        }

        // --- Cálculo do IMC (igual para todos) ---
        const imc = peso / (altura * altura);
        const imcFormatado = imc.toFixed(1);
        console.log(`IMC Calculado: ${imcFormatado}`);

        // --- Interpretação Baseada no Tipo ---
        let interpretacao = '';
        let classeCss = 'default'; // Classe padrão
        let infoAdicional = '';

        if (tipoSelecionado === 'adulto') {
            const resultadoAdulto = getClassificacaoIMCAdulto(imc);
            interpretacao = `Classificação: ${resultadoAdulto.classificacao}`;
            classeCss = resultadoAdulto.classeCss;
            infoAdicional = 'Lembre-se que o IMC é uma ferramenta de triagem. Consulte um profissional para avaliação completa.';
            console.log(`Adulto - Classificação: ${resultadoAdulto.classificacao}`);

        } else if (tipoSelecionado === 'crianca') {
            interpretacao = `O IMC calculado é ${imcFormatado}.`;
            infoAdicional = `Para crianças/adolescentes de ${idade} anos (${sexo}), este valor deve ser comparado com gráficos de percentil de IMC por idade e sexo. Consulte um pediatra ou use ferramentas como as do CDC/OMS.`;
            // Poderíamos ter classes CSS diferentes para crianças, mas vamos usar a 'default' por ora
            // classeCss = 'crianca-info'; // Exemplo, se quiséssemos estilo específico
            console.log(`Criança - Interpretação: Avaliar com percentis.`);
        }

        // --- Exibir Resultado ---
        mostrarResultado(imcFormatado, interpretacao, classeCss, infoAdicional);
    }

    function getClassificacaoIMCAdulto(imc) {
        // Mesma lógica de antes, retorna { classificacao: '...', classeCss: '...' }
        if (imc < 18.5) return { classificacao: 'Abaixo do peso', classeCss: 'abaixo' };
        if (imc < 25.0) return { classificacao: 'Peso normal', classeCss: 'normal' };
        if (imc < 30.0) return { classificacao: 'Sobrepeso', classeCss: 'sobrepeso' };
        if (imc < 35.0) return { classificacao: 'Obesidade Grau I', classeCss: 'obesidade1' };
        if (imc < 40.0) return { classificacao: 'Obesidade Grau II', classeCss: 'obesidade2' };
        return { classificacao: 'Obesidade Grau III', classeCss: 'obesidade3' };
    }

    function mostrarResultado(imc, interpretacaoResultado, classeCss, infoAdicionalTexto = '') {
        console.log("Mostrando resultado...");
        imcValorP.textContent = `Seu IMC: ${imc}`;
        imcInterpretacaoP.textContent = interpretacaoResultado;
        infoAdicionalP.textContent = infoAdicionalTexto;

        // Limpa classes antigas e adiciona a nova
        resultadoDiv.className = 'resultado-area'; // Reseta para a classe base
        if (classeCss !== 'default') { // Adiciona classe de cor apenas se não for default
             resultadoDiv.classList.add(classeCss);
        }

        resultadoDiv.style.display = 'block';
        erroDiv.style.display = 'none';
        console.log("Resultado exibido.");
    }

    function mostrarErro(mensagem) {
        console.log("Mostrando erro:", mensagem);
        erroMensagemP.textContent = mensagem; // Atualiza a mensagem de erro no parágrafo
        erroDiv.style.display = 'block';
        resultadoDiv.style.display = 'none';
    }

    function limparFeedback() {
        erroDiv.style.display = 'none';
        resultadoDiv.style.display = 'none';
        // Limpa também os textos para evitar mostrar info antiga rapidamente
        imcValorP.textContent = '';
        imcInterpretacaoP.textContent = '';
        infoAdicionalP.textContent = '';
        erroMensagemP.textContent = ''; // Limpa texto do erro também
        console.log("Feedback limpo.");
    }
});