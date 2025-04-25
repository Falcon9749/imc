// Aguarda o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Carregado. Script iniciado."); // Log 1: Confirma que o script começou

    // Seleciona os elementos do HTML
    const pesoInput = document.getElementById('peso');
    const alturaInput = document.getElementById('altura');
    const calcularBtn = document.getElementById('calcularBtn');
    const resultadoDiv = document.getElementById('resultado');
    const imcValorP = document.getElementById('imcValor');
    const imcClassificacaoP = document.getElementById('imcClassificacao');
    const erroDiv = document.getElementById('erro');

    // Verifica se os elementos foram encontrados
    if (!pesoInput || !alturaInput || !calcularBtn || !resultadoDiv || !imcValorP || !imcClassificacaoP || !erroDiv) {
        console.error("Erro: Um ou mais elementos do HTML não foram encontrados. Verifique os IDs."); // Log 2: Erro se algum ID estiver errado
        return; // Para a execução se elementos não forem achados
    } else {
        console.log("Elementos do HTML encontrados com sucesso."); // Log 3: Confirma que os elementos foram selecionados
    }

    // Adiciona um ouvinte de evento ao botão de calcular
    calcularBtn.addEventListener('click', calcularIMC);
    console.log("Ouvinte de clique adicionado ao botão."); // Log 4: Confirma que o ouvinte foi adicionado

    // Adiciona ouvintes para limpar erro/resultado ao digitar
    pesoInput.addEventListener('input', limparFeedback);
    alturaInput.addEventListener('input', limparFeedback);

    function calcularIMC() {
        console.log("Botão 'Calcular IMC' clicado."); // Log 5: Confirma que a função foi chamada

        // Pega os valores dos inputs
        const pesoStr = pesoInput.value;
        const alturaStr = alturaInput.value;
        console.log(`Valores lidos - Peso: ${pesoStr}, Altura: ${alturaStr}`); // Log 6: Mostra os valores como string

        // Converte para número (float)
        const peso = parseFloat(pesoStr);
        const altura = parseFloat(alturaStr);
        console.log(`Valores convertidos - Peso: ${peso}, Altura: ${altura}`); // Log 7: Mostra os valores após parseFloat

        // Validação: Verifica se os valores são números válidos e positivos
        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            console.error("Erro de validação: Peso ou altura inválidos.", { peso, altura }); // Log 8: Erro de validação
            mostrarErro('Por favor, insira valores numéricos válidos e positivos para peso (kg) e altura (m). Use ponto (.) para decimais.');
            return; // Para a execução se inválido
        }

        // Calcula o IMC: peso / (altura * altura)
        const imc = peso / (altura * altura);
        console.log(`IMC Calculado: ${imc}`); // Log 9: Mostra o IMC calculado

        // Formata o IMC para uma casa decimal
        const imcFormatado = imc.toFixed(1);

        // Determina a classificação e a classe CSS correspondente
        const { classificacao, classeCss } = getClassificacaoIMC(imc);
        console.log(`Classificação: ${classificacao}, Classe CSS: ${classeCss}`); // Log 10: Mostra a classificação

        // Exibe o resultado formatado
        mostrarResultado(imcFormatado, classificacao, classeCss);
    }

    function getClassificacaoIMC(imc) {
        // (O código desta função permanece o mesmo)
        if (imc < 18.5) {
            return { classificacao: 'Abaixo do peso', classeCss: 'abaixo' };
        } else if (imc >= 18.5 && imc <= 24.9) {
            return { classificacao: 'Peso normal', classeCss: 'normal' };
        } else if (imc >= 25.0 && imc <= 29.9) {
            return { classificacao: 'Sobrepeso', classeCss: 'sobrepeso' };
        } else if (imc >= 30.0 && imc <= 34.9) {
            return { classificacao: 'Obesidade Grau I', classeCss: 'obesidade1' };
        } else if (imc >= 35.0 && imc <= 39.9) {
            return { classificacao: 'Obesidade Grau II', classeCss: 'obesidade2' };
        } else { // imc >= 40.0
            return { classificacao: 'Obesidade Grau III (Mórbida)', classeCss: 'obesidade3' };
        }
    }

    function mostrarResultado(imc, classificacao, classeCss) {
        console.log("Mostrando resultado..."); // Log 11: Confirma entrada na função de mostrar resultado
        imcValorP.textContent = `Seu IMC: ${imc}`;
        imcClassificacaoP.textContent = `Classificação: ${classificacao}`;

        // Remove classes de cor anteriores antes de adicionar a nova
        resultadoDiv.className = 'resultado-area'; // Reseta para a classe base
        resultadoDiv.classList.add(classeCss); // Adiciona a nova classe de cor

        resultadoDiv.style.display = 'block'; // Torna a área de resultado visível
        erroDiv.style.display = 'none';    // Esconde a área de erro
        console.log("Resultado exibido."); // Log 12: Confirma exibição do resultado
    }

    function mostrarErro(mensagem) {
        console.log("Mostrando erro:", mensagem); // Log 13: Confirma entrada na função de mostrar erro
        erroDiv.querySelector('p').textContent = mensagem; // Atualiza a mensagem de erro
        erroDiv.style.display = 'block';    // Torna a área de erro visível
        resultadoDiv.style.display = 'none'; // Esconde a área de resultado
    }

    function limparFeedback() {
        // Esconde as áreas de erro e resultado quando o usuário começa a digitar novamente
         if (erroDiv.style.display === 'block') {
             erroDiv.style.display = 'none';
             console.log("Feedback de erro limpo."); // Log 14: Confirma limpeza do erro
         }
         // Opcional: esconder resultado ao digitar novamente
         // if (resultadoDiv.style.display === 'block') {
         //     resultadoDiv.style.display = 'none';
         //     console.log("Feedback de resultado limpo."); // Log 15: Confirma limpeza do resultado (se descomentado)
         // }
    }
});