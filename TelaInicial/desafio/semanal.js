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
  const submitBtn = document.getElementById("submit-drawing");
  const uploadInput = document.getElementById("upload-image");

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

    // Garantir fundo branco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = currentColor;

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

  // Função para desfazer
  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
      showNotification("Ação desfeita");
    }
  }

  // Função para refazer
  function redo() {
    if (historyIndex < drawingHistory.length - 1) {
      historyIndex++;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
      showNotification("Ação refeita");
    }
  }

  // Função para limpar o canvas
  function clearCanvas() {
    if (confirm("Tem certeza que deseja limpar todo o desenho?")) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = currentColor;
      saveCanvasState();
      showNotification("Canvas limpo!");
    }
  }

  // Função para salvar o desenho
  function saveDrawing() {
    try {
      // Criar um canvas temporário para exportação
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;

      // Configurar o canvas temporário
      tempCanvas.width = canvas.width / dpr;
      tempCanvas.height = canvas.height / dpr;

      // Desenhar o conteúdo no canvas temporário
      tempCtx.fillStyle = "white";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

      // Criar link de download
      const link = document.createElement("a");
      link.download = `desafio-semanal-artflow-${new Date().getTime()}.png`;
      link.href = tempCanvas.toDataURL("image/png");
      link.click();

      showNotification("Desenho salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar desenho:", error);
      showNotification("Erro ao salvar desenho. Tente novamente.", "error");
    }
  }

  // Função para mostrar notificação
  function showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");
    const notificationIcon = notification.querySelector("i");

    // Atualizar conteúdo
    notificationText.textContent = message;

    // Atualizar ícone baseado no tipo
    if (type === "error") {
      notificationIcon.className = "fas fa-exclamation-circle";
      notification.style.background =
        "linear-gradient(45deg, #ff6b6b, #ff9e7d)";
    } else {
      notificationIcon.className = "fas fa-check-circle";
      notification.style.background =
        "linear-gradient(45deg, #4caf50, #8bc34a)";
    }

    // Mostrar notificação
    notification.style.opacity = "1";
    notification.style.transform = "translateY(0)";

    // Ocultar após 3 segundos
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateY(20px)";
    }, 3000);
  }

  // Funções de desenho
  function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    [lastX, lastY] = [pos.x, pos.y];

    if (currentTool === "spray") {
      isSpraying = true;
      sprayPaint();
    } else {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
    }
  }

  function draw(e) {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const currentX = pos.x;
    const currentY = pos.y;

    if (
      currentTool === "pencil" ||
      currentTool === "brush" ||
      currentTool === "marker" ||
      currentTool === "eraser"
    ) {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }

    lastX = currentX;
    lastY = currentY;
  }

  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      isSpraying = false;
      saveCanvasState();
    }
  }

  // Função para pintura com spray
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

  // Função para obter posição do mouse/touch
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.type.includes("touch")) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  // Função para fazer upload de imagem
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      showNotification("Por favor, selecione uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        // Limpar canvas e desenhar a imagem
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = currentColor;

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const width = img.width * scale;
        const height = img.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(img, x, y, width, height);
        saveCanvasState();
        showNotification("Imagem carregada com sucesso!");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Função para enviar desenho
  function submitDrawing() {
    // Verificar se há algo desenhado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let isEmpty = true;

    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] !== 0) {
        isEmpty = false;
        break;
      }
    }

    if (isEmpty) {
      showNotification("Por favor, faça um desenho antes de enviar!");
      return;
    }

    // Simular envio (em uma aplicação real, isso enviaria para um servidor)
    showNotification("Desenho enviado com sucesso! Boa sorte no desafio!");

    // Resetar o canvas após envio
    setTimeout(() => {
      if (confirm("Deseja começar um novo desenho?")) {
        clearCanvas();
      }
    }, 2000);
  }

  // Event Listeners para o canvas
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

  // Event Listeners para ferramentas
  toolButtons.forEach((button) => {
    button.addEventListener("click", function () {
      toolButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      currentTool = this.dataset.tool;

      // Configurações específicas por ferramenta
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
      }
    });
  });

  // Event Listeners para cores
  colorButtons.forEach((button) => {
    button.addEventListener("click", function () {
      colorButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      currentColor = this.dataset.color;
      ctx.strokeStyle = currentColor;
      ctx.fillStyle = currentColor;

      // Enviar cor para Arduino LED se conectado
      if (window.arduino && window.arduino.connected) {
        window.sendColorToArduino(currentColor);
      }
    });
  });

  // Event Listener para o seletor de cor
  colorPickerBtn.addEventListener("click", function () {
    colorPicker.click();
  });

  colorPicker.addEventListener("input", function () {
    currentColor = this.value;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;

    // Atualizar botão de cor ativa
    colorButtons.forEach((btn) => btn.classList.remove("active"));

    // Enviar cor para Arduino LED se conectado
    if (window.arduino && window.arduino.connected) {
      window.sendColorToArduino(currentColor);
    }
  });

  // Event Listeners para controles deslizantes
  brushSizeSlider.addEventListener("input", function () {
    currentLineWidth = this.value;
    brushSizeValue.textContent = `${currentLineWidth}px`;

    if (currentTool !== "spray") {
      ctx.lineWidth = currentLineWidth;
    }
  });

  opacitySlider.addEventListener("input", function () {
    opacity = this.value / 100;
    opacityValue.textContent = `${this.value}%`;
    ctx.globalAlpha = opacity;
  });

  // Event Listeners para botões
  clearBtn.addEventListener("click", clearCanvas);
  saveBtn.addEventListener("click", saveDrawing);
  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);
  submitBtn.addEventListener("click", submitDrawing);
  uploadInput.addEventListener("change", handleImageUpload);

  // Inicialização
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Criar bolinhas flutuantes interativas
  createFloatingShapes();

  // Função para criar bolinhas flutuantes
  function createFloatingShapes() {
    const shapesContainer = document.querySelector(".floating-shapes");
    const colors = ["purple", "gold"];

    for (let i = 0; i < 12; i++) {
      const shape = document.createElement("div");
      shape.className = `floating-shape ${colors[i % colors.length]}`;

      // Posição e tamanho aleatórios
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 15;

      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${left}%`;
      shape.style.top = `${top}%`;
      shape.style.animationDelay = `${delay}s`;

      // Efeito de clique
      shape.addEventListener("click", function () {
        this.style.transform = "scale(1.5)";
        this.style.opacity = "0";
        setTimeout(() => {
          this.remove();
        }, 300);
      });

      shapesContainer.appendChild(shape);
    }
  }

  // Atualizar contador regressivo
  updateCountdown();
  setInterval(updateCountdown, 60000); // Atualizar a cada minuto

  function updateCountdown() {
    // Data de término (domingo às 23:59)
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + (7 - now.getDay())); // Próximo domingo
    endDate.setHours(23, 59, 59, 999);

    const timeLeft = endDate - now;

    if (timeLeft <= 0) {
      document.getElementById("countdown").innerHTML = "Desafio encerrado!";
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.5";
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
  }

  // Prevenir menu de contexto no canvas
  canvas.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  // Inicializar botões de desfazer/refazer
  updateUndoRedoButtons();

  // Mostrar mensagem de boas-vindas
  setTimeout(() => {
    showNotification(
      "Bem-vindo ao Desafio Semanal! Crie seu animal fantástico!"
    );
  }, 1000);
});
