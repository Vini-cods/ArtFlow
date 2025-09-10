// Configuração do canvas de desenho
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');

// Variáveis para controle de desenho
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentColor = '#000000';
let brushSize = 5;

// Configuração inicial do canvas
function setupCanvas() {
    // Ajustar tamanho do canvas para a área de desenho
    const drawingArea = canvas.parentElement;
    canvas.width = drawingArea.offsetWidth;
    canvas.height = drawingArea.offsetHeight;

    // Configurar contexto
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = currentColor;

    // Limpar canvas com fundo branco
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Inicializar a tela de desenho
function initDrawing() {
    setupCanvas();

    // Event listeners para desenho
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listeners para toque (dispositivos móveis)
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Configurar paleta de cores
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remover classe active de todas as opções
            colorOptions.forEach(opt => opt.classList.remove('active'));
            // Adicionar classe active à opção selecionada
            option.classList.add('active');
            // Atualizar cor atual
            currentColor = option.getAttribute('data-color');
            ctx.strokeStyle = currentColor;
            // Atualizar seletor de cor personalizada
            document.getElementById('color-picker').value = currentColor;
        });
    });

    // Configurar seletor de cor personalizada
    const colorPicker = document.getElementById('color-picker');
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;

        // Atualizar opção ativa na paleta
        colorOptions.forEach(opt => opt.classList.remove('active'));
    });

    // Configurar controle de espessura do pincel
    const brushSizeInput = document.getElementById('brush-size');
    brushSizeInput.addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value);
        ctx.lineWidth = brushSize;
    });
}

// Funções para desenho com mouse
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

// Funções para desenho com toque
function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup');
    canvas.dispatchEvent(mouseEvent);
}

// Limpar canvas
function clearCanvas() {
    if (confirm('Tem certeza que deseja limpar o desenho?')) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Salvar desenho
function saveDrawing() {
    const link = document.createElement('a');
    link.download = 'meu-desenho-aventura-na-floresta.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    // Mostrar mensagem de sucesso
    showNotification('Desenho salvo com sucesso!');
}

// Voltar para a tela anterior
function goBack() {
    if (confirm('Voltar para a tela inicial? Seu desenho não será salvo automaticamente.')) {
        window.history.back();
    }
}

// Função para mostrar notificações
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

    // Estilos para a notificação
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.background = 'rgba(45, 21, 84, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.backdropFilter = 'blur(10px)';
    notification.style.border = '1px solid rgba(255, 215, 0, 0.3)';
    notification.style.transform = 'translateX(100px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';

    // Adicionar ao corpo do documento
    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Criar bolinhas flutuantes
function createFloatingShapes() {
    const container = document.querySelector('.floating-shapes');

    // Limpar shapes existentes
    container.innerHTML = '';

    // Criar diferentes tamanhos e cores de bolinhas
    const shapeConfigs = [
        { size: 60, color: 'purple', count: 8 },
        { size: 40, color: 'gold', count: 6 },
        { size: 80, color: 'purple', count: 4 },
        { size: 25, color: 'gold', count: 10 },
        { size: 15, color: 'purple', count: 15 },
    ];

    shapeConfigs.forEach((config) => {
        for (let i = 0; i < config.count; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape ${config.color}`;
            shape.style.width = config.size + 'px';
            shape.style.height = config.size + 'px';
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 8 + 's';
            shape.style.animationDuration = `${8 + Math.random() * 4}s`;

            container.appendChild(shape);
        }
    });
}

// Inicializar quando a página carregar
window.addEventListener('load', () => {
    initDrawing();
    createFloatingShapes();

    // Ajustar canvas quando a janela for redimensionada
    window.addEventListener('resize', setupCanvas);
});