document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const backBtn = document.getElementById("back-btn");
  const saveBtn = document.getElementById("save-btn");
  const clearBtn = document.getElementById("clear-btn");
  const newImageBtn = document.getElementById("new-image-btn");
  const colorElements = document.querySelectorAll(".color");
  const currentColorElement = document.getElementById("current-color");
  const colorPicker = document.getElementById("color-picker");
  const brushSizeSlider = document.getElementById("brush-size");
  const toolElements = document.querySelectorAll(".tool");
  const sizeOptions = document.querySelectorAll(".size-option");
  const drawingOptions = document.querySelectorAll(".drawing-option");

  // Variáveis de estado
  let isDrawing = false;
  let selectedColor = "#FF0000";
  let brushSize = 8;
  let selectedTool = "brush";
  let lastX = 0;
  let lastY = 0;
  let currentDrawing = "butterfly";

  // Configurar o canvas
  function setupCanvas() {
    // Definir o tamanho do canvas
    canvas.width = 800;
    canvas.height = 600;

    // Desenhar a imagem base
    drawBaseImage();

    // Adicionar evento para preenchimento com a ferramenta de preencher
    canvas.addEventListener("click", handleCanvasClick);
  }

  // Desenhar a imagem base
  function drawBaseImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo branco
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar o contorno baseado na seleção
    switch (currentDrawing) {
      case "butterfly":
        drawButterflyOutline();
        break;
      case "castle":
        drawCastleOutline();
        break;
      case "dinosaur":
        drawDinosaurOutline();
        break;
    }
  }

  // Desenhar contorno de borboleta
  function drawButterflyOutline() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

    // Corpo
    ctx.beginPath();
    ctx.moveTo(400, 150);
    ctx.lineTo(400, 450);
    ctx.stroke();

    // Asas superiores
    ctx.beginPath();
    ctx.ellipse(300, 250, 120, 80, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(500, 250, 120, 80, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Asas inferiores
    ctx.beginPath();
    ctx.ellipse(280, 380, 80, 100, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(520, 380, 80, 100, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cabeça
    ctx.beginPath();
    ctx.arc(400, 150, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Antenas
    ctx.beginPath();
    ctx.moveTo(390, 140);
    ctx.lineTo(370, 110);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(410, 140);
    ctx.lineTo(430, 110);
    ctx.stroke();
  }

  // Desenhar contorno de castelo
  function drawCastleOutline() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

    // Base do castelo
    ctx.beginPath();
    ctx.rect(200, 300, 400, 200);
    ctx.stroke();

    // Torres
    ctx.beginPath();
    ctx.rect(200, 200, 80, 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(520, 200, 80, 100);
    ctx.stroke();

    // Torres laterais menores
    ctx.beginPath();
    ctx.rect(300, 250, 60, 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(440, 250, 60, 50);
    ctx.stroke();

    // Telhados das torres
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(240, 150);
    ctx.lineTo(280, 200);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(520, 200);
    ctx.lineTo(560, 150);
    ctx.lineTo(600, 200);
    ctx.closePath();
    ctx.stroke();

    // Portão
    ctx.beginPath();
    ctx.rect(350, 350, 100, 150);
    ctx.stroke();

    // Janelas
    ctx.beginPath();
    ctx.rect(250, 330, 30, 30);
    ctx.stroke();

    ctx.beginPath();
    ctx.rect(520, 330, 30, 30);
    ctx.stroke();

    // Bandeiras
    ctx.beginPath();
    ctx.moveTo(240, 150);
    ctx.lineTo(240, 120);
    ctx.lineTo(260, 135);
    ctx.lineTo(240, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(560, 150);
    ctx.lineTo(560, 120);
    ctx.lineTo(580, 135);
    ctx.lineTo(560, 150);
    ctx.stroke();
  }

  // Desenhar contorno de dinossauro
  function drawDinosaurOutline() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";

    // Corpo
    ctx.beginPath();
    ctx.moveTo(300, 400);
    ctx.lineTo(500, 400);
    ctx.lineTo(550, 350);
    ctx.lineTo(500, 300);
    ctx.lineTo(450, 250);
    ctx.lineTo(400, 200);
    ctx.lineTo(350, 250);
    ctx.lineTo(300, 300);
    ctx.lineTo(250, 350);
    ctx.lineTo(300, 400);
    ctx.stroke();

    // Perna dianteira
    ctx.beginPath();
    ctx.moveTo(350, 400);
    ctx.lineTo(350, 500);
    ctx.lineTo(400, 500);
    ctx.lineTo(400, 400);
    ctx.stroke();

    // Perna traseira
    ctx.beginPath();
    ctx.moveTo(500, 400);
    ctx.lineTo(500, 500);
    ctx.lineTo(550, 500);
    ctx.lineTo(550, 400);
    ctx.stroke();

    // Olho
    ctx.beginPath();
    ctx.arc(380, 230, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Chifres
    ctx.beginPath();
    ctx.moveTo(370, 200);
    ctx.lineTo(350, 150);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(400, 190);
    ctx.lineTo(420, 140);
    ctx.stroke();
  }

  // Inicializar a paleta de cores
  function initColorPalette() {
    colorElements.forEach((colorEl) => {
      colorEl.addEventListener("click", function () {
        // Remover a seleção anterior
        colorElements.forEach((el) => el.classList.remove("selected"));

        // Selecionar a nova cor
        this.classList.add("selected");
        selectedColor = this.getAttribute("data-color");
        currentColorElement.style.backgroundColor = selectedColor;
        colorPicker.value = selectedColor;
      });
    });

    // Selecionar a primeira cor por padrão
    colorElements[0].classList.add("selected");

    // Configurar o seletor de cor personalizada
    colorPicker.addEventListener("input", function () {
      selectedColor = this.value;
      currentColorElement.style.backgroundColor = selectedColor;

      // Atualizar a seleção de cor
      colorElements.forEach((el) => el.classList.remove("selected"));
    });
  }

  // Configurar ferramentas
  function initTools() {
    toolElements.forEach((tool) => {
      tool.addEventListener("click", function () {
        toolElements.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");
        selectedTool = this.getAttribute("data-tool");
      });
    });

    sizeOptions.forEach((option) => {
      option.addEventListener("click", function () {
        sizeOptions.forEach((o) => o.classList.remove("active"));
        this.classList.add("active");
        brushSize = parseInt(this.getAttribute("data-size"));
        brushSizeSlider.value = brushSize;
      });
    });

    brushSizeSlider.addEventListener("input", function () {
      brushSize = parseInt(this.value);

      // Atualizar a seleção de tamanho
      sizeOptions.forEach((option) => {
        const size = parseInt(option.getAttribute("data-size"));
        if (Math.abs(size - brushSize) <= 5) {
          option.classList.add("active");
        } else {
          option.classList.remove("active");
        }
      });
    });

    drawingOptions.forEach((option) => {
      option.addEventListener("click", function () {
        drawingOptions.forEach((o) => o.classList.remove("active"));
        this.classList.add("active");
        currentDrawing = this.getAttribute("data-drawing");
        drawBaseImage();
      });
    });
  }

  // Configurar eventos de desenho
  function setupDrawing() {
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Suporte para dispositivos touch
    canvas.addEventListener("touchstart", function (e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener("touchend", function (e) {
      e.preventDefault();
      const mouseEvent = new MouseEvent("mouseup");
      canvas.dispatchEvent(mouseEvent);
    });
  }

  function startDrawing(e) {
    isDrawing = true;

    // Obter a posição do mouse em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;

    // Se for a ferramenta de spray, começar a desenhar imediatamente
    if (selectedTool === "spray") {
      draw(e);
    }
  }

  function draw(e) {
    if (!isDrawing) return;

    // Obter a posição do mouse em relação ao canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;

    switch (selectedTool) {
      case "brush":
        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case "spray":
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < brushSize; i++) {
          const offsetX = (Math.random() - 0.5) * brushSize * 2;
          const offsetY = (Math.random() - 0.5) * brushSize * 2;
          ctx.beginPath();
          ctx.arc(x + offsetX, y + offsetY, brushSize / 10, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        break;
    }

    lastX = x;
    lastY = y;
  }

  function handleCanvasClick(e) {
    if (selectedTool === "fill") {
      // Obter a posição do mouse em relação ao canvas
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Preencher a área
      floodFill(x, y);
    }
  }

  // Algoritmo de preenchimento (flood fill)
  function floodFill(startX, startY) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const targetColor = getPixelColor(imageData, startX, startY);
    const fillColor = hexToRgb(selectedColor);

    // Se a cor alvo for igual à cor de preenchimento, não fazer nada
    if (
      targetColor[0] === fillColor.r &&
      targetColor[1] === fillColor.g &&
      targetColor[2] === fillColor.b
    ) {
      return;
    }

    const stack = [[startX, startY]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
        continue;
      }

      const currentColor = getPixelColor(imageData, x, y);

      if (
        currentColor[0] === targetColor[0] &&
        currentColor[1] === targetColor[1] &&
        currentColor[2] === targetColor[2]
      ) {
        setPixelColor(imageData, x, y, fillColor);

        // Adicionar pixels vizinhos à pilha
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  function getPixelColor(imageData, x, y) {
    const index = (y * imageData.width + x) * 4;
    return [
      imageData.data[index],
      imageData.data[index + 1],
      imageData.data[index + 2],
    ];
  }

  function setPixelColor(imageData, x, y, color) {
    const index = (y * imageData.width + x) * 4;
    imageData.data[index] = color.r;
    imageData.data[index + 1] = color.g;
    imageData.data[index + 2] = color.b;
    imageData.data[index + 3] = 255; // Alpha
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Reiniciar o caminho para a próxima vez
  }

  // Configurar botões
  function setupButtons() {
    backBtn.addEventListener("click", function () {
      window.location.href = "../index.html";
    });

    saveBtn.addEventListener("click", function () {
      // Criar um link de download
      const link = document.createElement("a");
      link.download = `artflow-${currentDrawing}-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Mostrar mensagem de sucesso
      showNotification("Desenho salvo com sucesso!");
    });

    clearBtn.addEventListener("click", function () {
      if (confirm("Tem certeza que quer limpar o desenho?")) {
        drawBaseImage();
        showNotification("Desenho limpo!");
      }
    });

    newImageBtn.addEventListener("click", function () {
      drawBaseImage();
      showNotification("Novo desenho carregado!");
    });
  }

  // Mostrar notificação
  function showNotification(message) {
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
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.background = "rgba(45, 21, 84, 0.9)";
    notification.style.color = "white";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
    notification.style.zIndex = "1000";
    notification.style.backdropFilter = "blur(10px)";
    notification.style.border = "1px solid rgba(255, 215, 0, 0.3)";
    notification.style.transform = "translateY(100px)";
    notification.style.opacity = "0";
    notification.style.transition = "all 0.3s ease";

    // Adicionar ao corpo do documento
    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
      notification.style.transform = "translateY(0)";
      notification.style.opacity = "1";
    }, 10);

    // Remover após 3 segundos
    setTimeout(() => {
      notification.style.transform = "translateY(100px)";
      notification.style.opacity = "0";

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Inicializar a aplicação
  function init() {
    setupCanvas();
    initColorPalette();
    initTools();
    setupDrawing();
    setupButtons();
  }

  // Iniciar quando a página carregar
  init();
});
