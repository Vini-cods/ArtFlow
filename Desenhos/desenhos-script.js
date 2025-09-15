// Dados dos desenhos (simulando um banco de dados)
const drawingsData = [
    {
        id: 1,
        title: "Meu Dragão Amigo",
        artist: "João, 8 anos",
        artistImg: "./img/img/kid12.png",
        category: "fantasy",
        colors: ["red", "yellow"],
        image: "./img/Meu Dragão Amigo.png",
        likes: 42,
        views: 128,
        date: "3 dias atrás",
        description: "Desenhei meu dragão de estimação chamado Faísca. Ele cospe fogo colorido e adora brincar comigo no parque.",
        tags: ["Dragão", "Animal de Estimação", "Fantasia", "Cores"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 2,
        title: "Castelo Colorido",
        artist: "Maria, 7 anos",
        artistImg: "./img/img/kid17.png",
        category: "fantasy",
        colors: ["blue", "yellow", "red"],
        image: "./img/castelo colorido.png",
        likes: 37,
        views: 95,
        date: "5 dias atrás",
        description: "Este é o castelo onde a princesa Aurora mora. Tem quartos coloridos e um jardim com flores que cantam.",
        tags: ["Castelo", "Princesa", "Cores", "Fantasia"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 3,
        title: "Família de Ursos",
        artist: "Pedro, 6 anos",
        artistImg: "./img/img/kid18.png",
        category: "animals",
        colors: ["brown", "green"],
        image: "./img/familia de ursos.png",
        likes: 29,
        views: 76,
        date: "1 semana atrás",
        description: "A família urso em seu picnic na floresta. Eles estão comendo mel and frutas silvestres.",
        tags: ["Ursos", "Família", "Natureza", "Animais"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 4,
        title: "Robô do Futuro",
        artist: "Breno, 7 anos",
        artistImg: "./img/img/kid5.png",
        category: "objects",
        colors: ["blue", "silver"],
        image: "./img/robo.jpg",
        likes: 53,
        views: 142,
        date: "2 dias atrás",
        description: "Este é o Robô 3000, ele pode voar e tem laser nos olhos. É meu protetor pessoal!",
        tags: ["Robô", "Futuro", "Tecnologia", "Invenção"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 5,
        title: "Fada da Floresta",
        artist: "Ana, 9 anos",
        artistImg: "./img/img/kid16.png",
        category: "fantasy",
        colors: ["green", "pink"],
        image: "./img/fada.webp",
        likes: 67,
        views: 189,
        date: "4 dias atrás",
        description: "Esta é a fada Lúmen, ela protege a floresta e usa poeira mágica para fazer as flores crescerem.",
        tags: ["Fada", "Floresta", "Magia", "Natureza"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 6,
        title: "Foguete Espacial",
        artist: "Carlos, 8 anos",
        artistImg: "./img/img/kid8.png",
        category: "objects",
        colors: ["white", "red"],
        image: "./img/foguete.jfif",
        likes: 38,
        views: 112,
        date: "6 dias atrás",
        description: "Meu foguete viaja até Plutão em 5 minutos. Ele tem turbo propulsores e janelas anti-meteoro.",
        tags: ["Foguete", "Espaço", "Viagem", "Aventura"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 7,
        title: "Princesa da Floresta",
        artist: "Sofia, 7 anos",
        artistImg: "./img/img/kid13.png",
        category: "people",
        colors: ["pink", "green"],
        image: "./img/princesa.jpg",
        likes: 74,
        views: 203,
        date: "1 dia atrás",
        description: "A princesa Elara vive na floresta encantada e conversa com os animais. Seu vestido é feito de pétalas de flor.",
        tags: ["Princesa", "Floresta", "Animais", "Natureza"],
        isLiked: false,
        isFollowing: false
    },
    {
        id: 8,
        title: "Viagem ao Espaço",
        artist: "Lucas, 9 anos",
        artistImg: "./img/img/kid21.png",
        category: "fantasy",
        colors: ["blue", "black", "yellow"],
        image: "./img/viagem.jpg",
        likes: 61,
        views: 175,
        date: "3 dias atrás",
        description: "Esta é a nave Estelar XJ-9, ela pode viajar mais rápido que a luz. Estamos indo explorar uma nova galáxia!",
        tags: ["Espaço", "Nave", "Estrelas", "Aventura"],
        isLiked: false,
        isFollowing: false
    }
];

// Variáveis globais
let currentDrawings = [...drawingsData];
let activeFilters = {
    category: 'all',
    color: 'all',
    sort: 'recent'
};

// Inicialização da página
document.addEventListener('DOMContentLoaded', function () {
    initializeFloatingShapes();
    initializeEventListeners();
    renderDrawings();
    updateResultsCounter();
});

// Inicializar as bolinhas flutuantes
function initializeFloatingShapes() {
    const container = document.querySelector('.floating-shapes');
    const colors = ['purple', 'gold'];

    for (let i = 0; i < 15; i++) {
        const shape = document.createElement('div');
        const size = Math.random() * 30 + 10;
        const color = colors[Math.floor(Math.random() * colors.length)];

        shape.classList.add('floating-shape', color);
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        shape.style.animationDuration = `${15 + Math.random() * 10}s`;

        shape.addEventListener('click', function () {
            this.style.opacity = '0';
            setTimeout(() => {
                this.style.opacity = '0.6';
            }, 1000);
        });

        container.appendChild(shape);
    }
}

// Inicializar os event listeners
function initializeEventListeners() {
    // Filtros de categoria
    document.querySelectorAll('.filter-option[data-category]').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.filter-option[data-category]').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            activeFilters.category = this.dataset.category;
            applyFiltersAndSort();
        });
    });

    // Filtros de cor
    document.querySelectorAll('.color-filter').forEach(filter => {
        filter.addEventListener('click', function () {
            document.querySelectorAll('.color-filter').forEach(f => {
                f.classList.remove('active');
            });
            this.classList.add('active');
            activeFilters.color = this.dataset.color;
            applyFiltersAndSort();
        });
    });

    // Filtros de ordenação
    document.querySelectorAll('.filter-option[data-sort]').forEach(option => {
        option.addEventListener('click', function () {
            document.querySelectorAll('.filter-option[data-sort]').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            activeFilters.sort = this.dataset.sort;
            applyFiltersAndSort();
        });
    });

    // Ordenação por select
    document.getElementById('sortDrawings').addEventListener('change', function () {
        activeFilters.sort = this.value;
        applyFiltersAndSort();
    });

    // Botão carregar mais
    document.getElementById('loadMoreBtn').addEventListener('click', function () {
        // Simular carregamento de mais desenhos
        this.textContent = 'Carregando...';
        this.disabled = true;

        setTimeout(() => {
            // Em uma implementação real, isso carregaria mais dados do servidor
            this.textContent = 'Carregar Mais Desenhos';
            this.disabled = false;
            alert('Mais desenhos carregados! Em uma implementação real, isso traria dados adicionais do servidor.');
        }, 1500);
    });

    // Modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('drawingModal').addEventListener('click', function (e) {
        if (e.target === this) closeModal();
    });

    // Pesquisa
    document.getElementById('searchInput').addEventListener('input', function () {
        applyFiltersAndSort();
    });

    // Botões de desafio
    document.querySelectorAll('.participate-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const challengeTitle = this.parentElement.querySelector('h4').textContent;
            alert(`Participando do desafio: ${challengeTitle}. Em uma implementação real, isso abriria a ferramenta de desenho.`);
        });
    });
}

