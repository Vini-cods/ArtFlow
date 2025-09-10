// Gerenciar desenhos salvos
function loadDrawings() {
    const drawingsGrid = document.getElementById('drawingsGrid');
    const emptyState = document.getElementById('emptyState');
    const totalDrawings = document.getElementById('totalDrawings');
    const favoriteDrawings = document.getElementById('favoriteDrawings');
    const recentDrawings = document.getElementById('recentDrawings');

    // Recuperar desenhos do localStorage
    let drawings = JSON.parse(localStorage.getItem('artflow-drawings')) || [];

    // Atualizar estatísticas
    totalDrawings.textContent = drawings.length;
    favoriteDrawings.textContent = drawings.filter(d => d.favorite).length;

    // Calcular desenhos recentes (últimos 7 dias)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    recentDrawings.textContent = drawings.filter(d => new Date(d.date) > oneWeekAgo).length;

    // Limpar grid
    drawingsGrid.innerHTML = '';

    // Verificar se há desenhos
    if (drawings.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Ordenar desenhos (por padrão, mais recentes primeiro)
    drawings.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Adicionar desenhos ao grid
    drawings.forEach(drawing => {
        const drawingCard = createDrawingCard(drawing);
        drawingsGrid.appendChild(drawingCard);
    });
}

// Criar card de desenho
function createDrawingCard(drawing) {
    const card = document.createElement('div');
    card.className = 'drawing-card';
    card.dataset.id = drawing.id;
    card.dataset.title = drawing.title.toLowerCase();
    card.dataset.favorite = drawing.favorite;
    card.dataset.date = drawing.date;

    // Calcular dias desde a criação
    const createdDate = new Date(drawing.date);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isRecent = diffDays <= 7;

    card.innerHTML = `
        <div class="drawing-image">
            <img src="${drawing.image}" alt="${drawing.title}">
            ${drawing.favorite ? '<div class="drawing-badge badge-favorite">Favorito</div>' : ''}
            ${isRecent ? '<div class="drawing-badge badge-recent">Novo</div>' : ''}
            ${drawing.shared ? '<div class="drawing-badge badge-shared">Compartilhado</div>' : ''}
        </div>
        <div class="drawing-info">
            <h3 class="drawing-title">${drawing.title}</h3>
            <div class="drawing-meta">
                <div class="drawing-date">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(drawing.date)}</span>
                </div>
                <div class="drawing-size">
                    <i class="fas fa-expand"></i>
                    <span>${drawing.size}</span>
                </div>
            </div>
            <div class="drawing-actions">
                <div class="action-buttons">
                    <button class="action-btn" title="${drawing.favorite ? 'Desfavoritar' : 'Favoritar'}">
                        <i class="${drawing.favorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="action-btn" title="Compartilhar">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="action-btn" title="Mais opções">
                        <i class="fas fa-ellipsis-v"></i>
                    </button>
                </div>
                <button class="view-drawing-btn">Ver Desenho</button>
            </div>
        </div>
    `;

    // Adicionar event listeners
    const favoriteBtn = card.querySelector('.action-btn[title*="Favoritar"]');
    const shareBtn = card.querySelector('.action-btn[title="Compartilhar"]');
    const optionsBtn = card.querySelector('.action-btn[title="Mais opções"]');
    const viewBtn = card.querySelector('.view-drawing-btn');

    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(drawing.id);
    });

    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareDrawing(drawing.id);
    });

    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showDrawingOptions(drawing);
    });

    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        viewDrawing(drawing);
    });

    card.addEventListener('click', () => {
        showDrawingOptions(drawing);
    });

    return card;
}

// Alternar favorito
function toggleFavorite(drawingId) {
    let drawings = JSON.parse(localStorage.getItem('artflow-drawings')) || [];
    const drawingIndex = drawings.findIndex(d => d.id === drawingId);

    if (drawingIndex !== -1) {
        drawings[drawingIndex].favorite = !drawings[drawingIndex].favorite;
        localStorage.setItem('artflow-drawings', JSON.stringify(drawings));
        loadDrawings(); // Recarregar a lista
    }
}

// Compartilhar desenho
function shareDrawing(drawingId) {
    let drawings = JSON.parse(localStorage.getItem('artflow-drawings')) || [];
    const drawingIndex = drawings.findIndex(d => d.id === drawingId);

    if (drawingIndex !== -1) {
        drawings[drawingIndex].shared = true;
        localStorage.setItem('artflow-drawings', JSON.stringify(drawings));

        // Simular compartilhamento
        alert(`Desenho "${drawings[drawingIndex].title}" compartilhado com sucesso!`);
        loadDrawings(); // Recarregar a lista
    }
}

