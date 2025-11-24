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

  // Funções de desenho
  function startDrawing(e) {
    isDrawing = true;

    // Obter coordenadas corretas considerando a posição do canvas
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

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
    }

    lastX = currentX;
    lastY = currentY;
  }

  function stopDrawing() {
    if (isDrawing) {
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
      if (currentTool === "spray") {
        ctx.fillStyle = currentColor;
      }

      // ENVIAR COR PARA ARDUINO LED
      if (window.arduino && window.arduino.connected) {
        window.arduino.sendColorCommand(currentColor);
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

    // ENVIAR COR PARA ARDUINO LED
    if (window.arduino && window.arduino.connected) {
      window.arduino.sendColorCommand(currentColor);
    }
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

        // ENVIAR COR PARA ARDUINO LED
        if (window.arduino && window.arduino.connected) {
          window.arduino.sendColorCommand(currentColor);
        }
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

  // Controles de tamanho e opacidade
  brushSizeSlider.addEventListener("input", function () {
    currentLineWidth = this.value;
    brushSizeValue.textContent = `${this.value}px`;

    // Atualizar tamanho da linha
    if (currentTool !== "spray") {
      ctx.lineWidth = currentLineWidth;
    }
  });

  opacitySlider.addEventListener("input", function () {
    opacity = this.value / 100;
    opacityValue.textContent = `${this.value}%`;
    ctx.globalAlpha = opacity;
  });

  // Botões de ação
  clearBtn.addEventListener("click", function () {
    if (confirm("Tem certeza que deseja limpar o desenho?")) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasState();
      showNotification("Desenho limpo!");
    }
  });

  saveBtn.addEventListener("click", function () {
    saveDrawing();
  });

  undoBtn.addEventListener("click", function () {
    if (historyIndex > 0) {
      historyIndex--;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
      showNotification("Ação desfeita");
    }
  });

  redoBtn.addEventListener("click", function () {
    if (historyIndex < drawingHistory.length - 1) {
      historyIndex++;
      ctx.putImageData(drawingHistory[historyIndex], 0, 0);
      updateUndoRedoButtons();
      showNotification("Ação refeita");
    }
  });

  // Função para salvar desenho
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
      link.download = `desenho-artflow-${new Date().getTime()}.png`;
      link.href = tempCanvas.toDataURL("image/png");
      link.click();

      showNotification("Desenho salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar desenho:", error);
      showNotification("Erro ao salvar desenho. Tente novamente.", "error");
    }
  }

  // Função para salvar progresso automaticamente
  function saveProgress() {
    try {
      const dataURL = canvas.toDataURL("image/png");
      localStorage.setItem("drawing", dataURL);
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
    }
  }

  // Função para mostrar notificações
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

  // Criar bolinhas flutuantes
  function createFloatingShapes() {
    const container = document.querySelector(".floating-shapes");
    if (!container) return;

    // Limpar shapes existentes
    container.innerHTML = "";

    // Criar diferentes tamanhos e cores de bolinhas - MENOS BOLINHAS E MENORES
    const shapeConfigs = [
      { size: 30, color: "purple", count: 4 },
      { size: 20, color: "gold", count: 3 },
      { size: 15, color: "purple", count: 5 },
      { size: 25, color: "gold", count: 3 },
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
          shape.style.transform = "scale(1.3)";
          shape.style.opacity = "0.7";
        });

        shape.addEventListener("mouseout", () => {
          shape.style.transform = "scale(1)";
          shape.style.opacity = "0.4";
        });

        // Adicionar interação ao clicar
        shape.addEventListener("click", () => {
          shape.style.animation = "none";
          shape.style.transform = "scale(1.5)";
          shape.style.opacity = "0.8";

          setTimeout(() => {
            shape.style.animation = `float ${8 + Math.random() * 4
              }s ease-in-out infinite`;
            shape.style.transform = "scale(1)";
            shape.style.opacity = "0.4";
          }, 500);
        });

        container.appendChild(shape);
      }
    });
  }

  // Inicializar bolinhas flutuantes
  createFloatingShapes();

  // Atualizar botões de desfazer/refazer inicialmente
  updateUndoRedoButtons();

  // Mostrar mensagem de boas-vindas
  setTimeout(() => {
    showNotification("Bem-vindo ao ArtFlow! Comece a desenhar!");
  }, 1000);

  // Web Serial API para comunicação com Arduino - Versão Simplificada
  class ArduinoPotentiometer {
    constructor() {
      this.port = null;
      this.reader = null;
      this.isConnected = false;
      this.readerActive = false;
    }

    async connect() {
      try {
        // Verificar se a Web Serial API está disponível
        if (!('serial' in navigator)) {
          this.showNotification("Web Serial não suportada neste navegador", "error");
          return;
        }

        // Solicitar porta serial
        this.port = await navigator.serial.requestPort();

        // Abrir a porta
        await this.port.open({
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        });

        this.isConnected = true;
        this.readerActive = true;
        this.startReading();

        this.showNotification("Conectado ao Arduino!", "success");
        this.updateConnectButton();

      } catch (err) {
        console.error("Erro ao conectar:", err);
        this.showNotification("Erro: " + err.message, "error");
      }
    }

    async startReading() {
      try {
        while (this.port.readable && this.readerActive) {
          const textDecoder = new TextDecoderStream();
          const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
          this.reader = textDecoder.readable.getReader();

          try {
            while (true) {
              const { value, done } = await this.reader.read();
              if (done) break;

              if (value) {
                // Processar cada linha recebida
                const lines = value.split('\n');
                for (const line of lines) {
                  const trimmedLine = line.trim();
                  if (trimmedLine) {
                    const num = parseInt(trimmedLine);
                    if (!isNaN(num) && num >= 1 && num <= 100) {
                      this.updateBrush(num);
                    }
                  }
                }
              }
            }
          } catch (readError) {
            console.error("Erro na leitura:", readError);
          } finally {
            this.reader.releaseLock();
          }
        }
      } catch (err) {
        console.error("Erro no stream:", err);
      }
    }

    updateBrush(size) {
      const brushSizeSlider = document.getElementById("brush-size");
      const brushSizeValue = document.getElementById("brush-size-value");

      if (brushSizeSlider && brushSizeValue) {
        // Limitar entre 1 e 100
        size = Math.min(Math.max(size, 1), 100);

        // Atualizar slider e valor
        brushSizeSlider.value = size;
        brushSizeValue.textContent = size + "px";

        // Disparar evento para atualizar o pincel
        const inputEvent = new Event('input', { bubbles: true });
        brushSizeSlider.dispatchEvent(inputEvent);
      }
    }

    async sendColorCommand(colorHex) {
      if (!this.isConnected || !this.port) {
        console.warn("Arduino não conectado");
        return;
      }

      try {
        const command = `COLOR:${colorHex}\n`;
        const encoder = new TextEncoder();

        if (this.port.writable) {
          const writer = this.port.writable.getWriter();
          await writer.write(encoder.encode(command));
          writer.releaseLock();
          console.log("🎨 Cor enviada para Arduino:", colorHex);
        }
      } catch (error) {
        console.error("Erro ao enviar cor para Arduino:", error);
      }
    }

    async disconnect() {
      try {
        this.readerActive = false;

        if (this.reader) {
          await this.reader.cancel();
        }

        if (this.port) {
          await this.port.close();
        }

        this.isConnected = false;
        this.updateConnectButton();
        this.showNotification("Arduino desconectado", "info");

      } catch (err) {
        console.error("Erro ao desconectar:", err);
      }
    }

    updateConnectButton() {
      const connectButton = document.querySelector('.tool-btn[data-tool="arduino"]');
      if (connectButton) {
        if (this.isConnected) {
          connectButton.classList.add('connected');
          connectButton.innerHTML = '<i class="fas fa-plug"></i>';
          connectButton.setAttribute("data-tooltip", "Desconectar Arduino");
        } else {
          connectButton.classList.remove('connected');
          connectButton.innerHTML = '<i class="fas fa-microchip"></i>';
          connectButton.setAttribute("data-tooltip", "Conectar Arduino");
        }
      }
    }

    showNotification(msg, type) {
      const notification = document.getElementById("notification");
      const text = document.getElementById("notification-text");
      const icon = notification.querySelector("i");

      if (notification && text) {
        text.textContent = msg;

        // Atualizar estilo baseado no tipo
        if (type === "success") {
          notification.style.background = "linear-gradient(45deg, #4caf50, #8bc34a)";
          icon.className = "fas fa-check-circle";
        } else if (type === "error") {
          notification.style.background = "linear-gradient(45deg, #ff6b6b, #ff9e7d)";
          icon.className = "fas fa-exclamation-circle";
        } else {
          notification.style.background = "rgba(45, 21, 84, 0.9)";
          icon.className = "fas fa-info-circle";
        }

        // Mostrar notificação
        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";

        setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transform = "translateY(20px)";
        }, 3000);
      }
    }
  }

  // Inicializar quando o DOM estiver carregado
  document.addEventListener("DOMContentLoaded", () => {
    const arduino = new ArduinoPotentiometer();

    // Criar botão de conexão Arduino
    const toolsPanel = document.querySelector(".tools-panel");
    if (toolsPanel && !document.querySelector('.tool-btn[data-tool="arduino"]')) {
      const connectButton = document.createElement("div");

      connectButton.className = "tool-btn";
      connectButton.innerHTML = '<i class="fas fa-microchip"></i>';
      connectButton.setAttribute("data-tool", "arduino");
      connectButton.setAttribute("data-tooltip", "Conectar Arduino");

      connectButton.addEventListener("click", () => {
        if (!arduino.isConnected) {
          arduino.connect();
        } else {
          arduino.disconnect();
        }
      });

      // Adicionar antes dos controles de ferramentas
      const toolOptions = toolsPanel.querySelector('.tool-options');
      if (toolOptions) {
        toolsPanel.insertBefore(connectButton, toolOptions);
      } else {
        toolsPanel.appendChild(connectButton);
      }
    }

    // Configurar envio automático de cores para Arduino
    const colorButtons = document.querySelectorAll('.color-btn');
    const colorPicker = document.getElementById('color-picker');

    // Função para enviar cor para Arduino
    function sendColorToArduino(colorHex) {
      if (arduino.isConnected) {
        arduino.sendColorCommand(colorHex);
      }
    }

    // Adicionar event listeners para cores
    colorButtons.forEach(button => {
      button.addEventListener('click', function () {
        const color = this.getAttribute('data-color');
        sendColorToArduino(color);
      });
    });

    colorPicker.addEventListener('input', function (e) {
      sendColorToArduino(e.target.value);
    });

    // Também modificar a função de ativação de cor personalizada
    const originalActivateCustomColor = window.activateCustomColor;
    window.activateCustomColor = function (color) {
      if (originalActivateCustomColor) {
        originalActivateCustomColor(color);
      }
      sendColorToArduino(color);
    };
  });

  // Controle de LED IR
  class LEDController {
    constructor() {
      this.port = null;
      this.connected = false;
    }

    async connect() {
      try {
        if (!('serial' in navigator)) {
          this.showNotification("Web Serial não suportada", "error");
          return false;
        }

        this.port = await navigator.serial.requestPort();
        await this.port.open({
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        });

        this.connected = true;
        this.showNotification("LED IR conectado!", "success");
        return true;

      } catch (error) {
        console.error("Erro ao conectar LED:", error);
        this.showNotification("Erro ao conectar LED IR", "error");
        return false;
      }
    }

    async sendColorCommand(colorHex) {
      if (!this.connected || !this.port) {
        console.warn("LED não conectado");
        return;
      }

      try {
        const writer = this.port.writable.getWriter();
        const command = `COLOR:${colorHex.replace('#', '')}\n`;
        const encoder = new TextEncoder();

        await writer.write(encoder.encode(command));
        writer.releaseLock();

        console.log("Comando LED enviado:", colorHex);
      } catch (error) {
        console.error("Erro ao enviar comando LED:", error);
      }
    }

    async disconnect() {
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
      this.connected = false;
      this.showNotification("LED IR desconectado", "info");
    }

    showNotification(message, type) {
      const notification = document.getElementById("notification");
      const text = document.getElementById("notification-text");
      const icon = notification.querySelector("i");

      if (notification && text) {
        text.textContent = message;

        if (type === "success") {
          notification.style.background = "linear-gradient(45deg, #4caf50, #8bc34a)";
          icon.className = "fas fa-check-circle";
        } else if (type === "error") {
          notification.style.background = "linear-gradient(45deg, #ff6b6b, #ff9e7d)";
          icon.className = "fas fa-exclamation-circle";
        } else {
          notification.style.background = "rgba(45, 21, 84, 0.9)";
          icon.className = "fas fa-info-circle";
        }

        notification.style.opacity = "1";
        notification.style.transform = "translateY(0)";

        setTimeout(() => {
          notification.style.opacity = "0";
          notification.style.transform = "translateY(20px)";
        }, 3000);
      }
    }
  }

  // Configurar controle LED
  function setupLEDControl() {
    const colorButtons = document.querySelectorAll('.color-btn');
    const colorPicker = document.getElementById('color-picker');

    colorButtons.forEach(button => {
      const originalClick = button.onclick;

      button.addEventListener("click", function () {
        const color = this.getAttribute("data-color");

        // Enviar comando para o LED se estiver conectado
        if (window.ledController && window.ledController.connected) {
          window.ledController.sendColorCommand(color);
        }

        // Manter o comportamento original
        if (originalClick) originalClick.call(this);
      });
    });

    // Também para o seletor de cor personalizado
    colorPicker.addEventListener("input", function (e) {
      const color = e.target.value;

      if (window.ledController && window.ledController.connected) {
        window.ledController.sendColorCommand(color);
      }
    });
  }

  // Inicializar controle LED
  document.addEventListener("DOMContentLoaded", function () {
    setupLEDControl();

    // Configurar botão de controle LED
    const ledButton = document.getElementById('led-control-btn');
    if (ledButton) {
      // Criar instância do controlador LED
      window.ledController = new LEDController();

      ledButton.addEventListener('click', async function () {
        if (!window.ledController.connected) {
          const connected = await window.ledController.connect();
          if (connected) {
            this.classList.add('led-connected');
            this.innerHTML = '<i class="fas fa-lightbulb"></i>';
            this.setAttribute('data-tooltip', 'Desconectar LED IR');
          }
        } else {
          await window.ledController.disconnect();
          this.classList.remove('led-connected');
          this.innerHTML = '<i class="fas fa-lightbulb"></i>';
          this.setAttribute('data-tooltip', 'Conectar LED IR');
        }
      });
    }
  });
});