// Interatividade da sidebar
const sidebarIcons = document.querySelectorAll('.sidebar-icon');
sidebarIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        sidebarIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
    });
});

// Interatividade das categorias
const categories = document.querySelectorAll('.category');
categories.forEach(category => {
    category.addEventListener('click', () => {
        categories.forEach(c => c.classList.remove('active'));
        category.classList.add('active');

        // Aqui você pode adicionar a lógica para filtrar as histórias por categoria
        console.log(`Categoria selecionada: ${category.textContent}`);
    });
});

// Interatividade dos botões de seguir artista
const followButtons = document.querySelectorAll('.artist-follow');
followButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation();
        if (this.textContent === 'Seguir') {
            this.textContent = 'Seguindo';
            this.style.background = 'rgba(255, 215, 0, 0.2)';

            // Notificação de sucesso
            showNotification(`Agora você está seguindo ${this.parentElement.querySelector('.artist-name').textContent}`);
        } else {
            this.textContent = 'Seguir';
            this.style.background = 'transparent';
        }
    });
});

// Interatividade das ações nas miniaturas
const thumbnailActions = document.querySelectorAll('.thumbnail-action');
thumbnailActions.forEach(action => {
    action.addEventListener('click', function (e) {
        e.stopPropagation();
        const icon = this.querySelector('i');

        if (icon.classList.contains('fa-heart')) {
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                icon.style.color = '#ff4757';

                // Incrementar contador de likes
                const countSpan = this.querySelector('span:not(.fa-heart)');
                if (countSpan) {
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count + 1;
                }
            } else {
                icon.classList.replace('fas', 'far');
                icon.style.color = '';

                // Decrementar contador de likes
                const countSpan = this.querySelector('span:not(.fa-heart)');
                if (countSpan) {
                    let count = parseInt(countSpan.textContent);
                    countSpan.textContent = count - 1;
                }
            }
        }
    });
});

// Interatividade dos itens em destaque
const featuredItems = document.querySelectorAll('.featured-item');
featuredItems.forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.art-title').textContent;
        const artist = item.querySelector('.art-artist').textContent;

        // Aqui você pode abrir um modal ou redirecionar para a página da história
        console.log(`Visualizando história: ${title} | ${artist}`);

        // Simulação de abertura de modal
        showStoryModal(title, artist);
    });
});

