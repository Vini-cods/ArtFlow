// Configuração do canvas de desenho
const canvas = document.getElementById("drawing-canvas");
const ctx = canvas.getContext("2d");
const fullscreenCanvas = document.getElementById("fullscreen-canvas");
const fullscreenCtx = fullscreenCanvas.getContext("2d");

// Variáveis para controle de desenho
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = "#000000";
let brushSize = 5;
let opacity = 1;
let currentTool = "pencil";
let currentShape = "rectangle";
let startX, startY;
let snapshot;

// Configuração inicial do canvas
function setupCanvas() {
  const drawingArea = canvas.parentElement;
  canvas.width = drawingArea.offsetWidth;
  canvas.height = drawingArea.offsetHeight;

  // Limpar canvas com fundo branco
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateDrawingContext();
}

function setupFullscreenCanvas() {
  fullscreenCanvas.width = window.innerWidth * 0.8;
  fullscreenCanvas.height = window.innerHeight * 0.8;

  // Limpar canvas com fundo branco
  fullscreenCtx.fillStyle = "#FFFFFF";
  fullscreenCtx.fillRect(0, 0, fullscreenCanvas.width, fullscreenCanvas.height);

  // Copiar conteúdo do canvas principal se existir
  if (canvas.width > 0 && canvas.height > 0) {
    fullscreenCtx.drawImage(
      canvas,
      0,
      0,
      fullscreenCanvas.width,
      fullscreenCanvas.height
    );
  }
}

function updateDrawingContext() {
  // Configurar contexto do canvas normal
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = brushSize;
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = currentColor;
  ctx.globalAlpha = opacity;

  // Configurar contexto do canvas de tela cheia
  fullscreenCtx.lineJoin = "round";
  fullscreenCtx.lineCap = "round";
  fullscreenCtx.lineWidth = brushSize;
  fullscreenCtx.strokeStyle = currentColor;
  fullscreenCtx.fillStyle = currentColor;
  fullscreenCtx.globalAlpha = opacity;
}

// Inicializar a tela de desenho
function initDrawing() {
  setupCanvas();
  updateDrawingContext();

  // Event listeners para canvas normal
  setupCanvasEvents(canvas, ctx);

  // Configurar ferramentas e controles
  setupTools();
  setupControls();
}

function setupCanvasEvents(canvasElement, context) {
  // Mouse events
  canvasElement.addEventListener("mousedown", startDrawing);
  canvasElement.addEventListener("mousemove", draw);
  canvasElement.addEventListener("mouseup", stopDrawing);
  canvasElement.addEventListener("mouseout", stopDrawing);

  // Touch events
  canvasElement.addEventListener("touchstart", handleTouchStart);
  canvasElement.addEventListener("touchmove", handleTouchMove);
  canvasElement.addEventListener("touchend", stopDrawing);
}

function setupTools() {
  // Configurar botões de ferramentas (canvas normal)
  const toolButtons = document.querySelectorAll(".tool-btn");
  toolButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectTool(button.getAttribute("data-tool"));
    });
  });

  // Configurar botões de formas (canvas normal)
  const shapeButtons = document.querySelectorAll(".shape-btn");
  shapeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectShape(button.getAttribute("data-shape"));
    });
  });
}

function setupControls() {
  // Configurar paleta de cores
  const colorOptions = document.querySelectorAll(".color-option");
  colorOptions.forEach((option) => {
    option.addEventListener("click", () => {
      selectColor(option.getAttribute("data-color"));
    });
  });

  // Configurar seletor de cor personalizada
  const colorPicker = document.getElementById("color-picker");
  colorPicker.addEventListener("input", (e) => {
    selectColor(e.target.value);
  });

  const fullscreenColorPicker = document.getElementById(
    "fullscreen-color-picker"
  );
  fullscreenColorPicker.addEventListener("input", (e) => {
    selectColor(e.target.value);
  });

  // Configurar controle de espessura do pincel
  const brushSizeInput = document.getElementById("brush-size");
  const brushSizeValue = document.getElementById("brush-size-value");
  brushSizeInput.addEventListener("input", (e) => {
    brushSize = parseInt(e.target.value);
    brushSizeValue.textContent = brushSize + "px";
    updateDrawingContext();
  });

  const fullscreenBrushSize = document.getElementById("fullscreen-brush-size");
  const fullscreenBrushSizeValue = document.getElementById(
    "fullscreen-brush-size-value"
  );
  fullscreenBrushSize.addEventListener("input", (e) => {
    brushSize = parseInt(e.target.value);
    fullscreenBrushSizeValue.textContent = brushSize + "px";
    updateDrawingContext();
  });

  // Configurar controle de opacidade
  const opacityInput = document.getElementById("opacity");
  const opacityValue = document.getElementById("opacity-value");
  opacityInput.addEventListener("input", (e) => {
    opacity = parseInt(e.target.value) / 100;
    opacityValue.textContent = e.target.value + "%";
    updateDrawingContext();
  });

  const fullscreenOpacity = document.getElementById("fullscreen-opacity");
  const fullscreenOpacityValue = document.getElementById(
    "fullscreen-opacity-value"
  );
  fullscreenOpacity.addEventListener("input", (e) => {
    opacity = parseInt(e.target.value) / 100;
    fullscreenOpacityValue.textContent = e.target.value + "%";
    updateDrawingContext();
  });
}