// Aplicar filtros e ordenação
function applyFiltersAndSort() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    // Filtrar desenhos
    let filteredDrawings = drawingsData.filter(drawing => {
        // Filtro de busca
        const matchesSearch = searchTerm === '' ||
            drawing.title.toLowerCase().includes(searchTerm) ||
            drawing.artist.toLowerCase().includes(searchTerm) ||
            drawing.description.toLowerCase().includes(searchTerm) ||
            drawing.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        // Filtro de categoria
        const matchesCategory = activeFilters.category === 'all' || drawing.category === activeFilters.category;

        // Filtro de cor
        const matchesColor = activeFilters.color === 'all' || drawing.colors.includes(activeFilters.color);

        return matchesSearch && matchesCategory && matchesColor;
    });

    // Ordenar desenhos
    switch (activeFilters.sort) {
        case 'popular':
            filteredDrawings.sort((a, b) => b.views - a.views);
            break;
        case 'likes':
            filteredDrawings.sort((a, b) => b.likes - a.likes);
            break;
        case 'az':
            filteredDrawings.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'za':
            filteredDrawings.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'recent':
        default:
            // Ordem padrão (por ID, simulando data)
            filteredDrawings.sort((a, b) => b.id - a.id);
            break;
    }

    currentDrawings = filteredDrawings;
    renderDrawings();
    updateResultsCounter();
}

