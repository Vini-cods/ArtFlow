// aventura.js - Versão com paginação da história
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const bookContent = document.getElementById("book-content");
  const pageIndicator = document.getElementById("page-indicator");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  // Estado do desenho
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentTool = "pencil";
  let currentColor = "#000000";
  let brushSize = 5;
  let opacity = 1;
  let drawingHistory = [];
  let historyStep = -1;

  // Sistema de paginação
  let currentPage = 1;
  const totalPages = 7;
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
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "Aquele que seguir este caminho encontrará a Noz Dourada — fonte de um único e verdadeiro desejo."
      </p>
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
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "Nada pode me parar agora!"
      </p>
      <p>— disse Zeke, com o peito cheio de orgulho.</p>
    `,
    `
      <h3>Capítulo 4 — A Montanha dos Sussurros</h3>
      <p>
        Depois de atravessar o rio, Zeke chegou ao pé da Montanha dos Sussurros.
        O vento ali falava, ou pelo menos parecia falar. A cada rajada, Zeke ouvia vozes suaves:
      </p>
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "A coragem mora dentro de ti..."<br>
        "Suba, pequeno viajante, o topo guarda a verdade."
      </p>
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
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "Eu desejo que todos os animais da floresta vivam em harmonia e nunca mais passem fome."
      </p>
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
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "Às vezes, a maior aventura é aquela que ajuda a todos."
      </p>
      <p>
        Zeke apenas sorriu e disse estas palavras. E, desde aquele dia, Zeke se tornou uma lenda na floresta encantada — não por ter encontrado um tesouro, mas por ter usado seu desejo com bondade e coração puro.
      </p>
    `,
    `
      <h3>Epílogo — O Legado da Noz Dourada</h3>
      <p>
        Muitos anos se passaram, e o nome de Zeke continuou sendo contado em histórias ao redor das fogueiras.
        Dizem que, em noites de lua cheia, ainda é possível ouvir o vento sussurrando entre as árvores:
      </p>
      <p style="text-align: center; font-style: italic; margin: 20px 0; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
        "A verdadeira riqueza está em fazer o bem."
      </p>
      <p>
        E assim, a floresta encantada permaneceu em paz — guardando o segredo do pequeno esquilo que um dia desejou o bem de todos.
      </p>
      <div style="text-align: center; margin-top: 30px; font-style: italic; color: #ffd700;">
        ~ Fim ~
      </div>
    `,
  ];

  // Configuração inicial
  function init() {
    setupCanvas();
    setupEventListeners();
    createFloatingShapes();
    updateUndoRedoButtons();
    loadPage(currentPage);
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

  function setupCanvas() {
    resizeCanvas();
    setupCanvasContext(ctx);
    saveDrawingState();
  }

  function setupCanvasContext(context) {
    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = brushSize;
    context.strokeStyle = currentColor;
    context.globalAlpha = opacity;
  }

  function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }

  function setupEventListeners() {
    // Eventos do canvas
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("touchstart", handleTouchStart);

    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("touchmove", handleTouchMove);

    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Ferramentas
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        selectTool(this.getAttribute("data-tool"));
      });
    });

    // Cores
    document.querySelectorAll(".color-option").forEach((color) => {
      color.addEventListener("click", function () {
        selectColor(this.getAttribute("data-color"));
      });
    });

    // Color picker
    document
      .getElementById("color-picker")
      .addEventListener("input", function () {
        selectColor(this.value);
      });

    // Controles
    document
      .getElementById("brush-size")
      .addEventListener("input", function () {
        updateBrushSize(this.value);
      });

    document.getElementById("opacity").addEventListener("input", function () {
      updateOpacity(this.value);
    });
  }

  // Funções de desenho
  function startDrawing(e) {
    isDrawing = true;
    const coords = getCoordinates(e);
    [lastX, lastY] = coords;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  }

  function draw(e) {
    if (!isDrawing) return;

    const coords = getCoordinates(e);
    const [x, y] = coords;

    ctx.lineTo(x, y);
    ctx.stroke();

    [lastX, lastY] = [x, y];
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      saveDrawingState();
    }
  }

  function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e.touches[0]);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    draw(e.touches[0]);
  }

  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.type.includes("touch")) {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return [x, y];
  }

  // Seleção de ferramentas e cores
  function selectTool(tool) {
    currentTool = tool;

    // Atualizar UI
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-tool") === tool) {
        btn.classList.add("active");
      }
    });

    updateCursor();
  }

  function selectColor(color) {
    currentColor = color;
    ctx.strokeStyle = color;

    // Atualizar UI
    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("active");
      if (option.getAttribute("data-color") === color) {
        option.classList.add("active");
      }
    });

    // Atualizar color picker
    document.getElementById("color-picker").value = color;
  }

  function updateBrushSize(size) {
    brushSize = parseInt(size);
    ctx.lineWidth = brushSize;

    // Atualizar UI
    document.getElementById("brush-size-value").textContent = brushSize + "px";
  }

  function updateOpacity(value) {
    opacity = parseInt(value) / 100;
    ctx.globalAlpha = opacity;

    // Atualizar UI
    document.getElementById("opacity-value").textContent = value + "%";
  }

  function updateCursor() {
    const cursor = currentTool === "eraser" ? "crosshair" : "crosshair";
    canvas.style.cursor = cursor;
  }

  // Histórico de desenho
  function saveDrawingState() {
    if (historyStep < drawingHistory.length - 1) {
      drawingHistory = drawingHistory.slice(0, historyStep + 1);
    }

    drawingHistory.push(canvas.toDataURL());
    historyStep = drawingHistory.length - 1;
    updateUndoRedoButtons();
  }

  function undoDrawing() {
    if (historyStep > 0) {
      historyStep--;
      redrawFromHistory();
      updateUndoRedoButtons();
    }
  }

  function redoDrawing() {
    if (historyStep < drawingHistory.length - 1) {
      historyStep++;
      redrawFromHistory();
      updateUndoRedoButtons();
    }
  }

  function redrawFromHistory() {
    const img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = drawingHistory[historyStep];
  }

  function updateUndoRedoButtons() {
    const undoBtn = document.getElementById("undo-action");
    const redoBtn = document.getElementById("redo-action");

    undoBtn.disabled = historyStep <= 0;
    redoBtn.disabled = historyStep >= drawingHistory.length - 1;
  }

  // Ações principais
  function clearCanvas() {
    if (confirm("Tem certeza que deseja limpar o desenho?")) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveDrawingState();
    }
  }

  function saveDrawing() {
    const link = document.createElement("a");
    link.download = "aventura-na-floresta.png";
    link.href = canvas.toDataURL();
    link.click();
    showNotification("Desenho salvo com sucesso!");
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
        "Tem certeza que deseja voltar? Seu desenho não salvo será perdido."
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

  // Inicialização
  init();

  // Redimensionar quando a janela for redimensionada
  window.addEventListener("resize", function () {
    resizeCanvas();
  });

  // Atribuir funções globais
  window.undoDrawing = undoDrawing;
  window.redoDrawing = redoDrawing;
  window.clearCanvas = clearCanvas;
  window.saveDrawing = saveDrawing;
  window.goBack = goBack;
  window.nextPage = nextPage;
  window.previousPage = previousPage;
});
