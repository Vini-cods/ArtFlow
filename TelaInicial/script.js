// Interatividade da sidebar
const sidebarIcons = document.querySelectorAll(".sidebar-icon");
sidebarIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    sidebarIcons.forEach((i) => i.classList.remove("active"));
    icon.classList.add("active");
  });
});

// Interatividade das categorias
const categories = document.querySelectorAll(".category");
categories.forEach((category) => {
  category.addEventListener("click", () => {
    categories.forEach((c) => c.classList.remove("active"));
    category.classList.add("active");

    // Aqui você pode adicionar a lógica para filtrar as histórias por categoria
    console.log(`Categoria selecionada: ${category.textContent}`);
  });
});

// Interatividade dos botões de seguir artista
const followButtons = document.querySelectorAll(".follow-btn");
followButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.stopPropagation();
    if (this.textContent === "Seguir") {
      this.textContent = "Seguindo";
      this.style.background = "rgba(255, 215, 0, 0.2)";

      // Notificação de sucesso
      showNotification(
        `Agora você está seguindo ${
          this.parentElement.querySelector("h4").textContent
        }`
      );
    } else {
      this.textContent = "Seguir";
      this.style.background = "transparent";
    }
  });
});

// Interatividade das ações nas miniaturas
const thumbnailActions = document.querySelectorAll(".thumbnail-action");
thumbnailActions.forEach((action) => {
  action.addEventListener("click", function (e) {
    e.stopPropagation();
    const icon = this.querySelector("i");

    if (icon.classList.contains("fa-heart")) {
      if (icon.classList.contains("far")) {
        icon.classList.replace("far", "fas");
        icon.style.color = "#ff4757";

        // Incrementar contador de likes
        const countSpan = this.querySelector("span:not(.fa-heart)");
        if (countSpan) {
          let count = parseInt(countSpan.textContent);
          countSpan.textContent = count + 1;
        }
      } else {
        icon.classList.replace("fas", "far");
        icon.style.color = "";

        // Decrementar contador de likes
        const countSpan = this.querySelector("span:not(.fa-heart)");
        if (countSpan) {
          let count = parseInt(countSpan.textContent);
          countSpan.textContent = count - 1;
        }
      }
    }
  });
});

// Interatividade dos itens em destaque
const featuredItems = document.querySelectorAll(".featured-item");
featuredItems.forEach((item) => {
  item.addEventListener("click", () => {
    const title = item.querySelector(".art-title").textContent;
    const artist = item.querySelector(".art-artist").textContent;
    const imageSrc = item.querySelector(".art-image").src;

    // Abrir modal com informações detalhadas
    showStoryModal(title, artist, imageSrc);
  });
});

// Interatividade das atividades
const activityCards = document.querySelectorAll(".activity-card");
activityCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
    }, 200);
  });
});