// Renderizar desenhos
function renderDrawings() {
    const grid = document.getElementById('drawingsGrid');
    grid.innerHTML = '';

    if (currentDrawings.length === 0) {
        grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-paint-brush" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>Nenhum desenho encontrado</h3>
        <p>Tente ajustar os filtros ou termos de pesquisa</p>
      </div>
    `;
        return;
    }

    currentDrawings.forEach(drawing => {
        const drawingCard = document.createElement('div');
        drawingCard.classList.add('drawing-card');
        drawingCard.innerHTML = `
      <img src="${drawing.image}" alt="${drawing.title}" class="drawing-image">
      <div class="drawing-info">
        <h3 class="drawing-title">${drawing.title}</h3>
        <p class="drawing-artist">Por ${drawing.artist}</p>
        <div class="drawing-stats">
          <span><i class="fas fa-heart"></i> ${drawing.likes}</span>
          <span><i class="fas fa-eye"></i> ${drawing.views}</span>
          <span>${drawing.date}</span>
        </div>
        <div class="drawing-actions">
          <span class="drawing-action" onclick="openDrawingModal(${drawing.id})">
            <i class="fas fa-expand"></i> Ampliar
          </span>
          <span class="drawing-action" onclick="toggleLike(${drawing.id}, event)">
            <i class="${drawing.isLiked ? 'fas' : 'far'} fa-heart"></i> Curtir
          </span>
        </div>
      </div>
    `;
        grid.appendChild(drawingCard);
    });
}

// Atualizar contador de resultados
function updateResultsCounter() {
    document.getElementById('resultsCount').textContent = currentDrawings.length;
}

// Abrir modal de detalhes do desenho
function openDrawingModal(drawingId) {
    const drawing = drawingsData.find(d => d.id === drawingId);
    if (!drawing) return;

    // Preencher modal com dados do desenho
    document.getElementById('modalDrawingTitle').textContent = drawing.title;
    document.getElementById('modalDrawingImage').src = drawing.image;
    document.getElementById('modalArtistImage').src = drawing.artistImg;
    document.getElementById('modalArtistName').textContent = drawing.artist;
    document.getElementById('modalArtistAge').textContent = drawing.artist.split(', ')[1];
    document.getElementById('modalViewsCount').textContent = drawing.views;
    document.getElementById('modalLikesCount').textContent = drawing.likes;
    document.getElementById('modalLikesCount2').textContent = drawing.likes;
    document.getElementById('modalDate').textContent = drawing.date;
    document.getElementById('modalDrawingDescription').textContent = drawing.description;

    // Preencher tags
    const tagsList = document.getElementById('modalTagsList');
    tagsList.innerHTML = '';
    drawing.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.classList.add('tag');
        tagElement.textContent = tag;
        tagsList.appendChild(tagElement);
    });

    // Configurar botões de ação
    const likeBtn = document.getElementById('modalLikeBtn');
    likeBtn.querySelector('i').className = drawing.isLiked ? 'fas fa-heart' : 'far fa-heart';
    likeBtn.classList.toggle('liked', drawing.isLiked);

    likeBtn.onclick = function () {
        toggleLike(drawingId);
        updateModalLikes(drawingId);
    };

    const followBtn = document.getElementById('modalFollowBtn');
    followBtn.textContent = drawing.isFollowing ? 'Seguindo' : 'Seguir';
    followBtn.classList.toggle('following', drawing.isFollowing);

    followBtn.onclick = function () {
        toggleFollow(drawingId);
        this.textContent = drawing.isFollowing ? 'Seguindo' : 'Seguir';
        this.classList.toggle('following', drawing.isFollowing);
    };

    document.getElementById('modalDownloadBtn').onclick = function () {
        downloadDrawing(drawing);
    };

    document.getElementById('modalShareBtn').onclick = function () {
        shareDrawing(drawing);
    };

    document.getElementById('modalDrawInspiredBtn').onclick = function () {
        drawInspired(drawing);
    };

    document.getElementById('modalCommentBtn').onclick = function () {
        showComments(drawing);
    };

    // Exibir modal
    document.getElementById('drawingModal').classList.add('active');
}

// Fechar modal
function closeModal() {
    document.getElementById('drawingModal').classList.remove('active');
}

// Atualizar likes no modal
function updateModalLikes(drawingId) {
    const drawing = drawingsData.find(d => d.id === drawingId);
    if (!drawing) return;

    document.getElementById('modalLikesCount').textContent = drawing.likes;
    document.getElementById('modalLikesCount2').textContent = drawing.likes;

    const likeBtn = document.getElementById('modalLikeBtn');
    likeBtn.querySelector('i').className = drawing.isLiked ? 'fas fa-heart' : 'far fa-heart';
    likeBtn.classList.toggle('liked', drawing.isLiked);
}

// Alternar like
function toggleLike(drawingId, event) {
    if (event) event.stopPropagation();

    const drawing = drawingsData.find(d => d.id === drawingId);
    if (drawing) {
        drawing.isLiked = !drawing.isLiked;
        drawing.likes += drawing.isLiked ? 1 : -1;
        renderDrawings();
    }
}

// Alternar follow
function toggleFollow(drawingId) {
    const drawing = drawingsData.find(d => d.id === drawingId);
    if (drawing) {
        drawing.isFollowing = !drawing.isFollowing;
    }
}

// Download do desenho
function downloadDrawing(drawing) {
    alert(`Iniciando download do desenho: ${drawing.title}. Em uma implementação real, isso baixaria a imagem.`);
}

// Compartilhar desenho
function shareDrawing(drawing) {
    alert(`Compartilhando o desenho: ${drawing.title}. Em uma implementação real, isso abriria opções de compartilhamento.`);
}

// Desenhar inspirado
function drawInspired(drawing) {
    alert(`Abrindo editor para criar um desenho inspirado em: ${drawing.title}. Em uma implementação real, isso abriria a ferramenta de desenho.`);
}

// Mostrar comentários
function showComments(drawing) {
    alert(`Mostrando comentários do desenho: ${drawing.title}. Em uma implementação real, isso exibiria os comentários.`);
}