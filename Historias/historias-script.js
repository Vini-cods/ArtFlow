// Dados das histórias (simulando um banco de dados)
const storiesData = [
  {
    id: 1,
    title: "A Pequena Sereia",
    author: "Hans Christian Andersen",
    brand: "disney",
    category: "fantasy",
    age: "6-8",
    pages: 24,
    image: "./img/A pequena sereia.jpg",
    description: "Ariel, uma jovem sereia, sonha em deixar o oceano para viver no mundo dos humanos. Ela faz um acordo com a bruxa do mar Ursula para realizar seu sonho, mas acaba colocando seu pai e o reino em perigo.",
    isFavorite: false
  },
  {
    id: 2,
    title: "Shrek",
    author: "William Steig",
    brand: "dreamworks",
    category: "comedy",
    age: "6-8",
    pages: 32,
    image: "./img/sherek.jpg",
    description: "Shrek é um ogro solitário que vive em um pântano. Sua paz é interrompida quando criaturas de contos de fadas são banidas para suas terras por ordem do Lorde Farquaad. Para recuperar sua solidão, Shrek faz um acordo com Farquaad para resgatar a princesa Fiona.",
    isFavorite: false
  },
  {
    id: 3,
    title: "Toy Story",
    author: "John Lasseter",
    brand: "pixar",
    category: "adventure",
    age: "3-5",
    pages: 28,
    image: "./img/toy story.jpg",
    description: "Os brinquedos de Andy ganham vida quando não há humanos por perto. Woody, o cowboy, sempre foi o brinquedo favorito, até que Buzz Lightyear, um astronauta de brinquedo, chega e ameaça seu status. Eles precisam aprender a trabalhar juntos quando se perdem durante uma mudança.",
    isFavorite: false
  },
  {
    id: 4,
    title: "Procurando Nemo",
    author: "Andrew Stanton",
    brand: "pixar",
    category: "adventure",
    age: "3-5",
    pages: 36,
    image: "./img/nemo.jpg",
    description: "Marlin, um peixe-palhaço superprotetor, procura desesperadamente por seu filho Nemo, que foi capturado por um mergulhador. No processo, ele faz amizade com Dory, um peixe cirurgião com problemas de memória de curto prazo.",
    isFavorite: false
  },
  {
    id: 5,
    title: "Frozen",
    author: "Hans Christian Andersen",
    brand: "disney",
    category: "fantasy",
    age: "6-8",
    pages: 40,
    image: "./img/frozen.webp",
    description: "A princesa Elsa possui poderes mágicos que permitem criar gelo e neve. Após um acidente na infância, ela se isola para proteger sua irmã mais nova, Anna. Quando seus poderes são revelados ao reino, ela foge e acidentalmente mergulha Arendelle em um inverno eterno.",
    isFavorite: false
  },
  {
    id: 6,
    title: "Madagascar",
    author: "DreamWorks Animation",
    brand: "dreamworks",
    category: "comedy",
    age: "6-8",
    pages: 30,
    image: "./img/madagascar.jpg",
    description: "Quatro animais do Zoológico do Central Park - Alex, o leão; Marty, a zebra; Melman, a girafa; e Gloria, o hipopótamo - acabam acidentalmente enviados para Madagascar. Lá, eles descobrem como é a vida na natureza e encontram os excêntricos lêmures do local.",
    isFavorite: false
  },
  {
    id: 7,
    title: "Os Incríveis",
    author: "Brad Bird",
    brand: "pixar",
    category: "adventure",
    age: "9-12",
    pages: 42,
    image: "./img/incriveis.jpg",
    description: "Os Parr são uma família de super-heróis que tentam viver uma vida normal e tranquila em meio à sociedade. Quando um velho inimigo retorna, a família deve se unir mais uma vez para salvar o mundo.",
    isFavorite: false
  },
  {
    id: 8,
    title: "Rei Leão",
    author: "Irene Mecchi",
    brand: "disney",
    category: "adventure",
    age: "6-8",
    pages: 38,
    image: "./img/rei leao.jpg",
    description: "Simba, um jovem leão, herdeiro do trono de seu pai Mufasa, foge do reino após a morte do pai, da qual se sente culpado. Anos depois, ele precisa retornar para desafiar seu tio Scar, que assumiu o trono e mergulhou a Terra do Leão em escuridão.",
    isFavorite: false
  },
  {
    id: 9,
    title: "Como Treinar Seu Dragão",
    author: "Cressida Cowell",
    brand: "dreamworks",
    category: "adventure",
    age: "9-12",
    pages: 45,
    image: "./img/dragao.jpg",
    description: "Soluço, um jovem viking que não se encaixa na tradição guerreira de sua aldeia, faz amizade com um dragão ferido, Fúria da Noite. Juntos, eles desafiam as convenções e provam que dragões e vikings podem coexistir em paz.",
    isFavorite: false
  },
  {
    id: 10,
    title: "Carros",
    author: "John Lasseter",
    brand: "pixar",
    category: "adventure",
    age: "3-5",
    pages: 32,
    image: "./img/carros.jpg",
    description: "Relâmpago McQueen, um carro de corrida novato e arrogante, acaba preso na pequena cidade de Radiator Springs, onde aprende lições valiosas sobre amizade e prioridades na vida.",
    isFavorite: false
  },
  {
    id: 11,
    title: "A Bela e a Fera",
    author: "Gabrielle-Suzanne de Villeneuve",
    brand: "disney",
    category: "fantasy",
    age: "6-8",
    pages: 36,
    image: "./img/bela.jpg",
    description: "Bela, uma jovem inteligente e sonhadora, oferece sua liberdade em troca da de seu pai, que foi feito prisioneiro por uma Fera assustadora. No castelo encantado, ela descobre que a Fera não é quem aparenta ser.",
    isFavorite: false
  },
  {
    id: 12,
    title: "Kung Fu Panda",
    author: "DreamWorks Animation",
    brand: "dreamworks",
    category: "comedy",
    age: "6-8",
    pages: 34,
    image: "./img/panda.jpg",
    description: "Po, um panda desajeitado e fã de kung fu, é inexplicavelmente escolhido como o Guerreiro Dragão, destinado a proteger o Vale da Paz. Ele deve treinar com os Cinco Furiosos para enfrentar o malvado Tai Lung.",
    isFavorite: false
  }
];