// Função para mostrar notificações
function showNotification(message) {
  // Criar elemento de notificação
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

  // Estilos para a notificação
  notification.style.position = "fixed";
  notification.style.top = "20px";
  notification.style.right = "20px";
  notification.style.background = "rgba(45, 21, 84, 0.9)";
  notification.style.color = "white";
  notification.style.padding = "15px 20px";
  notification.style.borderRadius = "10px";
  notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
  notification.style.zIndex = "1000";
  notification.style.backdropFilter = "blur(10px)";
  notification.style.border = "1px solid rgba(255, 215, 0, 0.3)";
  notification.style.transform = "translateX(100px)";
  notification.style.opacity = "0";
  notification.style.transition = "all 0.3s ease";

  // Adicionar ao corpo do documento
  document.body.appendChild(notification);

  // Animação de entrada
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
  }, 10);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.transform = "translateX(100px)";
    notification.style.opacity = "0";

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Função para obter informações da história (em uma implementação real, viria de uma API)
function getStoryInfo(title) {
  const stories = {
    "Aventura na Floresta": {
      description:
        "Uma emocionante jornada pela floresta amazônica, onde dois amigos descobrem criaturas mágicas e aprendem sobre a importância de preservar a natureza.",
      pages: 12,
      category: "Aventura, Natureza",
      ageRange: "5-10 anos",
      authorBio:
        "Sofia Mendes é uma educadora e escritora apaixonada por natureza. Com mais de 15 livros infantis published, ela busca inspirar as crianças a explorarem e protegerem o meio ambiente.",
    },
    "O Castelo Mágico": {
      description:
        "Em um reino distante, uma jovem princesa descobre um castelo encantado cheio de segredos e criaturas fantásticas que precisam de sua ajuda.",
      pages: 10,
      category: "Fantasia, Aventura",
      ageRange: "4-8 anos",
      authorBio:
        "Carlos Silva é um contador de histórias com especialidade em contos de fada modernos. Seus livros são conhecidos por promover valores de coragem e amizade.",
    },
    "Viagem ao Espaço": {
      description:
        "Junte-se à tripulação da nave estelar Exploradora em uma missão para descobrir novos planetas e fazer amizade com alienígenas curiosos.",
      pages: 14,
      category: "Ficção Científica",
      ageRange: "6-12 anos",
      authorBio:
        "Ana Costa é uma ex-cientista da NASA que agora dedica seu tempo a escrever livros infantis que tornam a ciência divertida e acessível para todas as crianças.",
    },
    "O Tesouro Perdido": {
      description:
        "Um mapa misterioso leva três irmãos em uma caça ao tesouro cheia de enigmas, desafios e descobertas sobre trabalho em equipe.",
      pages: 16,
      category: "Aventura, Mistério",
      ageRange: "7-12 anos",
      authorBio:
        "Miguel Santos é um arqueólogo que transforma suas experiências em aventuras emocionantes para jovens leitores. Seus livros incentivam a curiosidade e a resolução de problemas.",
    },
  };

  return (
    stories[title] || {
      description: "Uma história emocionante cheia de aventuras e aprendizado.",
      pages: 10,
      category: "Aventura",
      ageRange: "5-10 anos",
      authorBio:
        "Um autor talentoso dedicado a criar histórias cativantes para jovens leitores.",
    }
  );
}

// Função para simular a abertura de um modal de história
function showStoryModal(title, artist, imageSrc) {
  // Criar overlay do modal
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  // Buscar informações adicionais (em uma implementação real, viriam de uma API)
  const storyInfo = getStoryInfo(title);

  // Criar conteúdo do modal
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modalContent.innerHTML = `
        <div class="modal-header">
            <h3>${title}</h3>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="book-cover-container">
                <img src="${imageSrc}" alt="${title}" class="book-cover-large">
            </div>
            <div class="book-details">
                <div class="book-author">
                    <p><strong>Autor:</strong> ${artist}</p>
                </div>
                <div class="book-description">
                    <h4>Sinopse</h4>
                    <p>${storyInfo.description}</p>
                </div>
                <div class="book-stats">
                    <p><strong>Páginas:</strong> ${storyInfo.pages}</p>
                    <p><strong>Categoria:</strong> ${storyInfo.category}</p>
                    <p><strong>Idade recomendada:</strong> ${storyInfo.ageRange}</p>
                </div>
                <div class="author-bio">
                    <h4>Sobre o Autor</h4>
                    <p>${storyInfo.authorBio}</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="modal-button read-btn">Ler História</button>
                <button class="modal-button draw-btn" onclick="window.location.href='aventura-na-floresta/aventura.html'">Desenhar Agora</button>
                <button class="modal-button favorite-btn">
                    <i class="far fa-heart"></i> Favoritar
                </button>
            </div>
        </div>
    `;

  // Adicionar estilos
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = "0";
  modalOverlay.style.left = "0";
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.background = "rgba(0, 0, 0, 0.7)";
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";
  modalOverlay.style.zIndex = "2000";
  modalOverlay.style.opacity = "0";
  modalOverlay.style.transition = "opacity 0.3s ease";

  // Adicionar ao corpo do documento
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  // Animação de entrada
  setTimeout(() => {
    modalOverlay.style.opacity = "1";
  }, 10);

  // Fechar modal ao clicar no overlay ou no botão de fechar
  modalOverlay.addEventListener("click", (e) => {
    if (
      e.target === modalOverlay ||
      e.target.classList.contains("close-modal")
    ) {
      modalOverlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300);
    }
  });

  // Adicionar interatividade aos botões do modal
  const readBtn = modalContent.querySelector(".read-btn");
  const drawBtn = modalContent.querySelector(".draw-btn");
  const favoriteBtn = modalContent.querySelector(".favorite-btn");

  readBtn.addEventListener("click", () => {
    showNotification("Iniciando a leitura da história!");
    setTimeout(() => {
      modalOverlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
      }, 300);
    }, 1000);
  });

  drawBtn.addEventListener("click", function () {
    showNotification("Abrindo ferramenta de desenho!");
    setTimeout(() => {
      modalOverlay.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(modalOverlay);
        window.location.href = "aventura-na-floresta/aventura.html";
      }, 300);
    }, 1000);
  });

  favoriteBtn.addEventListener("click", function () {
    const icon = this.querySelector("i");
    if (icon.classList.contains("far")) {
      icon.classList.replace("far", "fas");
      icon.style.color = "#ff4757";
      showNotification("História adicionada aos favoritos!");
    } else {
      icon.classList.replace("fas", "far");
      icon.style.color = "";
      showNotification("História removida dos favoritos!");
    }
  });
}

