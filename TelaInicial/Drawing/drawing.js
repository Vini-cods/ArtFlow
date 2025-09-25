// drawing.js - Script para a página de desenho - VERSÃO OTIMIZADA PARA MESA DIGITALIZADORA

document.addEventListener("DOMContentLoaded", function () {
  // Elementos principais
  const canvas = document.getElementById("drawing-canvas");
  const ctx = canvas.getContext("2d");
  const canvasContainer = document.querySelector(".canvas-container");
  const toolsPanel = document.querySelector(".tools-panel");
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notification-text");

  // Estado da aplicação
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentTool = "pencil";
  let currentColor = "#000000";
  let brushSize = 5;
  let opacity = 1;
  let smoothness = 5;
  let currentShape = "rectangle";
  let shapeFill = true;
  let shapeStroke = true;
  let drawingHistory = [];
  let historyIndex = -1;
  let layers = [];
  let activeLayerIndex = 0;
  let startX, startY;

  // Inicialização
  function init() {
    resizeCanvas();
    setupEventListeners();
    createInitialLayer();
    updateUI();
    createFloatingShapes();
    saveState();
  }

  // Redimensionar canvas para caber no container
  function resizeCanvas() {
    const containerRect = canvasContainer.getBoundingClientRect();
    canvas.width = containerRect.width;
    canvas.height = containerRect.height;

    // Redesenhar todas as camadas
    redrawAllLayers();
  }

  // Configurar event listeners
  function setupEventListeners() {
    // Eventos de redimensionamento
    window.addEventListener("resize", resizeCanvas);

    // Eventos do canvas
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Eventos de toque para dispositivos touch
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleTouchEnd);

    // Eventos das ferramentas
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const tool = this.getAttribute("data-tool");
        selectTool(tool);
      });
    });

    // Eventos das cores
    document.querySelectorAll(".color-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const color = this.getAttribute("data-color");
        selectColor(color);
      });
    });

    // Seletor de cor personalizada
    const colorPickerBtn = document.getElementById("color-picker-btn");
    const colorPicker = document.getElementById("color-picker");

    colorPickerBtn.addEventListener("click", () => {
      colorPicker.click();
    });

    colorPicker.addEventListener("input", function () {
      selectColor(this.value);
    });

    // Controles de tamanho, opacidade e suavidade
    const brushSizeSlider = document.getElementById("brush-size");
    const opacitySlider = document.getElementById("opacity");
    const smoothnessSlider = document.getElementById("smoothness");

    brushSizeSlider.addEventListener("input", function () {
      brushSize = parseInt(this.value);
      document.getElementById("brush-size-value").textContent =
        brushSize + "px";
    });

    opacitySlider.addEventListener("input", function () {
      opacity = parseInt(this.value) / 100;
      document.getElementById("opacity-value").textContent = this.value + "%";
    });

    smoothnessSlider.addEventListener("input", function () {
      smoothness = parseInt(this.value);
      document.getElementById("smoothness-value").textContent = smoothness;
    });

    // Eventos das formas
    document.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const shape = this.getAttribute("data-shape");
        selectShape(shape);
      });
    });

    // Propriedades das formas
    document
      .getElementById("shape-fill")
      .addEventListener("change", function () {
        shapeFill = this.checked;
      });

    document
      .getElementById("shape-stroke")
      .addEventListener("change", function () {
        shapeStroke = this.checked;
      });

    // Controles de desenho
    document.getElementById("undo-action").addEventListener("click", undo);
    document.getElementById("redo-action").addEventListener("click", redo);
    document.getElementById("clear-btn").addEventListener("click", clearCanvas);
    document.getElementById("save-btn").addEventListener("click", saveDrawing);
    document
      .getElementById("export-btn")
      .addEventListener("click", exportDrawing);

    // Controles de camadas
    document.getElementById("add-layer").addEventListener("click", addLayer);
    document
      .getElementById("delete-layer")
      .addEventListener("click", deleteLayer);
    document
      .getElementById("merge-layers")
      .addEventListener("click", mergeLayers);
  }

  // Sistema de camadas
  function createInitialLayer() {
    layers = [
      {
        name: "Camada 1",
        visible: true,
        data: [],
        canvas: document.createElement("canvas"),
        ctx: null,
      },
    ];

    activeLayerIndex = 0;
    updateLayersList();
  }

  function addLayer() {
    const newLayer = {
      name: `Camada ${layers.length + 1}`,
      visible: true,
      data: [],
      canvas: document.createElement("canvas"),
      ctx: null,
    };

    layers.push(newLayer);
    activeLayerIndex = layers.length - 1;
    updateLayersList();
    saveState();

    showNotification("Nova camada adicionada");
  }

  function deleteLayer() {
    if (layers.length <= 1) {
      showNotification("Não é possível excluir a única camada", "error");
      return;
    }

    layers.splice(activeLayerIndex, 1);
    activeLayerIndex = Math.min(activeLayerIndex, layers.length - 1);
    updateLayersList();
    redrawAllLayers();
    saveState();

    showNotification("Camada excluída");
  }

  function mergeLayers() {
    if (layers.length <= 1) {
      showNotification(
        "É necessário ter mais de uma camada para mesclar",
        "error"
      );
      return;
    }

    // Mesclar todas as camadas visíveis na camada ativa
    const activeLayer = layers[activeLayerIndex];

    for (let i = 0; i < layers.length; i++) {
      if (i !== activeLayerIndex && layers[i].visible) {
        activeLayer.data = activeLayer.data.concat(layers[i].data);
      }
    }

    // Remover outras camadas
    layers = [activeLayer];
    activeLayerIndex = 0;
    updateLayersList();
    redrawAllLayers();
    saveState();

    showNotification("Camadas mescladas");
  }

  function updateLayersList() {
    const layersList = document.getElementById("layers-list");
    layersList.innerHTML = "";

    layers.forEach((layer, index) => {
      const layerItem = document.createElement("div");
      layerItem.className = `layer-item ${
        index === activeLayerIndex ? "active" : ""
      }`;
      layerItem.innerHTML = `
                <div class="layer-preview" style="background-color: ${
                  index === activeLayerIndex ? "#ffd700" : "#888"
                }"></div>
                <span class="layer-name">${layer.name}</span>
                <i class="fas fa-eye layer-visibility"></i>
            `;

      layerItem.addEventListener("click", () => {
        activeLayerIndex = index;
        updateLayersList();
      });

      const visibilityIcon = layerItem.querySelector(".layer-visibility");
      visibilityIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        layer.visible = !layer.visible;
        visibilityIcon.className = layer.visible
          ? "fas fa-eye layer-visibility"
          : "fas fa-eye-slash layer-visibility";
        redrawAllLayers();
      });

      if (!layer.visible) {
        visibilityIcon.className = "fas fa-eye-slash layer-visibility";
      }

      layersList.appendChild(layerItem);
    });
  }

  function redrawAllLayers() {
    // Limpar canvas principal
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redesenhar todas as camadas visíveis
    layers.forEach((layer, index) => {
      if (layer.visible) {
        // Para simplificar, vamos redesenhar os dados da camada
        // Em uma implementação mais avançada, usaríamos um canvas separado para cada camada
        layer.data.forEach((action) => {
          drawAction(action, index === activeLayerIndex);
        });
      }
    });
  }

  // Ferramentas de desenho
  function selectTool(tool) {
    currentTool = tool;

    // Atualizar UI
    document.querySelectorAll(".tool-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`.tool-btn[data-tool="${tool}"]`)
      .classList.add("active");

    // Mostrar/ocultar seção de formas
    const shapeSection = document.getElementById("shape-section");
    if (tool === "shapes") {
      shapeSection.style.display = "block";
    } else {
      shapeSection.style.display = "none";
    }

    // Alterar cursor
    switch (tool) {
      case "pencil":
      case "brush":
      case "marker":
      case "spray":
        canvas.style.cursor = "crosshair";
        break;
      case "eraser":
        canvas.style.cursor =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='8' fill='white' stroke='black'/></svg>\") 10 10, auto";
        break;
      case "fill":
        canvas.style.cursor =
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M3,3H21V21H3Z' fill='none' stroke='black'/><path d='M8,8H16V16H8Z' fill='currentColor'/></svg>\") 12 12, auto";
        break;
      case "select":
        canvas.style.cursor = "default";
        break;
      default:
        canvas.style.cursor = "crosshair";
    }
  }

  function selectColor(color) {
    currentColor = color;

    // Atualizar UI
    document.querySelectorAll(".color-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`.color-btn[data-color="${color}"]`)
      .classList.add("active");

    // Atualizar seletor de cor personalizada
    document.getElementById("color-picker").value = color;
    document.getElementById("current-color-display").style.backgroundColor =
      color;
  }

  function selectShape(shape) {
    currentShape = shape;

    // Atualizar UI
    document.querySelectorAll(".shape-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`.shape-btn[data-shape="${shape}"]`)
      .classList.add("active");
  }

  // Funções de desenho
  function startDrawing(e) {
    isDrawing = true;
    const pos = getMousePos(e);
    [lastX, lastY] = [pos.x, pos.y];
    [startX, startY] = [pos.x, pos.y];

    // Para formas, apenas marcar o ponto inicial
    if (currentTool === "shapes") {
      return;
    }

    // Para outras ferramentas, iniciar o traço
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
  }

  function draw(e) {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    const x = pos.x;
    const y = pos.y;

    if (currentTool === "shapes") {
      // Desenhar forma temporária
      redrawAllLayers();
      drawShape(startX, startY, x, y, true);
      return;
    }

    ctx.globalAlpha = opacity;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    switch (currentTool) {
      case "pencil":
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = "source-over";
        break;
      case "brush":
        ctx.lineWidth = brushSize * 2;
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = "source-over";
        break;
      case "marker":
        ctx.lineWidth = brushSize * 3;
        ctx.strokeStyle = currentColor;
        ctx.globalCompositeOperation = "multiply";
        break;
      case "spray":
        spray(x, y);
        break;
      case "eraser":
        ctx.lineWidth = brushSize * 2;
        ctx.strokeStyle = "#ffffff";
        ctx.globalCompositeOperation = "destination-out";
        break;
      case "fill":
        // O preenchimento é aplicado no mouseup
        return;
    }

    if (currentTool !== "spray") {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    [lastX, lastY] = [x, y];
  }

  function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;

    const pos = getMousePos(e);
    const x = pos.x;
    const y = pos.y;

    if (currentTool === "shapes") {
      // Adicionar forma permanente
      drawShape(startX, startY, x, y, false);
      saveState();
    } else if (currentTool === "fill") {
      floodFill(x, y);
      saveState();
    } else {
      saveState();
    }

    ctx.closePath();
  }

  function drawShape(x1, y1, x2, y2, temporary = false) {
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;

    if (!temporary) {
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.beginPath();

    switch (currentShape) {
      case "rectangle":
        const width = x2 - x1;
        const height = y2 - y1;
        if (shapeFill) ctx.fillRect(x1, y1, width, height);
        if (shapeStroke) ctx.strokeRect(x1, y1, width, height);
        break;

      case "circle":
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        ctx.arc(x1, y1, radius, 0, Math.PI * 2);
        if (shapeFill) ctx.fill();
        if (shapeStroke) ctx.stroke();
        break;

      case "triangle":
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1 * 2 - x2, y2);
        ctx.closePath();
        if (shapeFill) ctx.fill();
        if (shapeStroke) ctx.stroke();
        break;

      case "line":
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        break;

      case "star":
        drawStar(
          ctx,
          x1,
          y1,
          5,
          Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2,
          Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 4
        );
        if (shapeFill) ctx.fill();
        if (shapeStroke) ctx.stroke();
        break;

      case "polygon":
        drawPolygon(
          ctx,
          x1,
          y1,
          6,
          Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
        );
        if (shapeFill) ctx.fill();
        if (shapeStroke) ctx.stroke();
        break;

      case "heart":
        drawHeart(
          ctx,
          x1,
          y1,
          Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) / 2
        );
        if (shapeFill) ctx.fill();
        if (shapeStroke) ctx.stroke();
        break;

      case "arrow":
        drawArrow(ctx, x1, y1, x2, y2);
        ctx.stroke();
        break;
    }

    if (!temporary) {
      // Salvar a ação na camada ativa
      layers[activeLayerIndex].data.push({
        type: "shape",
        shape: currentShape,
        x1,
        y1,
        x2,
        y2,
        color: currentColor,
        size: brushSize,
        fill: shapeFill,
        stroke: shapeStroke,
      });
    }
  }

  // Funções auxiliares para desenhar formas
  function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  function drawPolygon(ctx, cx, cy, sides, radius) {
    ctx.beginPath();
    ctx.moveTo(cx + radius * Math.cos(0), cy + radius * Math.sin(0));

    for (let i = 1; i <= sides; i++) {
      ctx.lineTo(
        cx + radius * Math.cos((i * 2 * Math.PI) / sides),
        cy + radius * Math.sin((i * 2 * Math.PI) / sides)
      );
    }

    ctx.closePath();
  }

  function drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(x, y + size / 4);
    // Curva esquerda
    ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4);
    // Curva inferior esquerda
    ctx.bezierCurveTo(
      x - size / 2,
      y + size / 2,
      x,
      y + size * 0.75,
      x,
      y + size
    );
    // Curva inferior direita
    ctx.bezierCurveTo(
      x,
      y + size * 0.75,
      x + size / 2,
      y + size / 2,
      x + size / 2,
      y + size / 4
    );
    // Curva direita
    ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4);
    ctx.closePath();
  }

  function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headlen = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
  }

  function spray(x, y) {
    ctx.fillStyle = currentColor;
    ctx.globalAlpha = opacity * 0.3;

    for (let i = 0; i < brushSize; i++) {
      const radius = brushSize * 2;
      const offsetX = (Math.random() - 0.5) * radius;
      const offsetY = (Math.random() - 0.5) * radius;

      if (Math.sqrt(offsetX * offsetX + offsetY * offsetY) <= radius) {
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
      }
    }
  }

  function floodFill(startX, startY) {
    // Implementação simplificada do preenchimento
    // Em uma aplicação real, isso seria mais complexo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const targetColor = getPixelColor(imageData, startX, startY);
    const fillColor = hexToRgb(currentColor);

    if (!targetColor || !fillColor) return;

    // Verificar se já está preenchido com a cor desejada
    if (
      targetColor.r === fillColor.r &&
      targetColor.g === fillColor.g &&
      targetColor.b === fillColor.b
    ) {
      return;
    }

    const stack = [[startX, startY]];
    const width = imageData.width;
    const height = imageData.height;

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const index = (y * width + x) * 4;

      // Verificar limites
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      // Verificar se o pixel já foi preenchido ou é da cor alvo
      if (
        imageData.data[index] === fillColor.r &&
        imageData.data[index + 1] === fillColor.g &&
        imageData.data[index + 2] === fillColor.b
      ) {
        continue;
      }

      if (
        imageData.data[index] === targetColor.r &&
        imageData.data[index + 1] === targetColor.g &&
        imageData.data[index + 2] === targetColor.b
      ) {
        // Preencher o pixel
        imageData.data[index] = fillColor.r;
        imageData.data[index + 1] = fillColor.g;
        imageData.data[index + 2] = fillColor.b;
        imageData.data[index + 3] = 255;

        // Adicionar vizinhos à pilha
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Salvar a ação na camada ativa
    layers[activeLayerIndex].data.push({
      type: "fill",
      x: startX,
      y: startY,
      color: currentColor,
    });
  }

  function getPixelColor(imageData, x, y) {
    const width = imageData.width;
    const index = (y * width + x) * 4;

    if (index < 0 || index >= imageData.data.length) return null;

    return {
      r: imageData.data[index],
      g: imageData.data[index + 1],
      b: imageData.data[index + 2],
      a: imageData.data[index + 3],
    };
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function drawAction(action, isActiveLayer = false) {
    if (!isActiveLayer) {
      // Para camadas não ativas, usar cores mais suaves
      ctx.globalAlpha = 0.7;
    } else {
      ctx.globalAlpha = 1;
    }

    if (action.type === "shape") {
      ctx.strokeStyle = action.color;
      ctx.fillStyle = action.color;
      ctx.lineWidth = action.size;

      drawShape(action.x1, action.y1, action.x2, action.y2, false);
    }
    // Outros tipos de ação podem ser adicionados aqui
  }

  // Funções de utilidade
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.type.includes("touch")) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    return { x, y };
  }

  // Manipulação de toque
  function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e.touches[0]);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    draw(e.touches[0]);
  }

  function handleTouchEnd(e) {
    e.preventDefault();
    stopDrawing(e.changedTouches[0]);
  }

  // Histórico de ações (desfazer/refazer)
  function saveState() {
    // Limpar estados futuros se estamos no meio do histórico
    if (historyIndex < drawingHistory.length - 1) {
      drawingHistory = drawingHistory.slice(0, historyIndex + 1);
    }

    // Salvar o estado atual das camadas
    const state = {
      layers: JSON.parse(JSON.stringify(layers)),
      activeLayerIndex: activeLayerIndex,
    };

    drawingHistory.push(state);
    historyIndex = drawingHistory.length - 1;

    updateUndoRedoButtons();
  }

  function undo() {
    if (historyIndex > 0) {
      historyIndex--;
      restoreState();
    }
  }

  function redo() {
    if (historyIndex < drawingHistory.length - 1) {
      historyIndex++;
      restoreState();
    }
  }

  function restoreState() {
    const state = drawingHistory[historyIndex];
    layers = JSON.parse(JSON.stringify(state.layers));
    activeLayerIndex = state.activeLayerIndex;

    updateLayersList();
    redrawAllLayers();
    updateUndoRedoButtons();
  }

  function updateUndoRedoButtons() {
    document.getElementById("undo-action").disabled = historyIndex <= 0;
    document.getElementById("redo-action").disabled =
      historyIndex >= drawingHistory.length - 1;
  }

  // Limpar canvas
  function clearCanvas() {
    if (
      confirm(
        "Tem certeza que deseja limpar o desenho? Isso não pode ser desfeito."
      )
    ) {
      layers.forEach((layer) => {
        layer.data = [];
      });
      redrawAllLayers();
      saveState();
      showNotification("Canvas limpo");
    }
  }

  // Salvar desenho
  function saveDrawing() {
    // Em uma aplicação real, isso salvaria no servidor
    // Por enquanto, vamos apenas simular o salvamento
    const dataURL = canvas.toDataURL("image/png");
    localStorage.setItem("savedDrawing", dataURL);
    showNotification("Desenho salvo com sucesso!");
  }

  // Exportar desenho
  function exportDrawing() {
    const link = document.createElement("a");
    link.download = "meu-desenho.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showNotification("Desenho exportado");
  }

  // Notificações
  function showNotification(message, type = "success") {
    notificationText.textContent = message;

    if (type === "error") {
      notification.style.background = "rgba(255, 71, 87, 0.9)";
    } else {
      notification.style.background = "rgba(45, 21, 84, 0.9)";
    }

    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  // Bolinhas flutuantes
  function createFloatingShapes() {
    const shapesContainer = document.querySelector(".floating-shapes");
    const shapesCount = 15;

    for (let i = 0; i < shapesCount; i++) {
      const shape = document.createElement("div");
      shape.classList.add("floating-shape");
      shape.classList.add(i % 2 === 0 ? "purple" : "gold");

      // Tamanho e posição aleatórios
      const size = Math.random() * 40 + 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 15;

      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.left = `${left}%`;
      shape.style.top = `${top}%`;
      shape.style.animationDelay = `${delay}s`;

      shapesContainer.appendChild(shape);

      // Interação ao clicar
      shape.addEventListener("click", function () {
        this.style.animation = "none";
        this.style.transform = "scale(1.5)";
        this.style.opacity = "0";

        setTimeout(() => {
          this.remove();
          createFloatingShape(); // Adicionar uma nova bolinha
        }, 500);
      });
    }
  }

  function createFloatingShape() {
    const shapesContainer = document.querySelector(".floating-shapes");
    const shape = document.createElement("div");
    shape.classList.add("floating-shape");
    shape.classList.add(Math.random() > 0.5 ? "purple" : "gold");

    const size = Math.random() * 40 + 10;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 15;

    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.left = `${left}%`;
    shape.style.top = `${top}%`;
    shape.style.animationDelay = `${delay}s`;

    shapesContainer.appendChild(shape);

    shape.addEventListener("click", function () {
      this.style.animation = "none";
      this.style.transform = "scale(1.5)";
      this.style.opacity = "0";

      setTimeout(() => {
        this.remove();
        createFloatingShape();
      }, 500);
    });
  }

  // Atualizar UI
  function updateUI() {
    // Definir cor atual
    document.getElementById("current-color-display").style.backgroundColor =
      currentColor;
    document.getElementById("color-picker").value = currentColor;

    // Atualizar valores dos controles
    document.getElementById("brush-size-value").textContent = brushSize + "px";
    document.getElementById("opacity-value").textContent =
      Math.round(opacity * 100) + "%";
    document.getElementById("smoothness-value").textContent = smoothness;
  }

  // Inicializar a aplicação
  init();
});