function selectTool(tool) {
  currentTool = tool;

  // Atualizar UI
  document.querySelectorAll(".tool-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelectorAll(`.tool-btn[data-tool="${tool}"]`).forEach((btn) => {
    btn.classList.add("active");
  });

  // Mostrar/ocultar opções de formas
  const shapeOptions = document.getElementById("shape-options");
  const fullscreenShapes = document.getElementById("fullscreen-shapes-section");

  if (currentTool === "shapes") {
    if (shapeOptions) shapeOptions.classList.add("show");
    if (fullscreenShapes) fullscreenShapes.style.display = "block";
  } else {
    if (shapeOptions) shapeOptions.classList.remove("show");
    if (fullscreenShapes) fullscreenShapes.style.display = "none";
  }

  updateCursor();
}

function selectShape(shape) {
  currentShape = shape;

  // Atualizar UI
  document.querySelectorAll(".shape-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document
    .querySelectorAll(`.shape-btn[data-shape="${shape}"]`)
    .forEach((btn) => {
      btn.classList.add("active");
    });
}

function selectColor(color) {
  currentColor = color;

  // Atualizar UI
  document.querySelectorAll(".color-option").forEach((opt) => {
    opt.classList.remove("active");
  });
  document
    .querySelectorAll(`.color-option[data-color="${color}"]`)
    .forEach((opt) => {
      opt.classList.add("active");
    });

  // Atualizar seletores de cor
  document.getElementById("color-picker").value = color;
  document.getElementById("fullscreen-color-picker").value = color;

  updateDrawingContext();
}

function updateCursor() {
  let cursor = "crosshair";

  switch (currentTool) {
    case "eraser":
      cursor =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><circle cx='12' cy='12' r='10' fill='white' stroke='black'/></svg>\") 12 12, auto";
      break;
    case "fill":
      cursor =
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M3,3H21V21H3Z' fill='none' stroke='black'/><path d='M8,8H16V16H8Z' fill='currentColor'/></svg>\") 12 12, auto";
      break;
    default:
      cursor = "crosshair";
  }

  canvas.style.cursor = cursor;
  fullscreenCanvas.style.cursor = cursor;
}

// Funções para desenho
function startDrawing(e) {
  e.preventDefault();
  isDrawing = true;

  const currentCanvas =
    e.target === fullscreenCanvas ? fullscreenCanvas : canvas;
  const currentCtx = e.target === fullscreenCanvas ? fullscreenCtx : ctx;

  const rect = currentCanvas.getBoundingClientRect();
  const scaleX = currentCanvas.width / rect.width;
  const scaleY = currentCanvas.height / rect.height;

  // Obter coordenadas corretas
  let clientX, clientY;
  if (e.type.includes("touch")) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  lastX = (clientX - rect.left) * scaleX;
  lastY = (clientY - rect.top) * scaleY;
  startX = lastX;
  startY = lastY;

  // Configurar contexto baseado na ferramenta
  setupToolContext(currentCtx);

  if (currentTool === "shapes") {
    // Salvar snapshot para formas
    snapshot = currentCtx.getImageData(
      0,
      0,
      currentCanvas.width,
      currentCanvas.height
    );
  } else if (currentTool !== "spray" && currentTool !== "fill") {
    currentCtx.beginPath();
    currentCtx.moveTo(lastX, lastY);
  }
}

function setupToolContext(context) {
  switch (currentTool) {
    case "pencil":
      context.globalCompositeOperation = "source-over";
      context.lineWidth = brushSize;
      break;
    case "brush":
      context.globalCompositeOperation = "source-over";
      context.lineWidth = brushSize * 2;
      break;
    case "marker":
      context.globalCompositeOperation = "multiply";
      context.lineWidth = brushSize * 3;
      context.globalAlpha = opacity * 0.7;
      break;
    case "spray":
      context.globalCompositeOperation = "source-over";
      context.globalAlpha = opacity * 0.3;
      break;
    case "eraser":
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = brushSize * 4;
      context.globalAlpha = 0.7;
      break;
    case "fill":
      context.globalCompositeOperation = "source-over";
      break;
    case "shapes":
      context.globalCompositeOperation = "source-over";
      context.lineWidth = brushSize;
      break;
  }
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();

  const currentCanvas =
    e.target === fullscreenCanvas ? fullscreenCanvas : canvas;
  const currentCtx = e.target === fullscreenCanvas ? fullscreenCtx : ctx;

  const rect = currentCanvas.getBoundingClientRect();
  const scaleX = currentCanvas.width / rect.width;
  const scaleY = currentCanvas.height / rect.height;

  // Obter coordenadas corretas
  let clientX, clientY;
  if (e.type.includes("touch")) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const currentX = (clientX - rect.left) * scaleX;
  const currentY = (clientY - rect.top) * scaleY;

  if (currentTool === "shapes") {
    // Restaurar snapshot e desenhar forma temporária
    currentCtx.putImageData(snapshot, 0, 0);
    drawShape(currentCtx, startX, startY, currentX, currentY, true);
  } else if (currentTool === "spray") {
    sprayPaint(currentCtx, currentX, currentY);
  } else if (currentTool === "fill") {
    // O preenchimento é feito no mouseup
    return;
  } else {
    currentCtx.lineTo(currentX, currentY);
    currentCtx.stroke();
  }

  lastX = currentX;
  lastY = currentY;
}

function sprayPaint(context, x, y) {
  const density = Math.max(brushSize, 10);
  const radius = brushSize * 2;

  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const sprayRadius = Math.random() * radius;
    const sprayX = x + Math.cos(angle) * sprayRadius;
    const sprayY = y + Math.sin(angle) * sprayRadius;

    context.beginPath();
    context.arc(sprayX, sprayY, brushSize / 4, 0, Math.PI * 2);
    context.fill();
  }
}

