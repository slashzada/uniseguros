// JAVASCRIPT: Lógica de Validação e Envio para o WhatsApp E MODO ESCURO

// Variável importante: Número da Uniseguros
// **ATENÇÃO:** Altere este número para o telefone real da Uniseguros.
const NUMERO_CORRETORA = "5575988776655"; 

// --- FUNÇÕES DE DARK/LIGHT MODE ---

// Função para aplicar o tema e salvar no localStorage
function setTema(theme) {
    const body = document.body;
    const toggleButton = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        body.classList.add('dark-mode');
        // Mudar o ícone para Lua (indicando que o próximo clique será Light Mode)
        if (toggleButton) {
            toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        }
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        // Mudar o ícone para Sol (indicando que o próximo clique será Dark Mode)
        if (toggleButton) {
            toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        }
        localStorage.setItem('theme', 'light');
    }
}

// Função para alternar o tema ao clicar no botão
function toggleTema() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        setTema('light');
    } else {
        setTema('dark');
    }
}


// --- FUNÇÃO DE COTAÇÃO WHATSAPP ---

function enviarCotacaoWhatsapp(event) {
    event.preventDefault(); // Impede o envio tradicional do formulário

    // 1. Captura os valores dos campos
    const nomeCliente = document.getElementById('campoNome').value.trim();
    // O valor é capturado do SELECT nativo, que é atualizado pelo Custom Select
    const tipoPlano = document.getElementById('campoTipoPlano').value; 
    const cidadeInteresse = document.getElementById('campoCidade').value.trim();

    let formularioValido = true;

    // 2. Validação dos Campos e Exibição de Erros
    
    const erroNome = document.getElementById('erroNome');
    if (nomeCliente === "") {
        erroNome.style.display = 'block';
        formularioValido = false;
    } else {
        erroNome.style.display = 'none';
    }

    const erroTipo = document.getElementById('erroTipo');
    if (tipoPlano === "") {
        erroTipo.style.display = 'block';
        formularioValido = false;
    } else {
        erroTipo.style.display = 'none';
    }
    
    const erroCidade = document.getElementById('erroCidade');
    if (cidadeInteresse === "") {
        erroCidade.style.display = 'block';
        formularioValido = false;
    } else {
        erroCidade.style.display = 'none';
    }

    // 3. Se o formulário estiver válido, monta e envia a mensagem
    if (formularioValido) {
        const mensagem = 
            `Olá, Uniseguros! 👋%0A%0A` +
            `Gostaria de solicitar uma cotação de plano de saúde. Por favor, entre em contato comigo.%0A%0A` +
            `*Dados da Solicitação:*%0A` +
            `*Nome:* ${nomeCliente}%0A` +
            `*Tipo de Plano:* ${tipoPlano}%0A` +
            `*Localização:* ${cidadeInteresse}%0A%0A` +
            `Solicitação enviada via Cotação Rápida do site.`
        ;
        
        const linkWhatsapp = `https://api.whatsapp.com/send?phone=${75981741198}&text=${mensagem}`;
        
        window.open(linkWhatsapp, '_blank');
    }
}


// --- FUNÇÃO PARA CRIAR E INICIALIZAR O CUSTOM SELECT ---
function initializeCustomSelects() {
    const customSelectDisplay = document.getElementById("custom-select-display");
    const customSelectItems = document.getElementById("custom-select-items");
    const selectElement = document.getElementById("campoTipoPlano");
    
    if (!selectElement || !customSelectDisplay || !customSelectItems) return;

    // 1. Preenche a lista customizada (select-items) com as opções do select nativo
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        
        // Cria o elemento DIV que será a opção customizada
        const itemDiv = document.createElement("DIV");
        itemDiv.innerHTML = option.innerHTML;
        itemDiv.setAttribute("data-value", option.value); // Salva o valor real
        
        // Adiciona o evento de clique para seleção
        itemDiv.addEventListener("click", function(e) {
            // Remove a classe 'same-as-selected' de todos
            Array.from(customSelectItems.children).forEach(child => {
                child.classList.remove("same-as-selected");
            });

            // Atualiza o valor do SELECT nativo (importante para o formulário e validação)
            selectElement.value = this.getAttribute("data-value");
            
            // Atualiza o texto exibido
            customSelectDisplay.innerHTML = this.innerHTML;
            
            // Adiciona a classe para estilizar o item selecionado
            this.classList.add("same-as-selected");
            
            // Esconde a lista
            customSelectItems.classList.add("select-hide");
            customSelectDisplay.classList.remove("select-arrow-active");
            
            // Dispara o evento 'change' no select nativo (útil para validações futuras)
            selectElement.dispatchEvent(new Event('change'));
            
            // Se o campo for válido após a seleção, esconde o erro
            if (selectElement.value !== "") {
                document.getElementById('erroTipo').style.display = 'none';
            }
        });
        
        customSelectItems.appendChild(itemDiv);
    }
    
    // 2. Adiciona o evento de clique no campo de visualização (para abrir/fechar a lista)
    customSelectDisplay.addEventListener("click", function(e) {
        e.stopPropagation(); 
        this.classList.toggle("select-arrow-active");
        customSelectItems.classList.toggle("select-hide");
    });
    
    // 3. Adiciona o evento de clique no corpo da página (para fechar a lista ao clicar fora)
    document.addEventListener("click", function(e) {
        if (!e.target.closest('.custom-select-wrapper')) {
            customSelectItems.classList.add("select-hide");
            customSelectDisplay.classList.remove("select-arrow-active");
        }
    });
}


// --- INICIALIZAÇÃO E EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicialização do Tema
    const savedTheme = localStorage.getItem('theme');
    setTema(savedTheme || 'light'); 
    
    // 2. Listener do Botão de Tema
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
        toggleButton.addEventListener('click', toggleTema);
    }
    
    // 3. Inicializa o Custom Select
    initializeCustomSelects(); 
    
    // 4. Listener do Formulário de Cotação
    const form = document.getElementById('formCotacaoRapida');
    if (form) {
        form.addEventListener('submit', enviarCotacaoWhatsapp);
    }
});