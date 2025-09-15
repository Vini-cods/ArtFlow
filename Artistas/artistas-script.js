// Dados dos artistas (simulando uma base de dados)
const artistsData = [
    {
        id: 1,
        name: "Ana Silva",
        age: 32,
        type: "pro",
        specialty: "illustration",
        avatar: "./img/artists/artist1.jpg",
        cover: "./img/covers/cover1.jpg",
        bio: "Ilustradora profissional com mais de 10 anos de experiência, especializada em livros infantis. Formada em Belas Artes e apaixonada por criar mundos mágicos para crianças.",
        followers: 15234,
        works: 243,
        likes: 56789,
        isFollowing: false,
        gallery: [
            "./img/gallery/art1.jpg",
            "./img/gallery/art2.jpg",
            "./img/gallery/art3.jpg",
            "./img/gallery/art4.jpg",
            "./img/gallery/art5.jpg",
            "./img/gallery/art6.jpg"
        ]
    },
    {
        id: 2,
        name: "Pedro Almeida",
        age: 8,
        type: "kids",
        specialty: "cartoon",
        avatar: "./img/artists/kid1.jpg",
        cover: "./img/covers/cover2.jpg",
        bio: "Adoro desenhar dinossauros e naves espaciais! Meus heróis favoritos são o Astronauta Lucas e a Dino Amiga Lila. Quero ser um grande artista quando crescer!",
        followers: 2567,
        works: 45,
        likes: 12890,
        isFollowing: true,
        gallery: [
            "./img/gallery/kid1.jpg",
            "./img/gallery/kid2.jpg",
            "./img/gallery/kid3.jpg",
            "./img/gallery/kid4.jpg"
        ]
    },
    {
        id: 3,
        name: "Carlos Mendes",
        age: 40,
        type: "pro",
        specialty: "painting",
        avatar: "./img/artists/artist2.jpg",
        cover: "./img/covers/cover3.jpg",
        bio: "Pintor expressionista com foco em arte educativa para crianças. Ministro workshops e aulas de arte para jovens talentos. Acredito que a arte transforma vidas.",
        followers: 8765,
        works: 187,
        likes: 43210,
        isFollowing: false,
        gallery: [
            "./img/gallery/paint1.jpg",
            "./img/gallery/paint2.jpg",
            "./img/gallery/paint3.jpg",
            "./img/gallery/paint4.jpg",
            "./img/gallery/paint5.jpg"
        ]
    },
    {
        id: 4,
        name: "Sophia Rodrigues",
        age: 7,
        type: "kids",
        specialty: "digital",
        avatar: "./img/artists/kid2.jpg",
        cover: "./img/covers/cover4.jpg",
        bio: "Amo criar personagens coloridos e histórias sobre amizade. Minha mãe me ajuda a digitalizar meus desenhos. Meus animais favoritos são unicórnios e golfinhos!",
        followers: 1890,
        works: 32,
        likes: 8750,
        isFollowing: false,
        gallery: [
            "./img/gallery/sophia1.jpg",
            "./img/gallery/sophia2.jpg",
            "./img/gallery/sophia3.jpg"
        ]
    },
    {
        id: 5,
        name: "Mariana Costa",
        age: 28,
        type: "educator",
        specialty: "storytelling",
        avatar: "./img/artists/artist3.jpg",
        cover: "./img/covers/cover5.jpg",
        bio: "Educadora artística e contadora de histórias. Desenvolvo métodos criativos para ensinar arte para crianças através de narrativas visuais. Mestra em Educação Artística.",
        followers: 6543,
        works: 132,
        likes: 29876,
        isFollowing: true,
        gallery: [
            "./img/gallery/edu1.jpg",
            "./img/gallery/edu2.jpg",
            "./img/gallery/edu3.jpg",
            "./img/gallery/edu4.jpg"
        ]
    },
    {
        id: 6,
        name: "Lucas Oliveira",
        age: 9,
        type: "kids",
        specialty: "cartoon",
        avatar: "./img/artists/kid3.jpg",
        cover: "./img/covers/cover6.jpg",
        bio: "Desenho super-heróis e personagens de jogos. Participo de aulas de arte aos sábados e adoro compartilhar meus desenhos com meus amigos!",
        followers: 3210,
        works: 67,
        likes: 15670,
        isFollowing: false,
        gallery: [
            "./img/gallery/lucas1.jpg",
            "./img/gallery/lucas2.jpg",
            "./img/gallery/lucas3.jpg",
            "./img/gallery/lucas4.jpg"
        ]
    },
    {
        id: 7,
        name: "Ricardo Santos",
        age: 45,
        type: "pro",
        specialty: "digital",
        avatar: "./img/artists/artist4.jpg",
        cover: "./img/covers/cover7.jpg",
        bio: "Artista digital e designer de personagens para animação infantil. Já trabalhei em diversos projetos de TV e cinema. Apaixonado por criar universos visuais encantadores.",
        followers: 21890,
        works: 324,
        likes: 98765,
        isFollowing: false,
        gallery: [
            "./img/gallery/digital1.jpg",
            "./img/gallery/digital2.jpg",
            "./img/gallery/digital3.jpg",
            "./img/gallery/digital4.jpg",
            "./img/gallery/digital5.jpg",
            "./img/gallery/digital6.jpg"
        ]
    },
    {
        id: 8,
        name: "Isabela Ferreira",
        age: 10,
        type: "kids",
        specialty: "painting",
        avatar: "./img/artists/kid4.jpg",
        cover: "./img/covers/cover8.jpg",
        bio: "Gosto de pintar paisagens e flores com muitas cores. Minha avó é pintora e me ensina técnicas legais. Quero ter minha própria exposição um dia!",
        followers: 2987,
        works: 53,
        likes: 13450,
        isFollowing: true,
        gallery: [
            "./img/gallery/isabela1.jpg",
            "./img/gallery/isabela2.jpg",
            "./img/gallery/isabela3.jpg"
        ]
    }
];

