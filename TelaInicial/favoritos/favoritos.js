// Dados de exemplo para a página de favoritos
const favoriteData = {
    stories: [
        {
            id: 1,
            title: "Aventura na Floresta",
            author: "Sofia Mendes",
            image: "../img/Aventura na floresta.png",
            likes: 248,
            reads: 1200,
            category: "Aventura",
            addedDate: "2023-10-15"
        },
        {
            id: 2,
            title: "O Castelo Mágico",
            author: "Carlos Silva",
            image: "../img/O castelo magico.png",
            likes: 312,
            reads: 2400,
            category: "Fantasia",
            addedDate: "2023-09-22"
        },
        {
            id: 3,
            title: "Viagem ao Espaço",
            author: "Ana Costa",
            image: "../img/Viagem ao espaço.png",
            likes: 187,
            reads: 1800,
            category: "Ficção Científica",
            addedDate: "2023-11-05"
        }
    ],
    drawings: [
        {
            id: 1,
            title: "Meu Dragão Amigo",
            artist: "João, 8 anos",
            image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            likes: 42,
            addedDate: "2023-10-28"
        },
        {
            id: 2,
            title: "Castelo Colorido",
            artist: "Maria, 7 anos",
            image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80",
            likes: 37,
            addedDate: "2023-11-12"
        }
    ],
    artists: [
        {
            id: 1,
            name: "Sofia Mendes",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
            stories: 15,
            followers: 1240,
            isFollowing: true
        },
        {
            id: 2,
            name: "Carlos Silva",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
            stories: 8,
            followers: 876,
            isFollowing: true
        },
        {
            id: 3,
            name: "Ana Costa",
            avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
            stories: 12,
            followers: 1567,
            isFollowing: true
        }
    ]
};

// Função para inicializar a página de favoritos
function initFavoritesPage() {
    // Configurar tabs
    setupFavoritesTabs();

    // Carregar dados
    loadFavoriteStories();
    loadFavoriteDrawings();
    loadFavoriteArtists();

    // Configurar ordenação
    setupSorting();
}

// Configurar as abas de favoritos
function setupFavoritesTabs() {
    const tabs = document.querySelectorAll('.favorites-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover classe active de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Adicionar classe active à tab clicada
            tab.classList.add('active');

            // Esconder todos os conteúdos
            document.querySelectorAll('.favorites-content').forEach(content => {
                content.classList.remove('active');
            });

            // Mostrar o conteúdo correspondente
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
}

// Carregar histórias favoritas
function loadFavoriteStories(sortBy = 'recent') {
    const container = document.getElementById('favorite-stories');

    // Ordenar histórias
    let sortedStories = [...favoriteData.stories];

    switch (sortBy) {
        case 'recent':
            sortedStories.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            break;
        case 'oldest':
            sortedStories.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
            break;
        case 'popular':
            sortedStories.sort((a, b) => b.likes - a.likes);
            break;
    }

    // Limpar container
    container.innerHTML = '';

    // Verificar se há histórias
    if (sortedStories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-book-open"></i>
                <h3>Nenhuma história favoritada ainda</h3>
                <p>Explore nossas histórias e salve as que você mais gostar para encontrá-las facilmente aqui!</p>
                <button onclick="window.location.href='../index.html'">Explorar Histórias</button>
            </div>
        `;
        return;
    }

    // Adicionar histórias ao container
    sortedStories.forEach(story => {
        const storyElement = document.createElement('div');
        storyElement.className = 'favorite-item';
        storyElement.innerHTML = `
            <img src="${story.image}" alt="${story.title}" onerror="this.classList.add('image-error')">
            <div class="favorite-item-content">
                <h4 class="favorite-item-title">${story.title}</h4>
                <p class="favorite-item-author">Por: ${story.author}</p>
                <div class="favorite-item-actions">
                    <div class="favorite-item-stats">
                        <span class="favorite-item-stat"><i class="fas fa-heart"></i> ${story.likes}</span>
                        <span class="favorite-item-stat"><i class="fas fa-book-reader"></i> ${story.reads}</span>
                    </div>
                    <button class="favorite-item-remove" data-type="story" data-id="${story.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;

        // Adicionar evento de clique para abrir a história
        storyElement.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-item-remove')) {
                showStoryModal(story.title, story.author, story.image);
            }
        });

        container.appendChild(storyElement);
    });

    // Adicionar eventos de remoção
    setupRemoveButtons();
}