// Variáveis globais
let currentStories = [...storiesData];
let activeFilters = {
  brand: 'all',
  category: 'all',
  age: 'all'
};
let sortBy = 'popular';

// Inicialização da página
document.addEventListener('DOMContentLoaded', function() {
  initializeFloatingShapes();
  initializeEventListeners();
  renderStories();
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
    
    shape.addEventListener('click', function() {
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
  // Filtros
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', function() {
      const filterType = this.parentElement.parentElement.classList.contains('filter-options') ? 
        this.parentElement.parentElement.previousElementSibling.textContent.toLowerCase() : '';
      
      if (filterType === 'marcas') {
        updateFilter('brand', this.dataset.filter);
      } else if (filterType === 'categorias') {
        updateFilter('category', this.dataset.category);
      } else if (filterType === 'idade') {
        updateFilter('age', this.dataset.age);
      }
    });
  });
  
  // Ordenação
  document.getElementById('sortStories').addEventListener('change', function() {
    sortBy = this.value;
    applyFiltersAndSort();
  });
  
  // Botão carregar mais
  document.getElementById('loadMoreBtn').addEventListener('click', function() {
    // Simular carregamento de mais histórias
    this.textContent = 'Carregando...';
    this.disabled = true;
    
    setTimeout(() => {
      // Em uma implementação real, isso carregaria mais dados do servidor
      this.textContent = 'Carregar Mais Histórias';
      this.disabled = false;
      alert('Mais histórias carregadas! Em uma implementação real, isso traria dados adicionais do servidor.');
    }, 1500);
  });
  
  // Modal
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  document.getElementById('storyModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  
  // Pesquisa
  document.getElementById('searchInput').addEventListener('input', function() {
    applyFiltersAndSort();
  });
  
  // Newsletter
  document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Inscrição realizada com sucesso! Você receberá novidades em breve.');
    this.reset();
  });
  
  // Footer form
  document.querySelector('.footer-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Obrigado por se inscrever em nossa newsletter!');
    this.reset();
  });
}

// Atualizar filtros
function updateFilter(type, value) {
  // Remover classe ativa de todas as opções do mesmo tipo
  document.querySelectorAll(`.filter-option[data-${type}]`).forEach(opt => {
    opt.classList.remove('active');
  });
  
  // Adicionar classe ativa à opção clicada
  document.querySelector(`.filter-option[data-${type}="${value}"]`).classList.add('active');
  
  // Atualizar filtro ativo
  activeFilters[type] = value;
  
  // Aplicar filtros e ordenação
  applyFiltersAndSort();
}