// Variáveis globais
let currentArtists = [...artistsData];
let displayedArtists = 8;
let activeFilters = {
    type: "all",
    specialty: "all",
    age: "all"
};

// Inicialização da página
document.addEventListener("DOMContentLoaded", function () {
    initializeFloatingShapes();
    renderArtists();
    setupEventListeners();
    updateResultsCounter();
});

// Inicializar as bolinhas flutuantes
function initializeFloatingShapes() {
    const shapesContainer = document.querySelector(".floating-shapes");
    const colors = ["purple", "gold"];

    for (let i = 0; i < 15; i++) {
        const shape = document.createElement("div");
        shape.classList.add("floating-shape");
        shape.classList.add(colors[Math.floor(Math.random() * colors.length)]);

        // Posição e tamanho aleatórios
        const size = Math.random() * 40 + 20;
        shape.style.width = `${size}px`;
        shape.style.height = `${size}px`;
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDuration = `${Math.random() * 20 + 10}s`;
        shape.style.animationDelay = `${Math.random() * 5}s`;

        shapesContainer.appendChild(shape);
    }
}

// Renderizar os artistas no grid
function renderArtists() {
    const artistsGrid = document.getElementById("artistsGrid");
    artistsGrid.innerHTML = "";

    const artistsToShow = currentArtists.slice(0, displayedArtists);

    if (artistsToShow.length === 0) {
        artistsGrid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <h3>Nenhum artista encontrado</h3>
        <p>Tente ajustar os filtros para ver mais resultados.</p>
      </div>
    `;
        return;
    }

    artistsToShow.forEach(artist => {
        const artistCard = createArtistCard(artist);
        artistsGrid.appendChild(artistCard);
    });

    // Mostrar ou esconder o botão "Carregar Mais"
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (displayedArtists >= currentArtists.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "block";
    }
}

// Criar o card de um artista
function createArtistCard(artist) {
    const card = document.createElement("div");
    card.classList.add("artist-card");
    card.dataset.id = artist.id;

    // Determinar a classe do tipo de artista
    let typeClass = "";
    let typeText = "";

    switch (artist.type) {
        case "kids":
            typeClass = "kids";
            typeText = "Artista Kids";
            break;
        case "pro":
            typeClass = "pro";
            typeText = "Profissional";
            break;
        case "educator":
            typeClass = "educator";
            typeText = "Educador";
            break;
    }

    // Formatar números para exibição
    const formattedFollowers = formatNumber(artist.followers);
    const formattedWorks = formatNumber(artist.works);
    const formattedLikes = formatNumber(artist.likes);

    card.innerHTML = `
    <div class="artist-header">
      <span class="artist-type ${typeClass}">${typeText}</span>
      <img src="${artist.avatar}" alt="${artist.name}">
    </div>
    <div class="artist-details">
      <h3>${artist.name}</h3>
      <p>${getSpecialtyText(artist.specialty)}</p>
      <div class="artist-stats">
        <div class="artist-stat">
          <span class="stat-number">${formattedFollowers}</span>
          <span class="stat-label">Seguidores</span>
        </div>
        <div class="artist-stat">
          <span class="stat-number">${formattedWorks}</span>
          <span class="stat-label">Obras</span>
        </div>
      </div>
      <button class="follow-btn ${artist.isFollowing ? 'following' : ''}" data-id="${artist.id}">
        ${artist.isFollowing ? 'Seguindo' : 'Seguir'}
      </button>
    </div>
  `;

    return card;
}

// Obter texto da especialidade
function getSpecialtyText(specialty) {
    const specialties = {
        illustration: "Ilustração",
        painting: "Pintura",
        digital: "Arte Digital",
        cartoon: "Cartoon",
        storytelling: "Contador de Histórias"
    };

    return specialties[specialty] || "Artista";
}

// Formatar números para exibição (K, M)
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Configurar os event listeners
function setupEventListeners() {
    // Filtros de tipo
    document.querySelectorAll('[data-type]').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('[data-type]').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            activeFilters.type = filter.dataset.type;
            filterArtists();
        });
    });

    // Filtros de especialidade
    document.querySelectorAll('[data-specialty]').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('[data-specialty]').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            activeFilters.specialty = filter.dataset.specialty;
            filterArtists();
        });
    });

    // Filtros de idade
    document.querySelectorAll('[data-age]').forEach(filter => {
        filter.addEventListener('click', () => {
            document.querySelectorAll('[data-age]').forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            activeFilters.age = filter.dataset.age;
            filterArtists();
        });
    });

    // Ordenação
    document.getElementById('sortArtists').addEventListener('change', function () {
        sortArtists(this.value);
    });

    // Pesquisa
    document.getElementById('searchInput').addEventListener('input', function () {
        searchArtists(this.value);
    });

    // Botão Carregar Mais
    document.getElementById('loadMoreBtn').addEventListener('click', function () {
        displayedArtists += 4;
        renderArtists();
    });

    // Botões de seguir nos cards
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('follow-btn')) {
            const artistId = parseInt(e.target.dataset.id);
            toggleFollowArtist(artistId);
        }
    });

    // Abrir modal ao clicar no card do artista
    document.addEventListener('click', function (e) {
        const artistCard = e.target.closest('.artist-card');
        if (artistCard) {
            const artistId = parseInt(artistCard.dataset.id);
            openArtistModal(artistId);
        }
    });

    // Fechar modal
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    document.getElementById('artistModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Botão de seguir no modal
    document.getElementById('modalFollowBtn').addEventListener('click', function () {
        const artistId = parseInt(this.dataset.id);
        if (artistId) {
            toggleFollowArtist(artistId);
            // Atualizar o modal após seguir/desseguir
            openArtistModal(artistId);
        }
    });
}

// Filtrar artistas com base nos filtros ativos
function filterArtists() {
    currentArtists = artistsData.filter(artist => {
        // Filtro por tipo
        if (activeFilters.type !== 'all' && artist.type !== activeFilters.type) {
            return false;
        }

        // Filtro por especialidade
        if (activeFilters.specialty !== 'all' && artist.specialty !== activeFilters.specialty) {
            return false;
        }

        // Filtro por idade
        if (activeFilters.age !== 'all') {
            if (activeFilters.age === 'adult' && artist.type !== 'kids') {
                return true;
            }

            if (activeFilters.age !== 'adult') {
                const [minAge, maxAge] = activeFilters.age.split('-').map(Number);
                if (artist.type === 'kids' && (artist.age < minAge || artist.age > maxAge)) {
                    return false;
                }

                if (artist.type !== 'kids' && activeFilters.age !== 'adult') {
                    return false;
                }
            }
        }

        return true;
    });

    displayedArtists = 8;
    renderArtists();
    updateResultsCounter();
}

// Ordenar artistas
function sortArtists(criteria) {
    switch (criteria) {
        case 'popular':
            currentArtists.sort((a, b) => b.followers - a.followers);
            break;
        case 'recent':
            // Simulando artistas mais recentes (adicionados por último)
            currentArtists.sort((a, b) => b.id - a.id);
            break;
        case 'kids':
            currentArtists.sort((a, b) => {
                if (a.type === 'kids' && b.type !== 'kids') return -1;
                if (a.type !== 'kids' && b.type === 'kids') return 1;
                return 0;
            });
            break;
        case 'pro':
            currentArtists.sort((a, b) => {
                if (a.type === 'pro' && b.type !== 'pro') return -1;
                if (a.type !== 'pro' && b.type === 'pro') return 1;
                return 0;
            });
            break;
        case 'az':
            currentArtists.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'za':
            currentArtists.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    renderArtists();
}

// Pesquisar artistas
function searchArtists(query) {
    if (!query) {
        currentArtists = [...artistsData];
        filterArtists();
        return;
    }

    const searchTerm = query.toLowerCase();
    currentArtists = artistsData.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm) ||
        getSpecialtyText(artist.specialty).toLowerCase().includes(searchTerm) ||
        artist.bio.toLowerCase().includes(searchTerm)
    );

    displayedArtists = 8;
    renderArtists();
    updateResultsCounter();
}

// Atualizar contador de resultados
function updateResultsCounter() {
    document.getElementById('resultsCount').textContent = currentArtists.length;
}

// Alternar seguir/desseguir artista
function toggleFollowArtist(artistId) {
    const artist = artistsData.find(a => a.id === artistId);
    if (artist) {
        artist.isFollowing = !artist.isFollowing;
        if (artist.isFollowing) {
            artist.followers++;
        } else {
            artist.followers--;
        }

        // Atualizar o botão no card
        const followBtn = document.querySelector(`.follow-btn[data-id="${artistId}"]`);
        if (followBtn) {
            followBtn.classList.toggle('following');
            followBtn.textContent = artist.isFollowing ? 'Seguindo' : 'Seguir';
        }

        // Se o modal estiver aberto para este artista, atualizá-lo também
        const modal = document.getElementById('artistModal');
        if (modal.classList.contains('active')) {
            const modalArtistId = parseInt(document.getElementById('modalFollowBtn').dataset.id);
            if (modalArtistId === artistId) {
                openArtistModal(artistId);
            }
        }
    }
}

// Abrir modal do artista
function openArtistModal(artistId) {
    const artist = artistsData.find(a => a.id === artistId);
    if (!artist) return;

    // Preencher informações do modal
    document.getElementById('modalArtistName').textContent = artist.name;
    document.getElementById('modalArtistImage').src = artist.avatar;

    // Tipo do artista
    const typeBadge = document.getElementById('modalArtistType');
    let typeText = "";
    let typeClass = "";

    switch (artist.type) {
        case "kids":
            typeText = "Artista Kids";
            typeClass = "kids";
            break;
        case "pro":
            typeText = "Artista Profissional";
            typeClass = "pro";
            break;
        case "educator":
            typeText = "Educador Artístico";
            typeClass = "educator";
            break;
    }

    typeBadge.textContent = typeText;
    typeBadge.className = `artist-type-badge ${typeClass}`;

    // Especialidade
    document.getElementById('modalArtistSpecialty').textContent = getSpecialtyText(artist.specialty);

    // Estatísticas
    document.getElementById('modalFollowers').textContent = formatNumber(artist.followers);
    document.getElementById('modalWorks').textContent = formatNumber(artist.works);
    document.getElementById('modalLikes').textContent = formatNumber(artist.likes);

    // Biografia
    document.getElementById('modalArtistBio').textContent = artist.bio;

    // Botão de seguir
    const followBtn = document.getElementById('modalFollowBtn');
    followBtn.dataset.id = artist.id;
    followBtn.innerHTML = artist.isFollowing ?
        '<i class="fas fa-check"></i> Seguindo' :
        '<i class="fas fa-plus"></i> Seguir';
    followBtn.className = `modal-button follow-btn-modal${artist.isFollowing ? ' following' : ''}`;

    // Galeria
    const galleryGrid = document.getElementById('modalGallery');
    galleryGrid.innerHTML = "";

    artist.gallery.forEach(imageSrc => {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');
        galleryItem.innerHTML = `<img src="${imageSrc}" alt="Obra de ${artist.name}">`;
        galleryGrid.appendChild(galleryItem);
    });

    // Mostrar o modal
    document.getElementById('artistModal').classList.add('active');
}

// Fechar modal
function closeModal() {
    document.getElementById('artistModal').classList.remove('active');
}