// Criar bolinhas flutuantes interativas
function createFloatingShapes() {
  const container = document.querySelector(".floating-shapes");

  // Limpar shapes existentes
  container.innerHTML = "";

  // Criar diferentes tamanhos e cores de bolinhas
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

      // Adicionar interação ao passar o mouse
      shape.addEventListener("mouseover", () => {
        shape.style.transform = "scale(1.2)";
        shape.style.opacity = "0.9";
      });

      shape.addEventListener("mouseout", () => {
        shape.style.transform = "scale(1)";
        shape.style.opacity = "0.6";
      });

      // Adicionar interação ao clicar
      shape.addEventListener("click", () => {
        shape.style.animation = "none";
        shape.style.transform = "scale(1.5)";
        shape.style.opacity = "0.8";

        setTimeout(() => {
          shape.style.animation = `float ${
            8 + Math.random() * 4
          }s ease-in-out infinite`;
          shape.style.transform = "scale(1)";
          shape.style.opacity = "0.6";
        }, 500);
      });

      container.appendChild(shape);
    }
  });
}

// Efeito de digitação no título de boas-vindas
function typeWriterEffect() {
  const welcomeTitle = document.querySelector(".welcome-text h2");
  if (welcomeTitle) {
    const originalText = welcomeTitle.textContent;
    welcomeTitle.textContent = "";
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
  const searchInput = document.querySelector(".search-input");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value);
      }
    });
  }
}

// Função de busca
function performSearch(query) {
  if (query.trim() !== "") {
    showNotification(`Buscando por: ${query}`);
    // Aqui você implementaria a lógica real de busca
    console.log(`Realizando busca por: ${query}`);
  }
}

// Adicionar funcionalidade ao formulário de inscrição
function setupNewsletter() {
  const footerForm = document.querySelector(".footer-form");
  if (footerForm) {
    footerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector(".footer-input");
      if (emailInput.value.trim() !== "") {
        showNotification("Inscrição realizada com sucesso!");
        emailInput.value = "";
      }
    });
  }
}

// Garantir que as imagens sejam carregadas corretamente
function setupImageLoading() {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    // Forçar recarregamento se necessário
    if (img.complete) {
      adjustImage(img);
    } else {
      img.addEventListener("load", function () {
        adjustImage(this);
      });
    }

    // Adicionar tratamento de erro
    img.addEventListener("error", function () {
      this.classList.add("image-error");
    });
  });

  function adjustImage(image) {
    // Adicionar classe para tratamento de erro se a imagem não carregar
    if (image.naturalWidth === 0) {
      image.classList.add("image-error");
    } else {
      image.classList.remove("image-error");
    }
  }
}