// Carregar desenhos favoritos
function loadFavoriteDrawings(sortBy = 'recent') {
    const container = document.getElementById('favorite-drawings');

    // Ordenar desenhos
    let sortedDrawings = [...favoriteData.drawings];

    switch (sortBy) {
        case 'recent':
            sortedDrawings.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
            break;
        case 'oldest':
            sortedDrawings.sort((a, b) => new Date(a.addedDate) - new Date(b.addedDate));
            break;
        case 'popular':
            sortedDrawings.sort((a, b) => b.likes - a.likes);
            break;
    }

    // Limpar container
    container.innerHTML = '';

    // Verificar se há desenhos
    if (sortedDrawings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paint-brush"></i>
                <h3>Nenhum desenho favoritado ainda</h3>
                <p>Explore os desenhos da comunidade e salve os que você mais gostar para encontrá-los facilmente aqui!</p>
                <button onclick="window.location.href='../index.html'">Explorar Desenhos</button>
            </div>
        `;
        return;
    }

    // Adicionar desenhos ao container
    sortedDrawings.forEach(drawing => {
        const drawingElement = document.createElement('div');
        drawingElement.className = 'drawing-item';
        drawingElement.innerHTML = `
            <img src="${drawing.image}" alt="${drawing.title}" onerror="this.classList.add('image-error')">
            <div class="drawing-info">
                <h4>${drawing.title}</h4>
                <p>${drawing.artist}</p>
                <div class="drawing-actions">
                    <span class="drawing-stat"><i class="fas fa-heart"></i> ${drawing.likes}</span>
                    <button class="favorite-item-remove" data-type="drawing" data-id="${drawing.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(drawingElement);
    });

    // Adicionar eventos de remoção
    setupRemoveButtons();
}

// Carregar artistas favoritos
function loadFavoriteArtists() {
    const container = document.getElementById('favorite-artists');

    // Limpar container
    container.innerHTML = '';

    // Verificar se há artistas
    if (favoriteData.artists.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-friends"></i>
                <h3>Você não segue nenhum artista ainda</h3>
                <p>Explore os artistas da comunidade e siga os que você mais admira para acompanhar seu trabalho!</p>
                <button onclick="window.location.href='../index.html'">Explorar Artistas</button>
            </div>
        `;
        return;
    }

    // Adicionar artistas ao container
    favoriteData.artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.className = 'artist-card';
        artistElement.innerHTML = `
            <img src="${artist.avatar}" alt="${artist.name}" class="artist-avatar" onerror="this.src='https://via.placeholder.com/80?text=Avatar'">
            <h4 class="artist-name">${artist.name}</h4>
            <div class="artist-stats">
                <div class="artist-stat">
                    <span class="artist-stat-number">${artist.stories}</span>
                    <span class="artist-stat-label">Histórias</span>
                </div>
                <div class="artist-stat">
                    <span class="artist-stat-number">${artist.followers}</span>
                    <span class="artist-stat-label">Seguidores</span>
                </div>
            </div>
            <div class="artist-actions">
                <button class="artist-follow ${artist.isFollowing ? 'following' : ''}" data-id="${artist.id}">
                    ${artist.isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
            </div>
        `;

        container.appendChild(artistElement);
    });

    // Adicionar eventos de seguir/deixar de seguir
    setupFollowButtons();
}

// Configurar botões de remoção
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.favorite-item-remove');

    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();

            const type = this.getAttribute('data-type');
            const id = parseInt(this.getAttribute('data-id'));

            // Confirmar remoção
            if (confirm(`Tem certeza que deseja remover este item dos favoritos?`)) {
                // Remover item dos favoritos
                removeFromFavorites(type, id);

                // Recarregar a seção
                if (type === 'story') {
                    loadFavoriteStories(document.getElementById('stories-sort').value);
                } else if (type === 'drawing') {
                    loadFavoriteDrawings(document.getElementById('drawings-sort').value);
                }

                // Mostrar notificação
                showNotification('Item removido dos favoritos!');
            }
        });
    });
}

// Configurar botões de seguir
function setupFollowButtons() {
    const followButtons = document.querySelectorAll('.artist-follow');

    followButtons.forEach(button => {
        button.addEventListener('click', function () {
            const artistId = parseInt(this.getAttribute('data-id'));
            const artist = favoriteData.artists.find(a => a.id === artistId);

            if (artist) {
                artist.isFollowing = !artist.isFollowing;

                if (artist.isFollowing) {
                    this.textContent = 'Seguindo';
                    this.classList.add('following');
                    showNotification(`Agora você está seguindo ${artist.name}!`);
                } else {
                    this.textContent = 'Seguir';
                    this.classList.remove('following');
                    showNotification(`Você parou de seguir ${artist.name}.`);

                    // Se não está mais seguindo, remover da lista após um tempo
                    setTimeout(() => {
                        favoriteData.artists = favoriteData.artists.filter(a => a.id !== artistId);
                        loadFavoriteArtists();
                    }, 3000);
                }
            }
        });
    });
}

// Configurar opções de ordenação
function setupSorting() {
    const storySort = document.getElementById('stories-sort');
    const drawingSort = document.getElementById('drawings-sort');

    if (storySort) {
        storySort.addEventListener('change', function () {
            loadFavoriteStories(this.value);
        });
    }

    if (drawingSort) {
        drawingSort.addEventListener('change', function () {
            loadFavoriteDrawings(this.value);
        });
    }
}

// Função para remover item dos favoritos (simulação)
function removeFromFavorites(type, id) {
    if (type === 'story') {
        favoriteData.stories = favoriteData.stories.filter(story => story.id !== id);
    } else if (type === 'drawing') {
        favoriteData.drawings = favoriteData.drawings.filter(drawing => drawing.id !== id);
    }
}

// Inicializar a página quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function () {
    initFavoritesPage();

    // Garantir que as bolinhas flutuantes sejam criadas
    if (typeof createFloatingShapes === 'function') {
        createFloatingShapes();
    }

    // Configurar acessibilidade
    if (typeof setupAccessibility === 'function') {
        setupAccessibility();
    }
});