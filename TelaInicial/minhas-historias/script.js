// Criar bolinhas flutuantes interativas
function createFloatingShapes() {
    const container = document.querySelector(".floating-shapes");
    container.innerHTML = "";

    const shapeConfigs = [
        { size: 60, color: "purple", count: 8 },
        { size: 40, color: "gold", count: 6 },
        { size: 80, color: "purple", count: 4 },
        { size: 25, color: "gold", count: 10 },
        { size: 15, color: "purple", count: 15 },
    ];

    shapeConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
            const shape = document.createElement("div");
            shape.className = `floating-shape ${config.color}`;
            shape.style.width = config.size + "px";
            shape.style.height = config.size + "px";
            shape.style.left = Math.random() * 100 + "%";
            shape.style.top = Math.random() * 100 + "%";
            shape.style.animationDelay = Math.random() * 8 + "s";
            shape.style.animationDuration = `${8 + Math.random() * 4}s`;

            shape.addEventListener("mouseover", () => {
                shape.style.transform = "scale(1.2)";
                shape.style.opacity = "0.9";
            });

            shape.addEventListener("mouseout", () => {
                shape.style.transform = "scale(1)";
                shape.style.opacity = "0.6";
            });

            container.appendChild(shape);
        }
    });
}

// Filtrar histórias
function filterStories(filter) {
    const stories = document.querySelectorAll('.story-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    stories.forEach(story => {
        if (filter === 'all' || story.dataset.status === filter) {
            story.style.display = 'block';
            visibleCount++;
        } else {
            story.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Pesquisar histórias
function searchStories(query) {
    const stories = document.querySelectorAll('.story-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    stories.forEach(story => {
        const title = story.dataset.title.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            story.style.display = 'block';
            visibleCount++;
        } else {
            story.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Ordenar histórias
function sortStories(criteria) {
    const grid = document.getElementById('storiesGrid');
    const stories = Array.from(grid.querySelectorAll('.story-card'));

    stories.sort((a, b) => {
        switch (criteria) {
            case 'title':
                return a.dataset.title.localeCompare(b.dataset.title);
            case 'progress':
                const progressA = parseInt(a.querySelector('.progress-bar').style.width);
                const progressB = parseInt(b.querySelector('.progress-bar').style.width);
                return progressB - progressA;
            default:
                return 0;
        }
    });

    stories.forEach(story => grid.appendChild(story));
}

// Alternar visualização
function toggleView(view) {
    const grid = document.getElementById('storiesGrid');
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    createFloatingShapes();

    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterStories(this.dataset.filter);
        });
    });

    // Pesquisa
    document.getElementById('searchInput').addEventListener('input', function() {
        searchStories(this.value);
    });

    // Ordenação
    document.getElementById('sortSelect').addEventListener('change', function() {
        sortStories(this.value);
    });

    // Visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleView(this.dataset.view);
        });
    });

    // Modal
    const modal = document.getElementById('storyModal');
    const closeModal = document.querySelector('.close-modal');

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Ações dos cartões
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.title === 'Favoritar') {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    icon.style.color = '#ff4757';
                } else {
                    icon.classList.replace('fas', 'far');
                    icon.style.color = '';
                }
            } else if (this.title === 'Mais opções') {
                const card = this.closest('.story-card');
                const title = card.dataset.title;
                document.getElementById('modalTitle').textContent = `Opções: ${title}`;
                modal.classList.add('active');
            }
        });
    });

    // Botões de continuar/começar
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.story-card');
            const title = card.dataset.title;
            
            // Simular abertura da história
            alert(`Abrindo: ${title}`);
        });
    });
});