// Função para inicializar o carrossel
function initCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  let currentSlide = 0;
  let autoSlideInterval;

  // Função para mostrar um slide específico
  function showSlide(index) {
    // Remover a classe active de todos os slides e dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Adicionar a classe active ao slide e dot atual
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  // Função para avançar para o próximo slide
  function nextSlide() {
    let nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  // Função para voltar ao slide anterior
  function prevSlide() {
    let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  // Iniciar a transição automática
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
  }

  // Parar a transição automática
  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Event listeners para os botões de navegação
  nextBtn.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  // Event listeners para os dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    });
  });

  // Pausar o carrossel quando o mouse estiver sobre ele
  const carousel = document.querySelector(".carousel-container");
  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  // Iniciar o carrossel
  startAutoSlide();
}

// Configurar acessibilidade
function setupAccessibility() {
  // Adicionar atalhos de teclado
  document.addEventListener("keydown", function (e) {
    // Tecla 'Escape' para fechar modais
    if (e.key === "Escape") {
      const modal = document.querySelector(".modal-overlay");
      if (modal) {
        modal.style.opacity = "0";
        setTimeout(() => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        }, 300);
      }
    }

    // Tecla 'Tab' para melhor navegação por teclado
    if (e.key === "Tab") {
      document.documentElement.classList.add("keyboard-nav");
    }
  });

  document.addEventListener("mousedown", function () {
    document.documentElement.classList.remove("keyboard-nav");
  });
}

// Contador regressivo para o desafio semanal
function setupChallengeCountdown() {
  const countdownElement = document.getElementById("challenge-countdown");
  if (!countdownElement) return;

  // Definir data de término (5 dias a partir de agora)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 5);

  function updateCountdown() {
    const now = new Date();
    const timeRemaining = endDate - now;

    if (timeRemaining <= 0) {
      countdownElement.textContent = "Desafio encerrado!";
      return;
    }

    // Calcular dias, horas, minutos
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    countdownElement.textContent = `Termina em: ${days}d ${hours}h ${minutes}m`;
  }

  // Atualizar a cada minuto
  updateCountdown();
  setInterval(updateCountdown, 60000);
}

// Efeito de digitação para as atualizações
function setupTypingEffects() {
  const updateItems = document.querySelectorAll(".update-content h4");
  updateItems.forEach((item, index) => {
    const originalText = item.textContent;
    item.textContent = "";

    setTimeout(() => {
      let i = 0;
      function typeWriter() {
        if (i < originalText.length) {
          item.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeWriter, 50);
        }
      }
      typeWriter();
    }, index * 300);
  });
}

// Efeito de aparição para elementos ao rolar a página
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observar elementos para animação
  const animatedElements = document.querySelectorAll(
    ".featured-section, .activity-card, .young-artist"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
}

// Dados de exemplo para artistas
const artistsData = {
  "Marina, 8 anos": {
    age: 8,
    followers: 23,
    drawings: 15,
    specialties: ["Animais", "Fantasias", "Natureza"],
    bio: "Marina adora desenhar animais fantásticos e cenários de fantasia. Sua imaginação não tem limites e ela está sempre criando novas criaturas mágicas.",
    gallery: [
      "./img/Meu Dragão Amigo.png",
      "./img/familia de ursos.png",
      "./img/castelo colorido.png",
    ],
  },
  "Breno, 7 anos": {
    age: 7,
    followers: 45,
    drawings: 22,
    specialties: ["Espaço", "Robôs", "Ficção Científica"],
    bio: "Breno é fascinado por espaço e tecnologia. Seus desenhos frequentemente apresentam naves espacial, robôs e planetas distantes.",
    gallery: [
      "./img/Viagem ao espaço.png",
      "./img/robos.png",
      "./img/foguete.png",
    ],
  },
  "Ana, 9 anos": {
    age: 9,
    followers: 32,
    drawings: 18,
    specialties: ["Princesas", "Natureza", "Contos de Fada"],
    bio: "Ana cria mundos encantados cheios de princesas, fadas e criaturas mágicas. Seus desenhos são conhecidos por suas cores vibrantes e detalhes delicados.",
    gallery: [
      "./img/princesa floresta.png",
      "./img/castelo magico.png",
      "./img/fada poeira.png",
    ],
  },
};

