// Interatividade da página de configurações
document.addEventListener('DOMContentLoaded', function () {
    // Configurar modo escuro
    setupDarkMode();

    // Configurar tamanho da fonte
    setupFontSize();

    // Configurar cores do tema
    setupThemeColors();

    // Configurar outros controles
    setupOtherControls();

    // Garantir que as bolinhas flutuantes sejam criadas
    if (typeof createFloatingShapes === 'function') {
        createFloatingShapes();
    }

    // Configurar acessibilidade
    if (typeof setupAccessibility === 'function') {
        setupAccessibility();
    }
});

// Configurar modo escuro
function setupDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Verificar se há uma preferência salva
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Aplicar o modo escuro se estiver ativado
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Adicionar evento de mudança
    darkModeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
            showNotification('Modo escuro ativado');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
            showNotification('Modo escuro desativado');
        }
    });
}

// Configurar tamanho da fonte
function setupFontSize() {
    const fontButtons = document.querySelectorAll('.font-size-btn');

    // Verificar se há um tamanho salvo
    const savedSize = localStorage.getItem('fontSize') || 'medium';

    // Aplicar o tamanho salvo
    document.documentElement.setAttribute('data-font-size', savedSize);

    // Ativar o botão correspondente
    fontButtons.forEach(btn => {
        if (btn.getAttribute('data-size') === savedSize) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }

        // Adicionar evento de clique
        btn.addEventListener('click', function () {
            const size = this.getAttribute('data-size');

            // Remover classe active de todos os botões
            fontButtons.forEach(b => b.classList.remove('active'));

            // Adicionar classe active ao botão clicado
            this.classList.add('active');

            // Aplicar o tamanho selecionado
            document.documentElement.setAttribute('data-font-size', size);
            localStorage.setItem('fontSize', size);

            showNotification(`Tamanho da fonte alterado para ${size}`);
        });
    });
}

// Configurar cores do tema
function setupThemeColors() {
    const colorOptions = document.querySelectorAll('.color-option');

    // Verificar se há um tema salvo
    const savedTheme = localStorage.getItem('theme') || 'default';

    // Aplicar o tema salvo
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Ativar a opção correspondente
    colorOptions.forEach(option => {
        if (option.getAttribute('data-theme') === savedTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }

        // Adicionar evento de clique
        option.addEventListener('click', function () {
            const theme = this.getAttribute('data-theme');

            // Remover classe active de todas as opções
            colorOptions.forEach(o => o.classList.remove('active'));

            // Adicionar classe active à opção clicada
            this.classList.add('active');

            // Aplicar o tema selecionado
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);

            showNotification(`Tema alterado para ${theme}`);
        });
    });
}

// Configurar outros controles
function setupOtherControls() {
    // Configurar privacidade
    const privacySetting = document.getElementById('privacy-setting');
    const savedPrivacy = localStorage.getItem('privacy') || 'public';
    privacySetting.value = savedPrivacy;

    privacySetting.addEventListener('change', function () {
        localStorage.setItem('privacy', this.value);
        showNotification(`Configuração de privacidade alterada para ${this.value}`);
    });

    // Configurar leitor de tela
    const screenReaderToggle = document.getElementById('screen-reader-toggle');
    const isScreenReader = localStorage.getItem('screenReader') === 'true';

    if (isScreenReader) {
        screenReaderToggle.checked = true;
        enableScreenReader();
    }

    screenReaderToggle.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('screenReader', 'true');
            enableScreenReader();
            showNotification('Leitor de tela ativado');
        } else {
            localStorage.setItem('screenReader', 'false');
            disableScreenReader();
            showNotification('Leitor de tela desativado');
        }
    });

    // Configurar alto contraste
    const highContrastToggle = document.getElementById('high-contrast-toggle');
    const isHighContrast = localStorage.getItem('highContrast') === 'true';

    if (isHighContrast) {
        highContrastToggle.checked = true;
        document.body.classList.add('high-contrast');
    }

    highContrastToggle.addEventListener('change', function () {
        if (this.checked) {
            localStorage.setItem('highContrast', 'true');
            document.body.classList.add('high-contrast');
            showNotification('Alto contraste ativado');
        } else {
            localStorage.setItem('highContrast', 'false');
            document.body.classList.remove('high-contrast');
            showNotification('Alto contraste desativado');
        }
    });

    // Configurar botões
    document.getElementById('notifications-btn').addEventListener('click', function () {
        showNotification('Configurações de notificação abertas');
        // Aqui você implementaria a lógica para abrir as configurações de notificação
    });

    document.getElementById('password-btn').addEventListener('click', function () {
        showNotification('Redirecionando para alteração de senha');
        // Aqui você implementaria a lógica para alterar a senha
    });

    document.getElementById('shortcuts-btn').addEventListener('click', function () {
        showNotification('Atalhos de teclado:\nEscape - Fechar modais\nTab - Navegação por teclado');
        // Aqui você implementaria a lógica para mostrar os atalhos de teclado
    });
}

// Funções para o leitor de tela
function enableScreenReader() {
    document.body.setAttribute('aria-live', 'polite');
    document.body.setAttribute('aria-atomic', 'true');

    // Adicionar estilos para melhorar acessibilidade
    const style = document.createElement('style');
    style.id = 'screen-reader-styles';
    style.textContent = `
        *:focus {
            outline: 2px solid #ffd700 !important;
            outline-offset: 2px !important;
        }
        
        [aria-label] {
            position: relative;
        }
        
        [aria-label]:hover::after {
            content: attr(aria-label);
            position: absolute;
            bottom: -30px;
            left: 0;
            background: #2d1554;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9rem;
            white-space: nowrap;
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}

function disableScreenReader() {
    document.body.removeAttribute('aria-live');
    document.body.removeAttribute('aria-atomic');

    const styles = document.getElementById('screen-reader-styles');
    if (styles) {
        styles.remove();
    }
}

// Função para mostrar notificações (reutilizada do script.js)
function showNotification(message) {
    // Verificar se a função já existe no script.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message);
        return;
    }

    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

    // Estilos para a notificação
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = 'rgba(45, 21, 84, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.border = '1px solid rgba(255, 215, 0, 0.3)';
    notification.style.transform = 'translateX(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';

    // Adicionar ao corpo do documento
    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}