// Aplicar filtros e ordenação
function applyFiltersAndSort() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  // Filtrar histórias
  let filteredStories = storiesData.filter(story => {
    // Filtro de busca
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm) || 
      story.author.toLowerCase().includes(searchTerm) ||
      story.description.toLowerCase().includes(searchTerm);
    
    // Filtro de marca
    const matchesBrand = activeFilters.brand === 'all' || story.brand === activeFilters.brand;
    
    // Filtro de categoria
    const matchesCategory = activeFilters.category === 'all' || story.category === activeFilters.category;
    
    // Filtro de idade
    const matchesAge = activeFilters.age === 'all' || story.age === activeFilters.age;
    
    return matchesSearch && matchesBrand && matchesCategory && matchesAge;
  });
  
  // Ordenar histórias
  switch(sortBy) {
    case 'recent':
      filteredStories.sort((a, b) => b.id - a.id);
      break;
    case 'az':
      filteredStories.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'za':
      filteredStories.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'popular':
    default:
      // Ordem padrão (por popularidade simulada)
      break;
  }
  
  currentStories = filteredStories;
  renderStories();
  updateResultsCounter();
}

// Renderizar histórias
function renderStories() {
  const grid = document.getElementById('storiesGrid');
  grid.innerHTML = '';
  
  if (currentStories.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <i class="fas fa-book-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>Nenhuma história encontrada</h3>
        <p>Tente ajustar os filtros ou termos de pesquisa</p>
      </div>
    `;
    return;
  }
  
  currentStories.forEach(story => {
    const storyCard = document.createElement('div');
    storyCard.classList.add('story-card');
    storyCard.innerHTML = `
      <img src="${story.image}" alt="${story.title}" class="story-image">
      <div class="story-badge">${story.brand}</div>
      <div class="story-info">
        <h3 class="story-title">${story.title}</h3>
        <p class="story-author">Por ${story.author}</p>
        <div class="story-meta">
          <span>${story.pages} páginas</span>
          <span>${story.age} anos</span>
        </div>
        <div class="story-actions">
          <span class="story-action" onclick="openStoryModal(${story.id})">
            <i class="fas fa-eye"></i> Ver detalhes
          </span>
          <span class="story-action" onclick="toggleFavorite(${story.id})">
            <i class="${story.isFavorite ? 'fas' : 'far'} fa-heart"></i> Favorito
          </span>
        </div>
      </div>
    `;
    grid.appendChild(storyCard);
  });
}

// Atualizar contador de resultados
function updateResultsCounter() {
  document.getElementById('resultsCount').textContent = currentStories.length;
}

// Abrir modal de detalhes da história
function openStoryModal(storyId) {
  const story = storiesData.find(s => s.id === storyId);
  if (!story) return;
  
  // Preencher modal com dados da história
  document.getElementById('modalStoryTitle').textContent = story.title;
  document.getElementById('modalStoryImage').src = story.image;
  document.getElementById('modalStoryAuthor').textContent = story.author;
  document.getElementById('modalStoryDescription').textContent = story.description;
  document.getElementById('modalStoryPages').textContent = story.pages;
  document.getElementById('modalStoryCategory').textContent = getCategoryName(story.category);
  document.getElementById('modalStoryAge').textContent = `${story.age} anos`;
  document.getElementById('modalStoryBrand').textContent = getBrandName(story.brand);
  document.getElementById('modalStoryBadge').textContent = story.brand;
  
  // Configurar botões de ação
  document.getElementById('modalFavoriteBtn').innerHTML = `
    <i class="${story.isFavorite ? 'fas' : 'far'} fa-heart"></i> ${story.isFavorite ? 'Desfavoritar' : 'Favoritar'}
  `;
  
  document.getElementById('modalFavoriteBtn').onclick = function() {
    toggleFavorite(storyId);
    closeModal();
  };
  
  document.getElementById('modalReadBtn').onclick = function() {
    alert(`Iniciando leitura de "${story.title}". Em uma implementação real, isso abriria o leitor de histórias.`);
    closeModal();
  };
  
  document.getElementById('modalShareBtn').onclick = function() {
    alert(`Compartilhando "${story.title}". Em uma implementação real, isso abriria opções de compartilhamento.`);
  };
  
  // Exibir modal
  document.getElementById('storyModal').classList.add('active');
}

// Fechar modal
function closeModal() {
  document.getElementById('storyModal').classList.remove('active');
}

// Alternar favorito
function toggleFavorite(storyId) {
  const story = storiesData.find(s => s.id === storyId);
  if (story) {
    story.isFavorite = !story.isFavorite;
    renderStories();
  }
}

// Obter nome da categoria
function getCategoryName(category) {
  const categories = {
    'adventure': 'Aventura',
    'fantasy': 'Fantasia',
    'comedy': 'Comédia',
    'educational': 'Educativo',
    'classic': 'Clássicos'
  };
  return categories[category] || category;
}

// Obter nome da marca
function getBrandName(brand) {
  const brands = {
    'disney': 'Disney',
    'dreamworks': 'DreamWorks',
    'pixar': 'Pixar',
    'universal': 'Universal'
  };
  return brands[brand] || brand;
}