function stopDrawing(e) {
  if (!isDrawing) return;
  isDrawing = false;

  const currentCanvas =
    e.target === fullscreenCanvas ? fullscreenCanvas : canvas;
  const currentCtx = e.target === fullscreenCanvas ? fullscreenCtx : ctx;

  if (currentTool === "shapes") {
    // Desenhar forma permanente
    drawShape(currentCtx, startX, startY, lastX, lastY, false);
  } else if (currentTool === "fill") {
    // Preenchimento simples
    currentCtx.fillRect(lastX - 20, lastY - 20, 40, 40);
  }

  currentCtx.closePath();
}

function drawShape(context, x1, y1, x2, y2, isPreview) {
  context.beginPath();

  switch (currentShape) {
    case "rectangle":
      const width = x2 - x1;
      const height = y2 - y1;
      context.rect(x1, y1, width, height);
      break;
    case "circle":
      const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
      context.arc(x1, y1, radius, 0, Math.PI * 2);
      break;
    case "triangle":
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x1 * 2 - x2, y2);
      context.closePath();
      break;
    case "line":
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      break;
    case "star":
      drawStar(
        context,
        x1,
        y1,
        5,
        Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2
      );
      break;
    case "heart":
      drawHeart(
        context,
        x1,
        y1,
        Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 3
      );
      break;
  }

  if (isPreview) {
    context.stroke();
  } else {
    if (currentShape !== "line") {
      context.fill();
    }
    context.stroke();
  }
}

function drawStar(context, cx, cy, spikes, outerRadius) {
  const innerRadius = outerRadius / 2;
  let rot = (Math.PI / 2) * 3;
  let x, y;
  const step = Math.PI / spikes;

  context.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    context.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    context.lineTo(x, y);
    rot += step;
  }

  context.lineTo(cx, cy - outerRadius);
  context.closePath();
}

function drawHeart(context, x, y, size) {
  context.moveTo(x, y);
  context.bezierCurveTo(x, y - size, x - size, y - size * 1.5, x, y - size * 2);
  context.bezierCurveTo(x + size, y - size * 1.5, x, y - size, x, y);
  context.closePath();
}

// Funções para desenho com toque
function handleTouchStart(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  e.target.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  e.target.dispatchEvent(mouseEvent);
}

// Modo de tela cheia
function enterFullscreen() {
  const modal = document.getElementById("fullscreen-modal");
  modal.classList.add("show");

  // Configurar canvas de tela cheia
  setupFullscreenCanvas();
  updateDrawingContext();

  // Adicionar event listeners para o canvas de tela cheia
  setupCanvasEvents(fullscreenCanvas, fullscreenCtx);

  // Configurar ferramentas da tela cheia
  setupFullscreenTools();

  // Prevenir scroll do body
  document.body.style.overflow = "hidden";

  console.log("Modo tela cheia ativado");
}

