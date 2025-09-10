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
  const stories = document.querySelectorAll(".story-card");
  const emptyState = document.getElementById("emptyState");
  let visibleCount = 0;

  stories.forEach((story) => {
    if (filter === "all" || story.dataset.status === filter) {
      story.style.display = "block";
      visibleCount++;
    } else {
      story.style.display = "none";
    }
  });

  if (visibleCount === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// Pesquisar histórias
function searchStories(query) {
  const stories = document.querySelectorAll(".story-card");
  const emptyState = document.getElementById("emptyState");
  let visibleCount = 0;

  stories.forEach((story) => {
    const title = story.dataset.title.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      story.style.display = "block";
      visibleCount++;
    } else {
      story.style.display = "none";
    }
  });

  if (visibleCount === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// Ordenar histórias
function sortStories(criteria) {
  const grid = document.getElementById("storiesGrid");
  const stories = Array.from(grid.querySelectorAll(".story-card"));

  stories.sort((a, b) => {
    switch (criteria) {
      case "title":
        return a.dataset.title.localeCompare(b.dataset.title);
      case "progress":
        const progressA = parseInt(
          a.querySelector(".progress-bar").style.width
        );
        const progressB = parseInt(
          b.querySelector(".progress-bar").style.width
        );
        return progressB - progressA;
      default:
        return 0;
    }
  });

  stories.forEach((story) => grid.appendChild(story));
}

// Alternar visualização
function toggleView(view) {
  const grid = document.getElementById("storiesGrid");
  if (view === "list") {
    grid.classList.add("list-view");
  } else {
    grid.classList.remove("list-view");
  }
}

// Função para carregar histórias do localStorage
function loadStoriesFromStorage() {
  const stories = JSON.parse(localStorage.getItem("artflow-stories")) || [];
  const grid = document.getElementById("storiesGrid");
  const emptyState = document.getElementById("emptyState");

  // Se não houver histórias, mostrar estado vazio
  if (stories.length === 0) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  // Limpar o grid (mantenha as histórias estáticas já existentes ou substitua completamente)
  // Para adicionar às histórias existentes, comente a linha abaixo
  // grid.innerHTML = '';

  stories.forEach((story) => {
    const storyCard = createStoryCard(story);
    grid.appendChild(storyCard);
  });

  // Atualizar contadores
  updateStoryCounters(stories);
}

// Função para criar um card de história
function createStoryCard(story) {
  const card = document.createElement("div");
  card.className = "story-card";
  card.dataset.status = story.status;
  card.dataset.title = story.title;
  card.dataset.id = story.id;

  // Determinar texto e classe do status
  let statusText, statusClass;
  switch (story.status) {
    case "reading":
      statusText = "Lendo";
      statusClass = "status-reading";
      break;
    case "completed":
      statusText = "Concluída";
      statusClass = "status-completed";
      break;
    case "new":
      statusText = "Nova";
      statusClass = "status-new";
      break;
    case "paused":
      statusText = "Pausada";
      statusClass = "status-paused";
      break;
    default:
      statusText = "Nova";
      statusClass = "status-new";
  }

  // Formatar a data
  const storyDate = new Date(story.date);
  const today = new Date();
  const diffTime = Math.abs(today - storyDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dateText;
  if (diffDays === 1) {
    dateText = "Hoje";
  } else if (diffDays === 2) {
    dateText = "Ontem";
  } else if (diffDays < 7) {
    dateText = `${diffDays - 1} dias`;
  } else {
    dateText = storyDate.toLocaleDateString("pt-BR");
  }

  card.innerHTML = `
      <div class="story-cover">
          <img src="${story.cover || "../img/default-cover.png"}" alt="${story.title
    }" />
          <div class="story-status ${statusClass}">${statusText}</div>
          <div class="story-progress">
              <div class="progress-bar" style="width: ${story.progress
    }%"></div>
          </div>
      </div>
      <div class="story-info">
          <h3 class="story-title">${story.title}</h3>
          <div class="story-meta">
              <div class="story-date">
                  <i class="fas fa-calendar"></i>
                  <span>${dateText}</span>
              </div>
              <div class="story-pages">
                  <i class="fas fa-book-open"></i>
                  <span>${story.currentPage || 0}/${story.pagesCount
    } páginas</span>
              </div>
          </div>
          <p class="story-description">
              ${story.category
      ? `Categoria: ${story.category}`
      : "História criada por você"
    }
          </p>
          <div class="story-actions">
              <div class="action-buttons">
                  <button class="action-btn" title="Favoritar">
                      <i class="${story.favorite ? "fas" : "far"
    } fa-heart"></i>
                  </button>
                  <button class="action-btn" title="Compartilhar">
                      <i class="fas fa-share"></i>
                  </button>
                  <button class="action-btn" title="Mais opções">
                      <i class="fas fa-ellipsis-v"></i>
                  </button>
              </div>
              <button class="continue-btn">${story.status === "new"
      ? "Começar"
      : story.status === "completed"
        ? "Reler"
        : "Continuar"
    }</button>
          </div>
      </div>
  `;

  // Adicionar event listeners aos botões
  const favoriteBtn = card.querySelector('.action-btn[title="Favoritar"]');
  favoriteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleFavorite(story.id);
  });

  const optionsBtn = card.querySelector('.action-btn[title="Mais opções"]');
  optionsBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    showStoryOptions(story);
  });

  const continueBtn = card.querySelector(".continue-btn");
  continueBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openStory(story);
  });

  return card;
}

