// Script específico para a página de criação de histórias

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar editor
    initEditor();
    
    // Configurar upload de capa
    setupCoverUpload();
    
    // Configurar painel de desenho
    setupDrawingPanel();
    
    // Configurar controles de página
    setupPageControls();
    
    // Configurar botões de ação
    setupActionButtons();
});

// Variáveis globais
let currentPage = 1;
let totalPages = 1;
let pagesContent = {
    1: '<p>Era uma vez... comece sua história aqui!</p>'
};

// Inicializar o editor
function initEditor() {
    const editor = document.getElementById('storyEditor');
    
    // Configurar os botões da barra de ferramentas
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.dataset.command;
            document.execCommand(command, false, null);
            editor.focus();
        });
    });
    
    // Configurar botão de adicionar imagem
    document.getElementById('addImageBtn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    document.execCommand('insertImage', false, event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
    
    // Salvar conteúdo quando o editor perder o foco
    editor.addEventListener('blur', function() {
        savePageContent();
    });
}

// Configurar upload de capa
function setupCoverUpload() {
    const coverInput = document.getElementById('storyCover');
    const coverPreview = document.getElementById('coverPreview');
    
    coverPreview.addEventListener('click', function() {
        coverInput.click();
    });
    
    coverInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                coverPreview.classList.add('has-image');
                coverPreview.innerHTML = `<img src="${event.target.result}" alt="Capa da história">`;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });
}

