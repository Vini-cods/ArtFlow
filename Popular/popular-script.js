// Script para a página Popular

document.addEventListener('DOMContentLoaded', function () {
    // Criar bolinhas flutuantes interativas
    createFloatingShapes();

    // Inicializar funcionalidades interativas
    initInteractiveFeatures();

    // Inicializar o calendário
    initCalendar();

    // Inicializar tooltips para eventos
    initEventTooltips();

    // Adicionar efeito parallax às bolinhas
    initParallaxEffect();
});

// Criar bolinhas flutuantes interativas melhoradas
function createFloatingShapes() {
    const container = document.querySelector('.floating-shapes');
    const colors = ['purple', 'gold'];
    const shapesCount = 25; // Aumentado para mais bolinhas

    for (let i = 0; i < shapesCount; i++) {
        const shape = document.createElement('div');
        shape.classList.add('floating-shape');
        shape.classList.add(colors[Math.floor(Math.random() * colors.length)]);

        // Posição e tamanho aleatórios
        const size = Math.random() * 50 + 20; // Tamanhos variados
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = 10 + Math.random() * 10;

        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${left}%`;
        shape.style.top = `${top}%`;
        shape.style.animationDelay = `${delay}s`;
        shape.style.animationDuration = `${duration}s`;

        // Adicionar interação ao clicar
        shape.addEventListener('click', function () {
            this.style.animation = 'none';
            this.style.transform = 'scale(1.5)';
            this.style.opacity = '0.9';

            setTimeout(() => {
                this.style.animation = `float ${duration}s ease-in-out infinite`;
                this.style.transform = 'scale(1)';
                this.style.opacity = '0.7';
            }, 500);
        });

        container.appendChild(shape);
    }
}

// Efeito parallax para as bolinhas
function initParallaxEffect() {
    document.addEventListener('mousemove', function (e) {
        const shapes = document.querySelectorAll('.floating-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        shapes.forEach(shape => {
            const speed = parseFloat(shape.style.width) / 100;
            const xMove = (x - 0.5) * speed * 20;
            const yMove = (y - 0.5) * speed * 20;

            shape.style.transform = `translate(${xMove}px, ${yMove}px)`;
        });
    });
}

// Inicializar funcionalidades interativas
function initInteractiveFeatures() {
    // Botões de seguir artista
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.textContent === 'Seguir') {
                this.textContent = 'Seguindo';
                this.style.background = 'linear-gradient(45deg, #4cd137, #44bd32)';
                showNotification('Agora você está seguindo este artista!');
            } else {
                this.textContent = 'Seguir';
                this.style.background = 'linear-gradient(45deg, #ffd700, #f6ad55)';
                showNotification('Você parou de seguir este artista.');
            }
        });
    });

    // Botões de lembrar evento
    const remindButtons = document.querySelectorAll('.remind-btn');
    remindButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.innerHTML.includes('far fa-bell')) {
                this.innerHTML = '<i class="fas fa-bell"></i> Lembrando';
                this.style.background = 'rgba(76, 209, 55, 0.2)';
                this.style.color = '#4cd137';
                this.style.borderColor = '#4cd137';
                showNotification('Lembrete ativado para este evento!');
            } else {
                this.innerHTML = '<i class="far fa-bell"></i> Lembrar';
                this.style.background = 'rgba(255, 215, 0, 0.1)';
                this.style.color = '#ffd700';
                this.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                showNotification('Lembrete desativado.');
            }
        });
    });

    // Filtros de tempo
    const timeFilters = document.querySelectorAll('.filter');
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            timeFilters.forEach(f => f.classList.remove('active'));
            this.classList.add('active');

            // Simular mudança de conteúdo baseado no filtro
            simulateContentChange(this.textContent.trim());
        });
    });

    // Efeito de hover nos cards
    const cards = document.querySelectorAll('.trending-item, .artist-card, .drawing-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });
}

// Inicializar o calendário
function initCalendar() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const currentMonthElement = document.querySelector('.current-month');

    let currentDate = new Date();

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (this.querySelector('.fa-chevron-left')) {
                currentDate.setMonth(currentDate.getMonth() - 1);
            } else {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }

            updateCalendar(currentDate);
        });
    });

    // Atualizar calendário com a data atual
    updateCalendar(currentDate);
}

// Atualizar o calendário com a data fornecida
function updateCalendar(date) {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const currentMonthElement = document.querySelector('.current-month');
    currentMonthElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

// Inicializar tooltips para eventos
function initEventTooltips() {
    const eventDots = document.querySelectorAll('.event-dot');

    eventDots.forEach(dot => {
        dot.addEventListener('mouseenter', function () {
            // Tooltip já está implementado no CSS via attr() e ::after
        });
    });
}

// Simular mudança de conteúdo baseado no filtro de tempo
function simulateContentChange(filter) {
    const trendingItems = document.querySelectorAll('.trending-item');
    const trendingStats = document.querySelectorAll('.trending-stats span');

    // Dados simulados para diferentes períodos
    const data = {
        'Hoje': {
            views: ['+2.4K', '+1.8K', '+1.5K'],
            increase: ['45%', '32%', '28%']
        },
        'Esta semana': {
            views: ['+15.2K', '+12.7K', '+10.3K'],
            increase: ['62%', '48%', '41%']
        },
        'Este mês': {
            views: ['+54.8K', '+46.3K', '+38.9K'],
            increase: ['78%', '65%', '57%']
        }
    };

    // Atualizar os dados exibidos
    trendingItems.forEach((item, index) => {
        const info = item.querySelector('.trending-info p');
        const stats = item.querySelector('.trending-stats span');

        if (info && stats) {
            info.textContent = `${data[filter].views[index]} visualizações`;
            stats.innerHTML = `<i class="fas fa-fire"></i> ${data[filter].increase[index]} aumento`;
        }
    });

    // Mostrar mensagem de feedback
    showNotification(`Conteúdo atualizado para: ${filter}`);
}

// Mostrar notificação
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, rgba(107, 47, 160, 0.9), rgba(74, 31, 122, 0.9));
        color: white;
        padding: 12px 20px;
        border-radius: 10px;
        z-index: 1000;
        font-size: 0.9rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
        border: 1px solid rgba(255, 215, 0, 0.3);
    `;

    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
    
    /* Melhorias de acessibilidade para foco */
    *:focus {
        outline: 2px solid #ffd700;
        outline-offset: 2px;
    }
    
    /* Melhorias de scroll */
    .main-content::-webkit-scrollbar {
        width: 8px;
    }
    
    .main-content::-webkit-scrollbar-track {
        background: rgba(255, 215, 0, 0.1);
        border-radius: 10px;
    }
    
    .main-content::-webkit-scrollbar-thumb {
        background: rgba(255, 215, 0, 0.3);
        border-radius: 10px;
    }
    
    .main-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 215, 0, 0.5);
    }
`;
document.head.appendChild(style);