// Função para alternar favorito
function toggleFavorite(storyId) {
  let stories = JSON.parse(localStorage.getItem("artflow-stories")) || [];
  const storyIndex = stories.findIndex((s) => s.id === storyId);

  if (storyIndex !== -1) {
    stories[storyIndex].favorite = !stories[storyIndex].favorite;
    localStorage.setItem("artflow-stories", JSON.stringify(stories));
    loadStoriesFromStorage(); // Recarregar as histórias
  }
}

// Função para abrir uma história
function openStory(story) {
  // Aqui você pode redirecionar para uma página de leitura ou abrir um modal
  alert(`Abrindo: ${story.title}`);

  // Atualizar status se for nova
  if (story.status === "new") {
    let stories = JSON.parse(localStorage.getItem("artflow-stories")) || [];
    const storyIndex = stories.findIndex((s) => s.id === story.id);

    if (storyIndex !== -1) {
      stories[storyIndex].status = "reading";
      stories[storyIndex].currentPage = 1;
      stories[storyIndex].progress = Math.round(
        (1 / stories[storyIndex].pagesCount) * 100
      );
      localStorage.setItem("artflow-stories", JSON.stringify(stories));
    }
  }
}

// Função para mostrar opções da história
function showStoryOptions(story) {
  const modal = document.getElementById("storyModal");
  const modalTitle = document.getElementById("modalTitle");

  modalTitle.textContent = `Opções: ${story.title}`;
  modal.classList.add("active");
}

// Função para atualizar contadores
function updateStoryCounters(stories) {
  const totalStories = stories.length;
  const readStories = stories.filter((s) => s.status === "completed").length;
  const readingStories = stories.filter((s) => s.status === "reading").length;

  document.querySelector(".stat-number:nth-child(1)").textContent =
    totalStories;
  document.querySelector(".stat-number:nth-child(2)").textContent =
    readStories;
  document.querySelector(".stat-number:nth-child(3)").textContent =
    readingStories;
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  createFloatingShapes();
  loadStoriesFromStorage(); // Carregar histórias do localStorage

  // Filtros
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-tab")
        .forEach((t) => t.classList.remove("active"));
      this.classList.add("active");
      filterStories(this.dataset.filter);
    });
  });

  // Pesquisa
  document.getElementById("searchInput").addEventListener("input", function () {
    searchStories(this.value);
  });

  // Ordenação
  document.getElementById("sortSelect").addEventListener("change", function () {
    sortStories(this.value);
  });

  // Visualização
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".view-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      toggleView(this.dataset.view);
    });
  });

  // Modal
  const modal = document.getElementById("storyModal");
  const closeModal = document.querySelector(".close-modal");

  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // Ações dos cartões
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      if (this.title === "Favoritar") {
        const icon = this.querySelector("i");
        if (icon.classList.contains("far")) {
          icon.classList.replace("far", "fas");
          icon.style.color = "#ff4757";
        } else {
          icon.classList.replace("fas", "far");
          icon.style.color = "";
        }
      } else if (this.title === "Mais opções") {
        const card = this.closest(".story-card");
        const title = card.dataset.title;
        document.getElementById("modalTitle").textContent = `Opções: ${title}`;
        modal.classList.add("active");
      }
    });
  });

  // Botões de continuar/começar
  document.querySelectorAll(".continue-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const card = this.closest(".story-card");
      const title = card.dataset.title;

      // Simular abertura da história
      alert(`Abrindo: ${title}`);
    });
  });
});