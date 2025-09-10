// Dados de exemplo para a página de conquistas
const achievementsData = {
    reading: [
        {
            id: 1,
            title: "Primeira Leitura",
            description: "Complete sua primeira história no ArtFlow",
            icon: "fas fa-book",
            tier: "bronze",
            points: 10,
            progress: { current: 1, target: 1 },
            unlocked: true,
            unlockDate: "2023-03-12"
        },
        {
            id: 2,
            title: "Leitor Ávido",
            description: "Leia 10 histórias diferentes",
            icon: "fas fa-book-reader",
            tier: "silver",
            points: 25,
            progress: { current: 10, target: 10 },
            unlocked: true,
            unlockDate: "2023-04-15"
        },
        {
            id: 3,
            title: "Explorador Literário",
            description: "Leia histórias de 5 categorias diferentes",
            icon: "fas fa-globe",
            tier: "silver",
            points: 30,
            progress: { current: 3, target: 5 },
            unlocked: false
        },
        {
            id: 4,
            title: "Leitor Mestre",
            description: "Leia 50 histórias",
            icon: "fas fa-trophy",
            tier: "gold",
            points: 50,
            progress: { current: 25, target: 50 },
            unlocked: false
        },
        {
            id: 5,
            title: "Maratonista Literário",
            description: "Leia 5 histórias em um único dia",
            icon: "fas fa-running",
            tier: "gold",
            points: 40,
            progress: { current: 3, target: 5 },
            unlocked: false
        },
        {
            id: 6,
            title: "Colecionador de Histórias",
            description: "Adicione 20 histórias aos favoritos",
            icon: "fas fa-star",
            tier: "silver",
            points: 30,
            progress: { current: 12, target: 20 },
            unlocked: false
        }
    ],
    drawing: [
        {
            id: 7,
            title: "Artista Iniciante",
            description: "Crie seu primeiro desenho",
            icon: "fas fa-paint-brush",
            tier: "bronze",
            points: 10,
            progress: { current: 1, target: 1 },
            unlocked: true,
            unlockDate: "2023-02-05"
        },
        {
            id: 8,
            title: "Mestre das Cores",
            description: "Use 20 cores diferentes em seus desenhos",
            icon: "fas fa-palette",
            tier: "silver",
            points: 25,
            progress: { current: 12, target: 20 },
            unlocked: false
        },
        {
            id: 9,
            title: "Produtivo",
            description: "Crie 15 desenhos",
            icon: "fas fa-bolt",
            tier: "silver",
            points: 30,
            progress: { current: 8, target: 15 },
            unlocked: false
        },
        {
            id: 10,
            title: "Artista Versátil",
            description: "Crie desenhos em 5 categorias diferentes",
            icon: "fas fa-shapes",
            tier: "gold",
            points: 40,
            progress: { current: 2, target: 5 },
            unlocked: false
        },
        {
            id: 11,
            title: "Perfeccionista",
            description: "Edite um desenho 10 vezes",
            icon: "fas fa-magic",
            tier: "gold",
            points: 35,
            progress: { current: 4, target: 10 },
            unlocked: false
        },
        {
            id: 12,
            title: "Mestre do Desenho",
            description: "Crie 50 desenhos",
            icon: "fas fa-crown",
            tier: "platinum",
            points: 100,
            progress: { current: 8, target: 50 },
            unlocked: false
        }
    ],
    creation: [
        {
            id: 13,
            title: "Contador de Histórias",
            description: "Crie sua primeira história",
            icon: "fas fa-feather",
            tier: "bronze",
            points: 15,
            progress: { current: 1, target: 1 },
            unlocked: true,
            unlockDate: "2023-05-20"
        },
        {
            id: 14,
            title: "Autor Publicado",
            description: "Crie 5 histórias",
            icon: "fas fa-book",
            tier: "silver",
            points: 30,
            progress: { current: 3, target: 5 },
            unlocked: false
        },
        {
            id: 15,
            title: "Ilustrador",
            description: "Adicione ilustrações a 3 histórias",
            icon: "fas fa-paint-brush",
            tier: "silver",
            points: 25,
            progress: { current: 1, target: 3 },
            unlocked: false
        },
        {
            id: 16,
            title: "Escritor Profissional",
            description: "Crie 20 histórias",
            icon: "fas fa-pen-fancy",
            tier: "gold",
            points: 60,
            progress: { current: 3, target: 20 },
            unlocked: false
        },
        {
            id: 17,
            title: "Best-seller",
            description: "Tenha uma história com mais de 100 leituras",
            icon: "fas fa-chart-line",
            tier: "gold",
            points: 50,
            progress: { current: 42, target: 100 },
            unlocked: false
        },
        {
            id: 18,
            title: "Lenda da Criação",
            description: "Crie 50 histórias com ilustrações",
            icon: "fas fa-medal",
            tier: "platinum",
            points: 150,
            progress: { current: 3, target: 50 },
            unlocked: false
        }
    ],
    community: [
        {
            id: 19,
            title: "Socializador",
            description: "Siga 5 artistas",
            icon: "fas fa-user-plus",
            tier: "bronze",
            points: 10,
            progress: { current: 3, target: 5 },
            unlocked: false
        },
        {
            id: 20,
            title: "Popular",
            description: "Conquiste 50 seguidores",
            icon: "fas fa-users",
            tier: "silver",
            points: 30,
            progress: { current: 24, target: 50 },
            unlocked: false
        },
        {
            id: 21,
            title: "Crítico Literário",
            description: "Deixe 10 comentários em histórias",
            icon: "fas fa-comment",
            tier: "silver",
            points: 20,
            progress: { current: 6, target: 10 },
            unlocked: false
        },
        {
            id: 22,
            title: "Embaixador ArtFlow",
            description: "Compartilhe 20 conteúdos nas redes sociais",
            icon: "fas fa-share-alt",
            tier: "gold",
            points: 40,
            progress: { current: 8, target: 20 },
            unlocked: false
        },
        {
            id: 23,
            title: "Lenda da Comunidade",
            description: "Tenha 500 seguidores",
            icon: "fas fa-star",
            tier: "platinum",
            points: 100,
            progress: { current: 24, target: 500 },
            unlocked: false
        },
        {
            id: 24,
            title: "Colecionador de Fãs",
            description: "Tenha uma história com 50 favoritos",
            icon: "fas fa-heart",
            tier: "gold",
            points: 45,
            progress: { current: 12, target: 50 },
            unlocked: false
        }
    ]
};