// Dados de exemplo para desenhos
const drawingsData = {
  "Meu Dragão Amigo": {
    artist: "João, 8 anos",
    artistImg: "./img/img/kid12.png",
    likes: 42,
    views: 128,
    date: "3 dias atrás",
    description:
      "Desenhei meu dragão de estimação chamado Faísca. Ele cospe fogo colorido e adora brincar comigo no parque.",
    tags: ["Dragão", "Animal de Estimação", "Fantasia", "Cores"],
  },
  "Castelo Colorido": {
    artist: "Maria, 7 anos",
    artistImg: "./img/img/kid17.png",
    likes: 37,
    views: 95,
    date: "5 dias atrás",
    description:
      "Este é o castelo onde a princesa Aurora mora. Tem quartos coloridos e um jardim com flores que cantam.",
    tags: ["Castelo", "Princesa", "Cores", "Fantasia"],
  },
  "Família de Ursos": {
    artist: "Pedro, 6 anos",
    artistImg: "./img/img/kid18.png",
    likes: 29,
    views: 76,
    date: "1 semana atrás",
    description:
      "A família urso em seu picnic na floresta. Eles estão comendo mel and frutas silvestres.",
    tags: ["Ursos", "Família", "Natureza", "Animais"],
  },
};

// Dados de exemplo para histórias recentes
const recentStoriesData = {
  "O Pequeno Príncipe": {
    author: "Antoine de Saint-Exupéry",
    description:
      "A clássica história de um pequeno príncipe que viaja de planeta em planeta, encontrando personagens peculiares e aprendendo valiosas lições sobre amor e amizade.",
    pages: 10,
    category: "Aventura, Fantasia",
    ageRange: "6-12 anos",
    authorBio:
      "Antoine de Saint-Exupéry foi um escritor, ilustrador e piloto francês. Escreveu 'O Pequeno Príncipe' durante seu exílio nos Estados Unidos, e a obra se tornou um dos livros mais traduzidos do mundo.",
  },
  "A Menina e o Dragão": {
    author: "Eva Furnari",
    description:
      "Uma menina corajosa faz amizade with um dragão que é mal compreendido por todos. Juntos, eles mostram à vila que as aparências enganam.",
    pages: 8,
    category: "Fantasia, Amizade",
    ageRange: "5-10 anos",
    authorBio:
      "Eva Furnari é uma autora e ilustradora brasileira de livros infantis. Suas obras são conhecidas por promover valores como amizade, coragem e aceitação das diferenças.",
  },
  "No Fundo do Mar": {
    author: "Booksmile",
    description:
      "Uma aventura submarina onde duas crianças exploram o fundo do mar, descobrindo criaturas incríveis e aprendendo sobre a importância de preservar os oceanos.",
    pages: 12,
    category: "Aventura, Natureza",
    ageRange: "4-8 anos",
    authorBio:
      "Booksmile é uma editora especializada em livros infantis educativos e divertidos. Seus livros combinam histórias cativantes com aprendizagem sobre o mundo natural.",
  },
  "O Circo Mágico": {
    author: "Alexandre Brito",
    description:
      "Quando um circo misterioso chega à cidade, três amigos descobrem que os artistas têm talentos verdadeiramente mágicos e embarcam em uma aventura inesquecível.",
    pages: 6,
    category: "Aventura, Fantasia",
    ageRange: "5-9 anos",
    authorBio:
      "Alexandre Brito é um contador de histórias brasileiro que se especializa em narrativas mágicas e cheias de imaginação. Seus livros transportam os leitores para mundos extraordinários.",
  },
};