function setupFullscreenTools() {
  // Configurar botões de ferramentas da tela cheia
  const fullscreenToolButtons = document.querySelectorAll(
    ".fullscreen-tools-panel .tool-btn"
  );
  fullscreenToolButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectTool(button.getAttribute("data-tool"));
    });
  });

  // Configurar botões de formas da tela cheia
  const fullscreenShapeButtons = document.querySelectorAll(
    ".fullscreen-tools-panel .shape-btn"
  );
  fullscreenShapeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectShape(button.getAttribute("data-shape"));
    });
  });
}

function exitFullscreen() {
  const modal = document.getElementById("fullscreen-modal");
  modal.classList.remove("show");

  // Copiar conteúdo de volta para o canvas principal
  if (fullscreenCanvas.width > 0 && fullscreenCanvas.height > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fullscreenCanvas, 0, 0, canvas.width, canvas.height);
  }

  // Restaurar scroll do body
  document.body.style.overflow = "";

  console.log("Modo tela cheia desativado");
}

function clearFullscreenCanvas() {
  if (confirm("Tem certeza que deseja limpar o desenho na tela cheia?")) {
    fullscreenCtx.fillStyle = "#FFFFFF";
    fullscreenCtx.fillRect(
      0,
      0,
      fullscreenCanvas.width,
      fullscreenCanvas.height
    );
  }
}

function saveFullscreenDrawing() {
  const link = document.createElement("a");
  link.download = "meu-desenho-aventura-tela-cheia.png";
  link.href = fullscreenCanvas.toDataURL("image/png");
  link.click();
  showNotification("Desenho da tela cheia salvo com sucesso!");
}

// Funções simplificadas para desfazer/refazer (placeholder)
function undoFullscreen() {
  showNotification("Funcionalidade Desfazer em desenvolvimento");
}

function redoFullscreen() {
  showNotification("Funcionalidade Refazer em desenvolvimento");
}

// Limpar canvas
function clearCanvas() {
  if (confirm("Tem certeza que deseja limpar o desenho?")) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    fullscreenCtx.fillStyle = "#FFFFFF";
    fullscreenCtx.fillRect(
      0,
      0,
      fullscreenCanvas.width,
      fullscreenCanvas.height
    );
  }
}

// Salvar desenho
function saveDrawing() {
  const link = document.createElement("a");
  link.download = "meu-desenho-aventura-na-floresta.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  showNotification("Desenho salvo com sucesso!");
}

// Voltar para a tela anterior
function goBack() {
  if (
    confirm(
      "Voltar para a tela inicial? Seu desenho não será salvo automaticamente."
    )
  ) {
    window.history.back();
  }
}

// Função para mostrar notificações
function showNotification(message) {
  // Criar ou reutilizar elemento de notificação
  let notification = document.querySelector(".notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.className = "notification";
    document.body.appendChild(notification);
  }

  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

  notification.style.display = "block";
  notification.style.opacity = "1";

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.style.display = "none";
    }, 300);
  }, 3000);
}

// Criar bolinhas flutuantes
function createFloatingShapes() {
  const container = document.querySelector(".floating-shapes");
  if (!container) return;

  container.innerHTML = "";

  const shapes = [
    { size: 60, color: "purple", count: 5 },
    { size: 40, color: "gold", count: 5 },
    { size: 25, color: "purple", count: 8 },
  ];

  shapes.forEach((config) => {
    for (let i = 0; i < config.count; i++) {
      const shape = document.createElement("div");
      shape.className = `floating-shape ${config.color}`;
      shape.style.width = config.size + "px";
      shape.style.height = config.size + "px";
      shape.style.left = Math.random() * 100 + "%";
      shape.style.top = Math.random() * 100 + "%";
      shape.style.animationDelay = Math.random() * 8 + "s";
      shape.style.animationDuration = `${8 + Math.random() * 4}s`;
      container.appendChild(shape);
    }
  });
}

// Inicializar quando a página carregar
window.addEventListener("load", () => {
  initDrawing();
  createFloatingShapes();

  // Redimensionar canvas quando a janela for redimensionada
  window.addEventListener("resize", () => {
    setupCanvas();
    if (
      document.getElementById("fullscreen-modal").classList.contains("show")
    ) {
      setupFullscreenCanvas();
    }
  });

  // Tecla ESC para sair da tela cheia
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      exitFullscreen();
    }
  });

  console.log("Página de aventura carregada com sucesso!");
});