// Função para inicializar a página de conquistas
function initAchievementsPage() {
    // Configurar tabs
    setupAchievementsTabs();

    // Carregar conquistas
    loadAchievements('all');

    // Configurar eventos
    setupAchievementsEvents();
}

// Configurar as abas de conquistas
function setupAchievementsTabs() {
    const tabs = document.querySelectorAll('.achievements-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Adicionar classe active à tab clicada
            tab.classList.add('active');

            // Esconder todas as categorias
            document.querySelectorAll('.achievements-category').forEach(category => {
                category.classList.remove('active');
            });

            // Mostrar a categoria correspondente
            const tabId = tab.getAttribute('data-tab');
            if (tabId === 'all') {
                document.getElementById('all-category').classList.add('active');
                loadAchievements('all');
            } else {
                document.getElementById(`${tabId}-category`).classList.add('active');
                loadAchievements(tabId);
            }
        });
    });
}

// Carregar conquistas
function loadAchievements(category) {
    let achievementsToShow = [];

    if (category === 'all') {
        // Combinar todas as conquistas
        Object.values(achievementsData).forEach(cat => {
            achievementsToShow = achievementsToShow.concat(cat);
        });
    } else {
        achievementsToShow = achievementsData[category] || [];
    }

    // Ordenar: desbloqueadas primeiro, depois por tier e pontos
    achievementsToShow.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1;
        if (!a.unlocked && b.unlocked) return 1;

        // Ordenar por tier: platinum > gold > silver > bronze
        const tierOrder = { platinum: 4, gold: 3, silver: 2, bronze: 1 };
        if (tierOrder[a.tier] !== tierOrder[b.tier]) {
            return tierOrder[b.tier] - tierOrder[a.tier];
        }

        // Ordenar por pontos
        return b.points - a.points;
    });

    // Limpar e preencher o grid
    const gridId = category === 'all' ? 'all-achievements' : `${category}-achievements`;
    const grid = document.getElementById(gridId);

    if (!grid) return;

    grid.innerHTML = '';

    if (achievementsToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-trophy"></i>
                <h3>Nenhuma conquista encontrada</h3>
                <p>Continue explorando o ArtFlow para desbloquear conquistas incríveis!</p>
            </div>
        `;
        return;
    }

    achievementsToShow.forEach(achievement => {
        const achievementElement = createAchievementElement(achievement);
        grid.appendChild(achievementElement);
    });
}

// Criar elemento de conquista
function createAchievementElement(achievement) {
    const element = document.createElement('div');
    element.className = `achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`;

    const progressPercentage = achievement.unlocked ? 100 :
        Math.min(100, (achievement.progress.current / achievement.progress.target) * 100);

    element.innerHTML = `
        <div class="achievement-header">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-title">
                <h4>${achievement.title}</h4>
                <span class="achievement-tier tier-${achievement.tier}">${achievement.tier}</span>
            </div>
        </div>
        
        <p class="achievement-description">${achievement.description}</p>
        
        ${!achievement.unlocked ? `
            <div class="achievement-progress">
                <div class="progress-mini">
                    <div class="progress-mini-fill" style="width: ${progressPercentage}%"></div>
                </div>
                <div class="progress-text-mini">
                    ${achievement.progress.current}/${achievement.progress.target}
                </div>
            </div>
        ` : ''}
        
        <div class="achievement-footer">
            ${achievement.unlocked ? `
                <span class="achievement-date">Conquistado em: ${formatDate(achievement.unlockDate)}</span>
            ` : `
                <span class="achievement-date">Continue tentando!</span>
            `}
            <span class="achievement-points">
                <i class="fas fa-star"></i> ${achievement.points}
            </span>
        </div>
    `;

    return element;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Configurar eventos
function setupAchievementsEvents() {
    // Efeito de hover nas conquistas
    const achievements = document.querySelectorAll('.achievement-card');

    achievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 15px 30px rgba(255, 215, 0, 0.1)';
        });

        achievement.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    initAchievementsPage();

    // Garantir que as bolinhas flutuantes sejam criadas
    if (typeof createFloatingShapes === 'function') {
        createFloatingShapes();
    }

    // Configurar acessibilidade
    if (typeof setupAccessibility === 'function') {
        setupAccessibility();
    }
});