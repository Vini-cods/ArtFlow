// drawing-enhanced.js - Versão completa com todas as ferramentas funcionando
document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const clearBtn = document.getElementById("clear-btn");
  const saveBtn = document.getElementById("save-btn");
  const toolButtons = document.querySelectorAll(".tool-btn");
  const colorButtons = document.querySelectorAll(".color-btn");
  const colorPickerBtn = document.getElementById("color-picker-btn");
  const colorPicker = document.getElementById("color-picker");
  const brushSizeSlider = document.getElementById("brush-size");
  const brushSizeValue = document.getElementById("brush-size-value");
  const opacitySlider = document.getElementById("opacity");
  const opacityValue = document.getElementById("opacity-value");
  const undoBtn = document.getElementById("undo-action");
  const redoBtn = document.getElementById("redo-action");
  const shapeOptions = document.getElementById("shape-options");
  const shapeButtons = document.querySelectorAll(".shape-btn");

  // Variáveis de estado
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentTool = "pencil";
  let currentColor = "#000000";
  let currentLineWidth = 5;
  let opacity = 1;
  let drawingHistory = [];
  let historyIndex = -1;
  let isSpraying = false;
  let currentShape = "rectangle";
  let startX, startY;
  let snapshot;

  // Configuração do canvas
  function resizeCanvas() {
    const container = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;

    // Ajustar para alta resolução
    canvas.width = container.offsetWidth * dpr;
    canvas.height = container.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    // Configurar estilo inicial
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
    ctx.globalAlpha = opacity;

    // Restaurar desenho se existir
    const savedDrawing = localStorage.getItem("drawing");
    if (savedDrawing) {
      const img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedDrawing;
    }

    // Salvar estado inicial
    saveCanvasState();
  }

  // Função para salvar o estado atual do canvas
  function saveCanvasState() {
    // Limitar o histórico aos últimos 50 estados
    if (historyIndex < drawingHistory.length - 1) {
      drawingHistory = drawingHistory.slice(0, historyIndex + 1);
    }

    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    historyIndex = drawingHistory.length - 1;

    // Atualizar estados dos botões
    updateUndoRedoButtons();
  }

  // Função para atualizar estados dos botões de desfazer/refazer
  function updateUndoRedoButtons() {
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= drawingHistory.length - 1;

    // Aplicar estilo visual para botões desabilitados
    if (undoBtn.disabled) {
      undoBtn.style.opacity = "0.5";
      undoBtn.style.cursor = "not-allowed";
    } else {
      undoBtn.style.opacity = "1";
      undoBtn.style.cursor = "pointer";
    }

    if (redoBtn.disabled) {
      redoBtn.style.opacity = "0.5";
      redoBtn.style.cursor = "not-allowed";
    } else {
      redoBtn.style.opacity = "1";
      redoBtn.style.cursor = "pointer";
    }
  }

  // Inicializar canvas
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Função para tirar snapshot do canvas
  function takeSnapshot() {
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Funções de desenho
  function startDrawing(e) {
    isDrawing = true;

    // Obter coordenadas corretas considerando a posição do canvas
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    startX = lastX;
    startY = lastY;

    takeSnapshot();

    if (currentTool === "spray") {
      isSpraying = true;
      sprayPaint();
    } else if (currentTool === "fill") {
      floodFill(lastX, lastY, hexToRgb(currentColor));
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    }
  }

  function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    if (
      currentTool === "pencil" ||
      currentTool === "brush" ||
      currentTool === "marker" ||
      currentTool === "eraser"
    ) {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    } else if (currentTool === "shapes") {
      // Restaurar snapshot para desenhar a forma temporariamente
      ctx.putImageData(snapshot, 0, 0);
      drawShape(startX, startY, currentX, currentY);
    }

    lastX = currentX;
    lastY = currentY;
  }

  function stopDrawing() {
    if (isDrawing) {
      if (currentTool === "shapes") {
        const rect = canvas.getBoundingClientRect();
        const currentX = lastX;
        const currentY = lastY;
        drawShape(startX, startY, currentX, currentY);
      }

      isDrawing = false;
      isSpraying = false;

      // Salvar estado após terminar de desenhar
      saveCanvasState();

      // Salvar automaticamente o progresso
      saveProgress();
    }
  }

  // Função para spray
  function sprayPaint() {
    if (!isSpraying) return;

    const density = 50;
    const radius = currentLineWidth;

    for (let i = 0; i < density; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = lastX + Math.cos(angle) * distance;
      const y = lastY + Math.sin(angle) * distance;

      ctx.beginPath();
      ctx.arc(x, y, currentLineWidth / 10, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isSpraying) {
      requestAnimationFrame(sprayPaint);
    }
  }

  // Função para preenchimento (flood fill)
  function floodFill(x, y, fillColor) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelData = imageData.data;
    const targetColor = getPixelColor(x, y, pixelData);

    // Se a cor de preenchimento é igual à cor do alvo, sair
    if (colorsMatch(targetColor, fillColor)) return;

    const pixelStack = [[Math.floor(x), Math.floor(y)]];
    const width = canvas.width;
    const height = canvas.height;

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      x = newPos[0];
      y = newPos[1];

      // Obter a posição atual do pixel
      let pixelPos = (y * width + x) * 4;

      // Ir para cima enquanto encontrar a cor alvo
      while (
        y >= 0 &&
        colorsMatch(getPixelColorAtPos(pixelPos, pixelData), targetColor)
      ) {
        y--;
        pixelPos = (y * width + x) * 4;
      }

      // Ir para baixo enquanto encontrar a cor alvo
      pixelPos = ((y + 1) * width + x) * 4;
      let reachLeft = false;
      let reachRight = false;

      for (y = y + 1; y < height; y++) {
        pixelPos = (y * width + x) * 4;

        if (
          !colorsMatch(getPixelColorAtPos(pixelPos, pixelData), targetColor)
        ) {
          break;
        }

        // Colorir o pixel
        setPixelColorAtPos(pixelPos, fillColor, pixelData);

        // Verificar vizinhos à esquerda e direita
        if (x > 0) {
          const leftPos = pixelPos - 4;
          if (
            colorsMatch(getPixelColorAtPos(leftPos, pixelData), targetColor)
          ) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          const rightPos = pixelPos + 4;
          if (
            colorsMatch(getPixelColorAtPos(rightPos, pixelData), targetColor)
          ) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        pixelPos += width * 4;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    saveCanvasState();
  }

  // Funções auxiliares para flood fill
  function getPixelColor(x, y, pixelData) {
    const pixelPos = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
    return getPixelColorAtPos(pixelPos, pixelData);
  }

  function getPixelColorAtPos(pixelPos, pixelData) {
    return {
      r: pixelData[pixelPos],
      g: pixelData[pixelPos + 1],
      b: pixelData[pixelPos + 2],
      a: pixelData[pixelPos + 3],
    };
  }

  function setPixelColorAtPos(pixelPos, color, pixelData) {
    pixelData[pixelPos] = color.r;
    pixelData[pixelPos + 1] = color.g;
    pixelData[pixelPos + 2] = color.b;
    pixelData[pixelPos + 3] = color.a !== undefined ? color.a : 255;
  }

  function colorsMatch(color1, color2) {
    return (
      color1.r === color2.r && color1.g === color2.g && color1.b === color2.b
    );
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
          a: 255,
        }
      : { r: 0, g: 0, b: 0, a: 255 };
  }

  // Função para desenhar formas
  function drawShape(startX, startY, endX, endY) {
    ctx.beginPath();

    switch (currentShape) {
      case "rectangle":
        const width = endX - startX;
        const height = endY - startY;
        ctx.rect(startX, startY, width, height);
        break;
      case "circle":
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        break;
      case "triangle":
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.lineTo(startX * 2 - endX, endY);
        ctx.closePath();
        break;
      case "line":
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        break;
    }

    ctx.stroke();
  }

  // Event listeners para o canvas
  canvas.addEventListener("mousedown", startDrawing);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", stopDrawing);
  canvas.addEventListener("mouseout", stopDrawing);

  // Para dispositivos touch
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    canvas.dispatchEvent(mouseEvent);
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    const mouseEvent = new MouseEvent("mouseup", {});
    canvas.dispatchEvent(mouseEvent);
  });

  // Ferramentas de desenho
  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover classe ativa de todos os botões
      toolButtons.forEach((btn) => btn.classList.remove("active"));

      // Adicionar classe ativa ao botão clicado
      button.classList.add("active");

      // Alterar ferramenta
      currentTool = button.getAttribute("data-tool");

      // Mostrar/ocultar opções de formas
      if (currentTool === "shapes") {
        shapeOptions.style.display = "flex";
      } else {
        shapeOptions.style.display = "none";
      }

      // Configurar contexto de acordo com a ferramenta
      switch (currentTool) {
        case "pencil":
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = currentLineWidth;
          ctx.strokeStyle = currentColor;
          ctx.globalAlpha = opacity;
          break;
        case "brush":
          ctx.globalCompositeOperation = "source-over";
          ctx.lineWidth = currentLineWidth * 2;
          ctx.strokeStyle = currentColor;
          ctx.globalAlpha = opacity;
          break;
        case "marker":
          ctx.globalCompositeOperation = "multiply";
          ctx.lineWidth = currentLineWidth * 3;
          ctx.strokeStyle = currentColor;
          ctx.globalAlpha = 0.5;
          break;
        case "spray":
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = currentColor;
          ctx.globalAlpha = opacity * 0.7;
          break;
        case "eraser":
          ctx.globalCompositeOperation = "destination-out";
          ctx.lineWidth = currentLineWidth * 4;
          ctx.globalAlpha = 0.7;
          break;
        case "fill":
          ctx.globalCompositeOperation = "source-over";
          break;
        case "shapes":
          ctx.globalCompositeOperation = "source-over";
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = currentLineWidth;
          ctx.globalAlpha = opacity;
          break;
      }
    });
  });

  // Paleta de cores
  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover classe ativa de todos os botões
      colorButtons.forEach((btn) => btn.classList.remove("active"));

      // Adicionar classe ativa ao botão clicado
      button.classList.add("active");

      // Alterar cor
      currentColor = button.getAttribute("data-color");
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;

      // Para ferramentas que usam fillStyle
      if (currentTool === "spray" || currentTool === "fill") {
        ctx.fillStyle = currentColor;
      }
    });
  });

  // Seletor de cor personalizado
  colorPicker.addEventListener("input", function (e) {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;

    // Atualizar botão ativo na paleta
    colorButtons.forEach((btn) => btn.classList.remove("active"));

    // Criar ou ativar um botão de cor personalizada
    activateCustomColor(this.value);
  });

  function activateCustomColor(color) {
    // Verificar se já existe um botão de cor personalizada
    let customColorBtn = document.querySelector(".color-btn.custom");

    if (!customColorBtn) {
      // Criar um novo botão para a cor personalizada
      customColorBtn = document.createElement("div");
      customColorBtn.className = "color-btn custom active";
      customColorBtn.style.backgroundColor = color;
      customColorBtn.setAttribute("data-color", color);

      // Adicionar à paleta de cores
      const colorPalette = document.querySelector(".color-palette");
      colorPalette.appendChild(customColorBtn);

      // Adicionar event listener ao novo botão
      customColorBtn.addEventListener("click", function () {
        colorButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        currentColor = this.getAttribute("data-color");
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
      });
    } else {
      // Atualizar a cor existente
      customColorBtn.style.backgroundColor = color;
      customColorBtn.setAttribute("data-color", color);
      customColorBtn.classList.add("active");
    }
  }

  colorPickerBtn.addEventListener("click", function () {
    colorPicker.click();
  });

  // Controle de tamanho do pincel
  brushSizeSlider.addEventListener("input", function () {
    currentLineWidth = this.value;
    brushSizeValue.textContent = `${currentLineWidth}px`;

    // Atualizar o contexto com o novo tamanho
    if (
      currentTool === "pencil" ||
      currentTool === "brush" ||
      currentTool === "shapes"
    ) {
      ctx.lineWidth = currentLineWidth;
    } else if (currentTool === "marker") {
      ctx.lineWidth = currentLineWidth * 3;
    } else if (currentTool === "eraser") {
      ctx.lineWidth = currentLineWidth * 4;
    }
  });

  // Controle de opacidade
  opacitySlider.addEventListener("input", function () {
    opacity = this.value / 100;
    opacityValue.textContent = `${this.value}%`;
    ctx.globalAlpha = opacity;
  });

  // Opções de formas
  shapeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remover classe ativa de todos os botões
      shapeButtons.forEach((btn) => btn.classList.remove("active"));

      // Adicionar classe ativa ao botão clicado
      button.classList.add("active");

      // Alterar forma
      currentShape = button.getAttribute("data-shape");
    });
  });

  // Limpar canvas
  clearBtn.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja limpar todo o desenho?")) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasState();
    }
  });

  // Desfazer ação
  undoBtn.addEventListener("click", () => {
    if (historyIndex > 0) {
      historyIndex--;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
    }
  });

  // Refazer ação
  redoBtn.addEventListener("click", () => {
    if (historyIndex < drawingHistory.length - 1) {
      historyIndex++;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
    }
  });

  // Salvar desenho
  saveBtn.addEventListener("click", function () {
    saveDrawing();
  });

  function saveProgress() {
    const dataURL = canvas.toDataURL("image/png");
    localStorage.setItem("drawing", dataURL);
  }

  function saveDrawing() {
    const dataURL = canvas.toDataURL("image/png");

    // Solicitar um nome para o desenho
    const drawingName = prompt(
      "Dê um nome para o seu desenho:",
      `Meu Desenho ${new Date().toLocaleDateString("pt-BR")}`
    );

    if (!drawingName) return; // Usuário cancelou

    // Salvar no localStorage com uma estrutura que a página Meus Desenhos possa entender
    const drawingData = {
      id: Date.now().toString(), // ID único
      title: drawingName,
      image: dataURL,
      date: new Date().toISOString(),
      size: `${canvas.width}x${canvas.height}`,
      favorite: false,
      shared: false,
    };

    // Recuperar desenhos existentes ou criar um array vazio
    let drawings = JSON.parse(localStorage.getItem("artflow-drawings")) || [];

    // Adicionar o novo desenho
    drawings.push(drawingData);

    // Salvar no localStorage
    localStorage.setItem("artflow-drawings", JSON.stringify(drawings));

    // Mostrar notificação
    showNotification("Desenho salvo com sucesso!");

    // Limpar o canvas após salvar
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      localStorage.removeItem("drawing");
      drawingHistory = [];
      historyIndex = -1;
      saveCanvasState();
    }, 1000);
  }

  function showNotification(message) {
    // Criar elemento de notificação se não existir
    let notification = document.getElementById("notification");
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "notification";
      notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(45, 21, 84, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            `;

      const icon = document.createElement("i");
      icon.className = "fas fa-check-circle";

      const text = document.createElement("span");
      text.id = "notification-text";

      notification.appendChild(icon);
      notification.appendChild(text);
      document.body.appendChild(notification);
    }

    const notificationText = document.getElementById("notification-text");
    notificationText.textContent = message;

    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";

    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
    }, 3000);
  }

  // Inicializar o botão de lápis como ativo
  document.querySelector('[data-tool="pencil"]').classList.add("active");

  // Inicializar o botão de preto como ativo
  document.querySelector('[data-color="#000000"]').classList.add("active");

  // Inicializar o botão de retângulo como ativo
  document.querySelector('[data-shape="rectangle"]').classList.add("active");

  // Atualizar estado inicial dos botões
  updateUndoRedoButtons();
});