// Função para mostrar modal do artista
function showArtistModal(artistName) {
  const artistData = artistsData[artistName];
  if (!artistData) return;

  const modal = document.getElementById("artist-modal");
  const modalArtistName = document.getElementById("modal-artist-name");
  const modalArtistImg = document.getElementById("modal-artist-img");
  const modalArtistAge = document.getElementById("modal-artist-age");
  const modalArtistFollowers = document.getElementById(
    "modal-artist-followers"
  );
  const modalArtistDrawings = document.getElementById("modal-artist-drawings");
  const modalArtistSpecialties = document.getElementById(
    "modal-artist-specialties"
  );
  const modalArtistBio = document.getElementById("modal-artist-bio");
  const modalArtistGallery = document.getElementById("modal-artist-gallery");
  const followButton = document.getElementById("follow-artist-btn");

  // Preencher dados do modal
  modalArtistName.textContent = artistName;
  modalArtistImg.src = document.querySelector(
    `.young-artist:has(h4:contains("${artistName}")) img`
  ).src;
  modalArtistAge.textContent = artistData.age + " anos";
  modalArtistFollowers.textContent = artistData.followers;
  modalArtistDrawings.textContent = artistData.drawings;
  modalArtistBio.textContent = artistData.bio;

  // Preencher especialidades
  modalArtistSpecialties.innerHTML = "";
  artistData.specialties.forEach((specialty) => {
    const tag = document.createElement("span");
    tag.className = "specialty-tag-modal";
    tag.textContent = specialty;
    modalArtistSpecialties.appendChild(tag);
  });

  // Preencher galeria
  modalArtistGallery.innerHTML = "";
  artistData.gallery.forEach((imgSrc) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Obra de " + artistName;
    img.onclick = () => {
      // Aqui você pode implementar uma visualização maior da imagem
      alert("Visualização ampliada da imagem: " + imgSrc);
    };
    modalArtistGallery.appendChild(img);
  });

  // Configurar botão de seguir
  followButton.classList.toggle(
    "following",
    followButton.textContent === "Seguindo"
  );
  followButton.onclick = function () {
    const isFollowing = this.textContent === "Seguindo";
    this.textContent = isFollowing ? "Seguir" : "Seguindo";
    this.classList.toggle("following", !isFollowing);

    // Atualizar contador de seguidores
    const followersElement = document.getElementById("modal-artist-followers");
    let followersCount = parseInt(followersElement.textContent);
    followersCount = isFollowing ? followersCount - 1 : followersCount + 1;
    followersElement.textContent = followersCount;
  };

  // Mostrar modal
  modal.style.display = "flex";

  // Adicionar evento para fechar o modal
  const closeModal = modal.querySelector(".close-modal");
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Função para mostrar modal do desenho
function showDrawingModal(drawingTitle) {
  const drawingData = drawingsData[drawingTitle];
  if (!drawingData) return;

  const modal = document.getElementById("drawing-modal");
  const modalDrawingTitle = document.getElementById("modal-drawing-title");
  const modalDrawingImg = document.getElementById("modal-drawing-img");
  const modalDrawingArtistImg = document.getElementById(
    "modal-drawing-artist-img"
  );
  const modalDrawingArtistName = document.getElementById(
    "modal-drawing-artist-name"
  );
  const modalDrawingArtistAge = document.getElementById(
    "modal-drawing-artist-age"
  );
  const modalDrawingLikes = document.getElementById("modal-drawing-likes");
  const modalDrawingViews = document.getElementById("modal-drawing-views");
  const modalDrawingDate = document.getElementById("modal-drawing-date");
  const modalDrawingDescription = document.getElementById(
    "modal-drawing-description"
  );
  const modalDrawingTags = document.getElementById("modal-drawing-tags");
  const likeButton = document.getElementById("like-drawing-btn");

  // Preencher dados do modal
  modalDrawingTitle.textContent = drawingTitle;
  modalDrawingImg.src = document.querySelector(
    `.drawing-item:has(h4:contains("${drawingTitle}")) img`
  ).src;
  modalDrawingArtistImg.src = drawingData.artistImg;
  modalDrawingArtistName.textContent = drawingData.artist;
  modalDrawingArtistAge.textContent = drawingData.artist.split(", ")[1];
  modalDrawingLikes.textContent = drawingData.likes;
  modalDrawingViews.textContent = drawingData.views;
  modalDrawingDate.textContent = drawingData.date;
  modalDrawingDescription.textContent = drawingData.description;

  // Preencher tags
  modalDrawingTags.innerHTML = "";
  drawingData.tags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "drawing-tag";
    tagElement.textContent = tag;
    modalDrawingTags.appendChild(tagElement);
  });

  // Configurar botão de curtir
  likeButton.classList.toggle(
    "liked",
    likeButton.querySelector("i").classList.contains("fas")
  );
  likeButton.onclick = function () {
    const isLiked = this.querySelector("i").classList.contains("fas");
    this.querySelector("i").className = isLiked
      ? "far fa-heart"
      : "fas fa-heart";
    this.classList.toggle("liked", !isLiked);

    // Atualizar contador de curtidas
    const likesElement = document.getElementById("modal-drawing-likes");
    let likesCount = parseInt(likesElement.textContent);
    likesCount = isLiked ? likesCount - 1 : likesCount + 1;
    likesElement.textContent = likesCount;
  };

  // Mostrar modal
  modal.style.display = "flex";

  // Adicionar evento para fechar o modal
  const closeModal = modal.querySelector(".close-modal");
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Função para ver perfil completo do artista
function viewArtistProfile() {
  const artistName = document.getElementById("modal-artist-name").textContent;
  alert(`Redirecionando para o perfil completo de ${artistName}`);
  // Em uma implementação real, você redirecionaria para a página do artista
}