// Configurar painel de desenho
function setupDrawingPanel() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let brushSize = 5;
    
    // Configurar o canvas
    function initCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Inicializar o canvas
    initCanvas();
    
    // Eventos de desenho
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos touch para dispositivos móveis
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    function startDrawing(e) {
        isDrawing = true;
        const pos = getMousePos(canvas, e);
        [lastX, lastY] = [pos.x, pos.y];
    }
    
    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const pos = getMousePos(canvas, e);
        const currentX = pos.x;
        const currentY = pos.y;
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        
        [lastX, lastY] = [currentX, currentY];
    }
    
    function stopDrawing() {
        isDrawing = false;
    }
    
    function getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if (evt.type.includes('touch')) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        } else {
            clientX = evt.clientX;
            clientY = evt.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent);
        }
    }
    
    function handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }
    
    // Configurar botões de ferramentas
    const toolButtons = document.querySelectorAll('.draw-tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.dataset.tool;
        });
    });
    
    // Configurar seletor de cor
    document.getElementById('drawingColor').addEventListener('input', function(e) {
        currentColor = e.target.value;
    });
    
    // Configurar tamanho do pincel
    document.getElementById('brushSize').addEventListener('input', function(e) {
        brushSize = e.target.value;
    });
    
    // Configurar botão de limpar
    document.getElementById('clearCanvasBtn').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar o desenho?')) {
            initCanvas();
        }
    });
    
    // Configurar botão de abrir painel de desenho
    document.getElementById('addDrawingBtn').addEventListener('click', function() {
        document.getElementById('drawingPanel').style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // Configurar botão de fechar painel
    document.getElementById('closeDrawingPanel').addEventListener('click', function() {
        document.getElementById('drawingPanel').style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Configurar botão de inserir desenho
    document.getElementById('insertDrawingBtn').addEventListener('click', function() {
        const dataURL = canvas.toDataURL('image/png');
        document.execCommand('insertImage', false, dataURL);
        document.getElementById('drawingPanel').style.display = 'none';
        document.body.style.overflow = 'auto';
        initCanvas(); // Limpar o canvas para o próximo desenho
    });
}

// Configurar controles de página
function setupPageControls() {
    // Atualizar contador de páginas
    updatePageCounter();
    
    // Configurar botão de adicionar página
    document.getElementById('addPageBtn').addEventListener('click', function() {
        addNewPage();
    });
    
    // Configurar botão de página anterior
    document.getElementById('prevPageBtn').addEventListener('click', function() {
        navigateToPage(currentPage - 1);
    });
    
    // Configurar botão de próxima página
    document.getElementById('nextPageBtn').addEventListener('click', function() {
        navigateToPage(currentPage + 1);
    });
}

// Adicionar nova página
function addNewPage() {
    // Salvar conteúdo da página atual
    savePageContent();
    
    // Incrementar contadores
    totalPages++;
    currentPage = totalPages;
    
    // Adicionar nova página ao objeto de conteúdo
    pagesContent[currentPage] = '<p>Nova página...</p>';
    
    // Atualizar editor com a nova página
    document.getElementById('storyEditor').innerHTML = pagesContent[currentPage];
    
    // Atualizar controles
    updatePageControls();
    updatePageCounter();
}

// Navegar para uma página específica
function navigateToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    // Salvar conteúdo da página atual
    savePageContent();
    
    // Atualizar página atual
    currentPage = pageNumber;
    
    // Carregar conteúdo da página
    document.getElementById('storyEditor').innerHTML = pagesContent[currentPage] || '<p>Nova página...</p>';
    
    // Atualizar controles
    updatePageControls();
    updatePageCounter();
}

// Salvar conteúdo da página atual
function savePageContent() {
    pagesContent[currentPage] = document.getElementById('storyEditor').innerHTML;
}

// Atualizar controles de navegação
function updatePageControls() {
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

// Atualizar contador de páginas
function updatePageCounter() {
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
}

// Configurar botões de ação
function setupActionButtons() {
    // Salvar rascunho
    document.getElementById('saveDraftBtn').addEventListener('click', function() {
        savePageContent();
        saveAsDraft();
    });
    
    // Visualizar
    document.getElementById('previewBtn').addEventListener('click', function() {
        savePageContent();
        previewStory();
    });
    
    // Publicar
    document.getElementById('publishBtn').addEventListener('click', function() {
        savePageContent();
        publishStory();
    });
}

// Salvar como rascunho
function saveAsDraft() {
    const storyData = collectStoryData();
    
    // Simular salvamento (em uma aplicação real, isso faria uma requisição AJAX)
    localStorage.setItem('storyDraft', JSON.stringify(storyData));
    
    showNotification('Rascunho salvo com sucesso!');
}

// Visualizar história
function previewStory() {
    const storyData = collectStoryData();
    
    // Em uma aplicação real, isso abriria uma nova janela/aba com a visualização
    alert('Visualização da história:\n\n' + 
          `Título: ${storyData.title}\n` +
          `Categoria: ${storyData.category}\n` +
          `Páginas: ${Object.keys(storyData.pages).length}`);
}

// Publicar história
function publishStory() {
    const storyData = collectStoryData();
    
    // Validar dados
    if (!storyData.title) {
        showNotification('Por favor, adicione um título à sua história.', 'error');
        return;
    }
    
    if (!storyData.category) {
        showNotification('Por favor, selecione uma categoria.', 'error');
        return;
    }
    
    // Salvar a história no localStorage com uma estrutura que a página Minhas Histórias possa entender
    const story = {
        id: Date.now().toString(), // ID único
        title: storyData.title,
        category: storyData.category,
        cover: storyData.cover,
        pages: storyData.pages,
        date: new Date().toISOString(),
        status: "new", // nova história
        progress: 0, // progresso inicial
        pagesCount: Object.keys(storyData.pages).length,
        currentPage: 1,
        favorite: false
    };
    
    // Recuperar histórias existentes ou criar um array vazio
    let stories = JSON.parse(localStorage.getItem('artflow-stories')) || [];
    
    // Adicionar a nova história
    stories.push(story);
    
    // Salvar no localStorage
    localStorage.setItem('artflow-stories', JSON.stringify(stories));
    
    showNotification('História publicada com sucesso!');
    
    // Redirecionar para a página de minhas histórias após um breve delay
    setTimeout(() => {
        window.location.href = '../minhas-historias/index.html';
    }, 1500);
}

// Coletar todos os dados da história
function collectStoryData() {
    const coverPreview = document.getElementById('coverPreview');
    const coverImg = coverPreview.querySelector('img');
    
    return {
        title: document.getElementById('storyTitle').value,
        category: document.getElementById('storyCategory').value,
        cover: coverImg ? coverImg.src : null,
        pages: {...pagesContent},
        createdAt: new Date().toISOString()
    };
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #38a169, #48bb78)';
    } else {
        notification.style.background = 'linear-gradient(45deg, #e53e3e, #f56565)';
    }
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar estilos de animação para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);