// Função para mostrar notificações
function showNotification(message) {
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

// Função para simular a abertura de um modal de história
function showStoryModal(title, artist) {
    // Criar overlay do modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    // Criar conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <p>Autor: ${artist}</p>
            <p>Esta é uma visualização simulada da história. Em uma implementação real, aqui estaria o conteúdo da história com opções para desenhar em cada página.</p>
            <div class="modal-actions">
                <button class="modal-button read-btn">Ler História</button>
                <button class="modal-button draw-btn">Desenhar Agora</button>
            </div>
        </div>
    `;

    // Adicionar estilos
    modalOverlay.style.position = 'fixed';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.background = 'rgba(0, 0, 0, 0.7)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '2000';
    modalOverlay.style.opacity = '0';
    modalOverlay.style.transition = 'opacity 0.3s ease';

    modalContent.style.background = 'rgba(45, 21, 84, 0.95)';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '15px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '500px';
    modalContent.style.backdropFilter = 'blur(10px)';
    modalContent.style.border = '1px solid rgba(255, 215, 0, 0.3)';
    modalContent.style.transform = 'scale(0.9)';
    modalContent.style.transition = 'transform 0.3s ease';

    // Adicionar ao corpo do documento
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Animação de entrada
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);

    // Fechar modal ao clicar no overlay ou no botão de fechar
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay || e.target.classList.contains('close-modal')) {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';

            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }
    });

    // Adicionar interatividade aos botões do modal
    const readBtn = modalContent.querySelector('.read-btn');
    const drawBtn = modalContent.querySelector('.draw-btn');

    readBtn.addEventListener('click', () => {
        showNotification('Iniciando a leitura da história!');
        setTimeout(() => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }, 1000);
    });

    drawBtn.addEventListener('click', () => {
        showNotification('Abrindo ferramenta de desenho!');
        setTimeout(() => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        }, 1000);
    });
}

// Criar bolinhas flutuantes interativas
function createFloatingShapes() {
    const container = document.querySelector('.floating-shapes');

    // Limpar shapes existentes
    container.innerHTML = '';

    // Criar diferentes tamanhos e cores de bolinhas
    const shapeConfigs = [
        { size: 60, color: 'purple', count: 8 },
        { size: 40, color: 'gold', count: 6 },
        { size: 80, color: 'purple', count: 4 },
        { size: 25, color: 'gold', count: 10 },
        { size: 15, color: 'purple', count: 15 }
    ];

    shapeConfigs.forEach(config => {
        for (let i = 0; i < config.count; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${config.color}`;
            shape.style.width = config.size + 'px';
            shape.style.height = config.size + 'px';
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 8 + 's';
            shape.style.animationDuration = `${8 + Math.random() * 4}s`;

            // Adicionar interação ao passar o mouse
            shape.addEventListener('mouseover', () => {
                shape.style.transform = 'scale(1.2)';
                shape.style.opacity = '0.9';
            });

            shape.addEventListener('mouseout', () => {
                shape.style.transform = 'scale(1)';
                shape.style.opacity = '0.6';
            });

            // Adicionar interação ao clicar
            shape.addEventListener('click', () => {
                shape.style.animation = 'none';
                shape.style.transform = 'scale(1.5)';
                shape.style.opacity = '0.8';

                setTimeout(() => {
                    shape.style.animation = `float ${8 + Math.random() * 4}s ease-in-out infinite`;
                    shape.style.transform = 'scale(1)';
                    shape.style.opacity = '0.6';
                }, 500);
            });

            container.appendChild(shape);
        }
    });
}

// Efeito de digitação no título de boas-vindas
function typeWriterEffect() {
    const welcomeTitle = document.querySelector('.welcome-text h2');
    if (welcomeTitle) {
        const originalText = welcomeTitle.textContent;
        welcomeTitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                welcomeTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        typeWriter();
    }
}

// Adicionar funcionalidade de busca
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

// Função de busca
function performSearch(query) {
    if (query.trim() !== '') {
        showNotification(`Buscando por: ${query}`);
        // Aqui você implementaria a lógica real de busca
        console.log(`Realizando busca por: ${query}`);
    }
}

// Adicionar funcionalidade ao formulário de inscrição
function setupNewsletter() {
    const footerForm = document.querySelector('.footer-form');
    if (footerForm) {
        footerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('.footer-input');
            if (emailInput.value.trim() !== '') {
                showNotification('Inscrição realizada com sucesso!');
                emailInput.value = '';
            }
        });
    }
}

// Configurações de acessibilidade
function setupAccessibility() {
    // Tecla "A" para ativar/desativar alto contraste
    document.addEventListener('keydown', (e) => {
        if (e.key === 'a' || e.key === 'A') {
            document.body.classList.toggle('high-contrast');
            showNotification('Modo de alto contraste ' +
                (document.body.classList.contains('high-contrast') ? 'ativado' : 'desativado'));
        }

        // Tecla "F" para fonte mais legível
        if (e.key === 'f' || e.key === 'F') {
            document.body.classList.toggle('readable-font');
            showNotification('Fonte especial ' +
                (document.body.classList.contains('readable-font') ? 'ativada' : 'desativada'));
        }
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    // Criar bolinhas flutuantes
    createFloatingShapes();

    // Efeito de digitação
    typeWriterEffect();

    // Configurar busca
    setupSearch();

    // Configurar newsletter
    setupNewsletter();

    // Configurar acessibilidade
    setupAccessibility();

    // Recriar bolinhas quando a janela for redimensionada
    window.addEventListener('resize', createFloatingShapes);
});

// Botão de desenhar
const drawButton = document.querySelector('.btn-draw');
if (drawButton) {
    drawButton.addEventListener('click', () => {
        showNotification('Abrindo ferramenta de desenho!');
        // Aqui você redirecionaria para a página de desenho
    });
}