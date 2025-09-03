document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clear-btn');
    const saveBtn = document.getElementById('save-btn');
    const toolButtons = document.querySelectorAll('.tool-btn');
    const colorButtons = document.querySelectorAll('.color-btn');
    const colorPickerBtn = document.getElementById('color-picker-btn');
    const colorPicker = document.getElementById('color-picker');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Variáveis de estado
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let currentLineWidth = 3;

    // Configuração do canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        // Restaurar desenho se existir
        const savedDrawing = localStorage.getItem('drawing');
        if (savedDrawing) {
            const img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedDrawing;
        }
    }

    // Inicializar canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Funções de desenho
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function draw(e) {
        if (!isDrawing) return;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);

        if (currentTool === 'pencil') {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        } else if (currentTool === 'brush') {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = currentLineWidth * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        } else if (currentTool === 'eraser') {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = currentLineWidth * 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }

        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        isDrawing = false;

        // Salvar automaticamente o progresso
        saveProgress();
    }

    // Event listeners para desenho
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events para dispositivos móveis
    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX - rect.left,
            clientY: touch.clientY - rect.top
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX - rect.left,
            clientY: touch.clientY - rect.top
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup');
        canvas.dispatchEvent(mouseEvent);
    });

    // Ferramentas e cores
    toolButtons.forEach(button => {
        button.addEventListener('click', function () {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.getAttribute('data-tool');
        });
    });

    colorButtons.forEach(button => {
        button.addEventListener('click', function () {
            colorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
        });
    });

    colorPickerBtn.addEventListener('click', function () {
        colorPicker.click();
    });

    colorPicker.addEventListener('input', function () {
        currentColor = this.value;

        // Desativar todas as cores padrão
        colorButtons.forEach(btn => btn.classList.remove('active'));

        // Criar ou ativar um botão de cor personalizada
        activateCustomColor(this.value);
    });

    function activateCustomColor(color) {
        // Verificar se já existe um botão de cor personalizada
        let customColorBtn = document.querySelector('.color-btn.custom');

        if (!customColorBtn) {
            // Criar um novo botão para a cor personalizada
            customColorBtn = document.createElement('div');
            customColorBtn.className = 'color-btn custom active';
            customColorBtn.style.backgroundColor = color;
            customColorBtn.setAttribute('data-color', color);

            // Adicionar à paleta de cores
            const colorPalette = document.querySelector('.color-palette');
            colorPalette.appendChild(customColorBtn);

            // Adicionar event listener ao novo botão
            customColorBtn.addEventListener('click', function () {
                colorButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentColor = this.getAttribute('data-color');
            });
        } else {
            // Atualizar a cor existente
            customColorBtn.style.backgroundColor = color;
            customColorBtn.setAttribute('data-color', color);
            customColorBtn.classList.add('active');
        }
    }

    // Limpar e salvar
    clearBtn.addEventListener('click', function () {
        if (confirm('Tem certeza que deseja limpar o desenho?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            localStorage.removeItem('drawing');
            showNotification('Desenho limpo!');
        }
    });

    saveBtn.addEventListener('click', function () {
        saveProgress();
        showNotification('Desenho salvo com sucesso!');
    });

    function saveProgress() {
        const dataURL = canvas.toDataURL('image/png');
        localStorage.setItem('drawing', dataURL);
    }

    function showNotification(message) {
        notificationText.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
});