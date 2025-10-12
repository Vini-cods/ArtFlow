// ler-historia.js - Modo de Leitura da História
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const bookContent = document.getElementById("book-content");
  const pageIndicator = document.getElementById("page-indicator");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");
  const readingTimeElement = document.getElementById("reading-time");
  const readingProgressElement = document.getElementById("reading-progress");
  const bookmarkIcon = document.getElementById("bookmark-icon");

  // Estado da leitura
  let currentPage = 1;
  const totalPages = 7;
  let startTime = new Date();
  let isBookmarked = false;

  // Conteúdo da história (mesmo conteúdo do aventura.js)
  const storyPages = [
    `
            <h3>Capítulo 1 — O Esquilo Curioso</h3>
            <p>
                Era uma vez, em uma floresta encantada onde as folhas dançavam com o vento e os riachos cantavam melodias suaves, vivia um pequeno esquilo chamado Zeke.
                Zeke era conhecido por sua curiosidade sem limites e por estar sempre explorando lugares onde nenhum outro esquilo se atrevia a ir.
            </p>
            <p>
                Enquanto seus amigos preferiam guardar nozes e brincar entre os galhos, Zeke sonhava em descobrir mistérios escondidos e segredos antigos da floresta.
            </p>
            <p>
                Certa manhã, ele acordou com o coração inquieto. O sol brilhava entre as copas das árvores, e algo dentro dele dizia que aquele seria um dia diferente — um dia de descobertas.
            </p>
            <div class="highlight">
                "A curiosidade é o primeiro passo para grandes aventuras."
            </div>
        `,
    `
            <h3>Capítulo 2 — O Mapa Escondido</h3>
            <p>
                Enquanto explorava uma parte da floresta que poucos conheciam, Zeke encontrou uma árvore centenária com um oco profundo.
                Movido pela curiosidade, ele espiou lá dentro e encontrou um velho pedaço de papel enrolado e amarrado com um fio de musgo.
            </p>
            <p>
                Ao abri-lo, seus olhos brilharam: era um mapa antigo, desenhado à mão, com símbolos misteriosos e um X dourado no centro.
            </p>
            <div class="highlight">
                "Aquele que seguir este caminho encontrará a Noz Dourada — fonte de um único e verdadeiro desejo."
            </div>
            <p>
                Zeke mal podia conter a empolgação. Ele imaginou como seria ter um desejo realizado e decidiu, sem hesitar, seguir a trilha marcada no mapa.
            </p>
        `,
    `
            <h3>Capítulo 3 — O Rio das Correntes Prateadas</h3>
            <p>
                A primeira parada da jornada de Zeke foi o Rio das Correntes Prateadas, um curso d'água conhecido por suas águas rápidas e brilhantes como espelhos.
                O esquilo observou o rio e percebeu que atravessá-lo seria um grande desafio.
            </p>
            <p>
                Mas, ao olhar com atenção, Zeke viu pedras grandes e planas que formavam um caminho de um lado ao outro.
                Respirou fundo, ajeitou sua mochilinha de nozes nas costas e deu o primeiro salto.
            </p>
            <p>
                Uma, duas, três pedras... cada pulo exigia coragem e equilíbrio. No último salto, quase escorregou, mas conseguiu se segurar em um galho e alcançar a outra margem.
            </p>
            <div class="highlight">
                "Nada pode me parar agora!"
            </div>
            <p>— disse Zeke, com o peito cheio de orgulho.</p>
        `,
    `
            <h3>Capítulo 4 — A Montanha dos Sussurros</h3>
            <p>
                Depois de atravessar o rio, Zeke chegou ao pé da Montanha dos Sussurros.
                O vento ali falava, ou pelo menos parecia falar. A cada rajada, Zeke ouvia vozes suaves:
            </p>
            <div class="highlight">
                "A coragem mora dentro de ti..."<br>
                "Suba, pequeno viajante, o topo guarda a verdade."
            </div>
            <p>
                Embora um pouco assustado, Zeke não desistiu.
                Ele começou a escalar, agarrando-se em raízes e pedras, enquanto o vento fazia as folhas girarem ao seu redor.
            </p>
            <p>
                Quando finalmente alcançou o topo, a vista o deixou sem fôlego. A floresta se estendia até o horizonte, dourada pelo pôr do sol.
                Ele entendeu, naquele momento, que cada passo difícil o havia tornado mais forte.
            </p>
        `,
    `
            <h3>Capítulo 5 — A Clareira Sagrada</h3>
            <p>
                No amanhecer do dia seguinte, Zeke seguiu o mapa até uma clareira escondida, onde os raios de sol formavam desenhos no chão e o ar parecia brilhar.
                No centro da clareira, sobre uma pedra coberta de musgo, repousava a Noz Dourada.
            </p>
            <p>
                Ela emitia uma luz suave e quente, como se tivesse vida própria.
                Zeke se aproximou lentamente, sentindo o coração bater forte.
                Ele segurou a noz entre as patinhas e, com voz firme, fez seu desejo:
            </p>
            <div class="highlight">
                "Eu desejo que todos os animais da floresta vivam em harmonia e nunca mais passem fome."
            </div>
            <p>
                Assim que terminou, uma brisa dourada soprou pela clareira, e a noz desapareceu em um clarão de luz.
            </p>
        `,
    `
            <h3>Capítulo 6 — O Retorno à Floresta</h3>
            <p>
                Zeke voltou para casa com o coração leve e uma sensação de paz.
                Ao chegar, percebeu algo diferente:
                as árvores estavam mais verdes, os frutos mais abundantes e os riachos mais cristalinos.
            </p>
            <p>
                Os pássaros cantavam felizes, e todos os animais pareciam viver em perfeita harmonia.
                Os outros esquilos o receberam com aplausos e curiosidade, perguntando o que havia acontecido.
            </p>
            <div class="highlight">
                "Às vezes, a maior aventura é aquela que ajuda a todos."
            </div>
            <p>
                Zeke apenas sorriu e disse estas palavras. E, desde aquele dia, Zeke se tornou uma lenda na floresta encantada — não por ter encontrado um tesouro, mas por ter usado seu desejo com bondade e coragem pura.
            </p>
        `,
    `
            <h3>Epílogo — O Legado da Noz Dourada</h3>
            <p>
                Muitos anos se passaram, e o nome de Zeke continuou sendo contado em histórias ao redor das fogueiras.
                Dizem que, em noites de lua cheia, ainda é possível ouvir o vento sussurrando entre as árvores:
            </p>
            <div class="highlight">
                "A verdadeira riqueza está em fazer o bem."
            </div>
            <p>
                E assim, a floresta encantada permaneceu em paz — guardando o segredo do pequeno esquilo que um dia desejou o bem de todos.
            </p>
            <div style="text-align: center; margin-top: 40px; padding: 30px; background: rgba(255,215,0,0.1); border-radius: 15px;">
                <h3 style="color: #ffd700; margin-bottom: 15px;">Fim da História</h3>
                <p style="font-style: italic; color: rgba(255,255,255,0.8);">
                    Esperamos que você tenha gostado desta aventura na floresta encantada!
                </p>
                <button class="btn btn-bookmark" onclick="toggleBookmark()" style="margin-top: 15px;">
                    <i class="far fa-bookmark" id="bookmark-icon-end"></i> Favoritar História
                </button>
            </div>
        `,
  ];

  // Configuração inicial
  function init() {
    loadPage(currentPage);
    createFloatingShapes();
    startReadingTimer();
    updateReadingProgress();

    // Verificar se a história está favoritada
    checkBookmarkStatus();
  }

  // Sistema de paginação
  function loadPage(pageNumber) {
    currentPage = pageNumber;
    bookContent.innerHTML = storyPages[pageNumber - 1];
    pageIndicator.textContent = `Página ${pageNumber} de ${totalPages}`;

    // Atualizar estado dos botões
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Aplicar estilo visual para botões desabilitados
    prevPageBtn.style.opacity = prevPageBtn.disabled ? "0.5" : "1";
    nextPageBtn.style.opacity = nextPageBtn.disabled ? "0.5" : "1";

    // Atualizar progresso
    updateReadingProgress();

    // Rolar para o topo
    bookContent.scrollTop = 0;

    // Atualizar botão de favoritar na última página
    if (currentPage === totalPages) {
      const bookmarkIconEnd = document.getElementById("bookmark-icon-end");
      if (bookmarkIconEnd) {
        bookmarkIconEnd.className = isBookmarked
          ? "fas fa-bookmark"
          : "far fa-bookmark";
      }
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
  }

  // Timer de leitura
  function startReadingTimer() {
    setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - startTime) / 1000 / 60); // minutos
      readingTimeElement.textContent = diff;
    }, 60000); // Atualizar a cada minuto
  }

  // Progresso de leitura
  function updateReadingProgress() {
    const progress = Math.round((currentPage / totalPages) * 100);
    readingProgressElement.textContent = `${progress}%`;
  }

  // Sistema de favoritos
  function toggleBookmark() {
    isBookmarked = !isBookmarked;

    if (isBookmarked) {
      bookmarkIcon.classList.remove("far");
      bookmarkIcon.classList.add("fas");
      showNotification("História adicionada aos favoritos!");

      // Atualizar também o ícone na última página se estiver visível
      const bookmarkIconEnd = document.getElementById("bookmark-icon-end");
      if (bookmarkIconEnd) {
        bookmarkIconEnd.className = "fas fa-bookmark";
      }

      // Salvar no localStorage
      localStorage.setItem("bookmarked_aventura_na_floresta", "true");
    } else {
      bookmarkIcon.classList.remove("fas");
      bookmarkIcon.classList.add("far");
      showNotification("História removida dos favoritos!");

      // Atualizar também o ícone na última página se estiver visível
      const bookmarkIconEnd = document.getElementById("bookmark-icon-end");
      if (bookmarkIconEnd) {
        bookmarkIconEnd.className = "far fa-bookmark";
      }

      // Remover do localStorage
      localStorage.removeItem("bookmarked_aventura_na_floresta");
    }
  }

  function checkBookmarkStatus() {
    const bookmarked = localStorage.getItem("bookmarked_aventura_na_floresta");
    if (bookmarked === "true") {
      isBookmarked = true;
      bookmarkIcon.classList.remove("far");
      bookmarkIcon.classList.add("fas");
    }
  }

  // Compartilhamento
  function shareStory() {
    if (navigator.share) {
      navigator
        .share({
          title: "Aventura na Floresta - ArtFlow Kids",
          text: "Venha ler esta incrível história sobre coragem e amizade!",
          url: window.location.href,
        })
        .then(() => showNotification("História compartilhada com sucesso!"))
        .catch(() => showNotification("Compartilhamento cancelado."));
    } else {
      // Fallback para copiar link
      navigator.clipboard
        .writeText(window.location.href)
        .then(() =>
          showNotification("Link copiado para a área de transferência!")
        )
        .catch(() => showNotification("Não foi possível copiar o link."));
    }
  }

  // Funções auxiliares
  function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");

    notificationText.textContent = message;
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
    }, 3000);
  }

  function goBack() {
    if (
      confirm(
        "Tem certeza que deseja voltar? Seu progresso de leitura será salvo."
      )
    ) {
      window.location.href = "../index.html";
    }
  }

  function createFloatingShapes() {
    const container = document.querySelector(".floating-shapes");
    const colors = ["purple", "gold"];

    for (let i = 0; i < 15; i++) {
      const shape = document.createElement("div");
      shape.classList.add(
        "floating-shape",
        colors[Math.floor(Math.random() * colors.length)]
      );

      const size = Math.random() * 60 + 20;
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.animationDelay = `${Math.random() * 20}s`;
      shape.style.animationDuration = `${15 + Math.random() * 10}s`;

      container.appendChild(shape);
    }
  }

  // Navegação por teclado
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") {
      nextPage();
    } else if (e.key === "ArrowLeft") {
      previousPage();
    }
  });

  // Inicialização
  init();

  // Atribuir funções globais
  window.nextPage = nextPage;
  window.previousPage = previousPage;
  window.goBack = goBack;
  window.toggleBookmark = toggleBookmark;
  window.shareStory = shareStory;
});