// Função para baixar desenho
function downloadDrawing() {
  const drawingTitle = document.getElementById(
    "modal-drawing-title"
  ).textContent;
  alert(`Iniciando download do desenho: ${drawingTitle}`);
  // Em uma implementação real, você iniciaria o download da imagem
}

// Função para desenhar inspirado
function drawInspired() {
  const drawingTitle = document.getElementById(
    "modal-drawing-title"
  ).textContent;
  alert(`Abrindo editor para criar um desenho inspirado em: ${drawingTitle}`);
  // Em uma implementação real, você abriria o editor de desenhos
}

// Adicionar event listeners aos elementos das seções
function setupInteractiveSections() {
  // Adicionar event listeners para Artistas Mirins
  document.querySelectorAll(".young-artist").forEach((artist) => {
    artist.addEventListener("click", function () {
      const artistName = this.querySelector("h4").textContent;
      showArtistModal(artistName);
    });
  });

  // Adicionar event listeners para Desenhos da Comunidade
  document.querySelectorAll(".drawing-item").forEach((drawing) => {
    drawing.addEventListener("click", function () {
      const drawingTitle = this.querySelector("h4").textContent;
      showDrawingModal(drawingTitle);
    });
  });

  // Adicionar event listeners para Histórias Recentes
  document.querySelectorAll(".thumbnail").forEach((story) => {
    story.addEventListener("click", function () {
      const storyTitle = this.querySelector(".thumbnail-title").textContent;
      const storyAuthor = this.querySelector(
        ".thumbnail-artist"
      ).textContent.replace("Por: ", "");
      const storyImage = this.querySelector(".thumbnail-img").src;

      // Usar o modal de história existente
      showStoryModal(storyTitle, storyAuthor, storyImage);
    });
  });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Criar bolinhas flutuantes
  createFloatingShapes();

  // Efeito de digitação
  typeWriterEffect();

  // Configurar funcionalidades
  setupSearch();
  setupNewsletter();
  setupAccessibility();
  setupImageLoading();
  setupChallengeCountdown();
  setupTypingEffects();
  setupScrollAnimations();
  setupInteractiveSections();

  // Inicializar o carrossel
  initCarousel();

  // Adicionar estilos para alto contraste e fonte legível
  const style = document.createElement("style");
  style.textContent = `
        .high-contrast {
            --primary-color: #000000;
            --secondary-color: #ffffff;
            --accent-color: #ffff00;
            filter: contrast(1.5);
        }
        
        .high-contrast .floating-shapes {
            display: none;
        }
        
        .readable-font {
            font-family: Arial, sans-serif;
        }
        
        .readable-font * {
            font-weight: 500 !important;
            letter-spacing: 0.5px !important;
        }
        
        .image-error {
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #999;
            font-size: 12px;
        }
        
        .image-error::before {
            content: "Imagem não disponível";
        }
        
        /* Estilos para navegação por teclado */
        .keyboard-nav *:focus {
            outline: 2px solid #ffd700;
            outline-offset: 2px;
        }
    `;
  document.head.appendChild(style);
});