// Mostrar opções do desenho
function showDrawingOptions(drawing) {
    const modal = document.getElementById('drawingModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');

    modalTitle.textContent = drawing.title;
    modalImage.src = drawing.image;
    modalDescription.textContent = `Criado em: ${formatDate(drawing.date)} | Tamanho: ${drawing.size}`;

    // Configurar botões do modal
    document.getElementById('viewDrawingBtn').onclick = () => viewDrawing(drawing);
    document.getElementById('shareDrawingBtn').onclick = () => shareDrawing(drawing.id);
    document.getElementById('deleteDrawingBtn').onclick = () => deleteDrawing(drawing.id);

    modal.classList.add('active');
}

// Visualizar desenho
function viewDrawing(drawing) {
    // Abrir o desenho em uma nova aba
    window.open(drawing.image, '_blank');
}

// Excluir desenho
function deleteDrawing(drawingId) {
    if (confirm('Tem certeza que deseja excluir este desenho?')) {
        let drawings = JSON.parse(localStorage.getItem('artflow-drawings')) || [];
        drawings = drawings.filter(d => d.id !== drawingId);
        localStorage.setItem('artflow-drawings', JSON.stringify(drawings));

        // Fechar modal e recarregar a lista
        document.getElementById('drawingModal').classList.remove('active');
        loadDrawings();
    }
}

// Filtrar desenhos
function filterDrawings(filter) {
    const drawings = document.querySelectorAll('.drawing-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    drawings.forEach(drawing => {
        if (filter === 'all' ||
            (filter === 'favorites' && drawing.dataset.favorite === 'true') ||
            (filter === 'recent' && isRecent(drawing.dataset.date)) ||
            (filter === 'shared' && drawing.querySelector('.badge-shared'))) {
            drawing.style.display = 'block';
            visibleCount++;
        } else {
            drawing.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Verificar se é recente (últimos 7 dias)
function isRecent(dateString) {
    const createdDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
}

// Pesquisar desenhos
function searchDrawings(query) {
    const drawings = document.querySelectorAll('.drawing-card');
    const emptyState = document.getElementById('emptyState');
    let visibleCount = 0;

    drawings.forEach(drawing => {
        const title = drawing.dataset.title;
        if (title.includes(query.toLowerCase())) {
            drawing.style.display = 'block';
            visibleCount++;
        } else {
            drawing.style.display = 'none';
        }
    });

    if (visibleCount === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

// Ordenar desenhos
function sortDrawings(criteria) {
    const grid = document.getElementById('drawingsGrid');
    const drawings = Array.from(grid.querySelectorAll('.drawing-card'));

    drawings.sort((a, b) => {
        switch (criteria) {
            case 'title':
                return a.dataset.title.localeCompare(b.dataset.title);
            case 'favorites':
                return (b.dataset.favorite === 'true') - (a.dataset.favorite === 'true');
            case 'recent':
            default:
                return new Date(b.dataset.date) - new Date(a.dataset.date);
        }
    });

    drawings.forEach(drawing => grid.appendChild(drawing));
}

// Alternar visualização
function toggleView(view) {
    const grid = document.getElementById('drawingsGrid');
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Inicializar dados de exemplo (apenas para demonstração)
function initializeSampleData() {
    // Verificar se já existem dados
    if (!localStorage.getItem('artflow-drawings')) {
        const sampleDrawings = [
            {
                id: '1',
                title: 'Meu Dragão',
                image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
                date: new Date().toISOString(),
                size: '800x600',
                favorite: true,
                shared: false
            },
            {
                id: '2',
                title: 'Castelo Colorido',
                image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                size: '1024x768',
                favorite: false,
                shared: true
            },
            {
                id: '3',
                title: 'Família de Ursos',
                image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
                date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                size: '800x600',
                favorite: false,
                shared: false
            }
        ];

        localStorage.setItem('artflow-drawings', JSON.stringify(sampleDrawings));
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Inicializar dados de exemplo
    initializeSampleData();

    // Carregar desenhos
    loadDrawings();

    // Filtros
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterDrawings(this.dataset.filter);
        });
    });

    // Pesquisa
    document.getElementById('searchInput').addEventListener('input', function () {
        searchDrawings(this.value);
    });

    // Ordenação
    document.getElementById('sortSelect').addEventListener('change', function () {
        sortDrawings(this.value);
    });

    // Visualização
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            toggleView(this.dataset.view);
        });
    });

    // Modal
    const modal = document.getElementById('drawingModal');
    const closeModal = document.querySelector('.close-modal');

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Botão para começar a desenhar
    document.getElementById('startDrawingBtn').addEventListener('click', function () {
        window.location.href = '../Drawing/drawing.html';
    });
});