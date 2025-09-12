// JavaScript para a página de desafio semanal
document.addEventListener('DOMContentLoaded', function() {
    // Configuração do canvas de desenho
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    let currentColor = '#000000';
    let lineWidth = 5;
    let opacity = 1;
    let drawingHistory = [];
    let historyIndex = -1;
    let isSpraying = false;
    let sprayInterval;
    let currentShape = 'rectangle';
    let startX, startY;

    // Ajustar canvas para alta resolução
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Definir estilo inicial
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = opacity;

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
        document.getElementById('undo-action').disabled = historyIndex <= 0;
        document.getElementById('redo-action').disabled = historyIndex >= drawingHistory.length - 1;
    }

    // Salvar estado inicial
    saveCanvasState();

    // Funções de desenho
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
        startX = e.offsetX;
        startY = e.offsetY;
        
        if (currentTool === 'spray') {
            isSpraying = true;
            sprayPaint();
        } else if (currentTool === 'fill') {
            floodFill(e.offsetX, e.offsetY, hexToRgb(currentColor));
        } else if (currentTool === 'shapes') {
            // Para formas, vamos desenhar no mouseup
        } else {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }
    }

    function draw(e) {
        if (!isDrawing) return;
        
        if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'marker') {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    function stopDrawing() {
        if (isDrawing && currentTool === 'shapes') {
            drawShape(startX, startY, lastX, lastY);
        }
        
        isDrawing = false;
        isSpraying = false;
        ctx.beginPath();
        
        // Salvar estado após terminar de desenhar
        if (currentTool !== 'spray') {
            saveCanvasState();
        }
    }

    // Função para spray
    function sprayPaint() {
        if (!isSpraying) return;
        
        const density = 50;
        const radius = lineWidth;
        
        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const x = lastX + Math.cos(angle) * distance;
            const y = lastY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, lineWidth/10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        if (isSpraying) {
            setTimeout(sprayPaint, 30);
        }
    }

    // Função para preenchimento
    function floodFill(x, y, fillColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const targetColor = getPixelColor(x, y, pixelData);
        const pixelStack = [[x, y]];
        
        // Se a cor de preenchimento é igual à cor do alvo, sair
        if (colorsMatch(targetColor, fillColor)) return;
        
        while (pixelStack.length) {
            const newPos = pixelStack.pop();
            const x = newPos[0];
            let y = newPos[1];
            
            // Obter a cor atual do pixel
            let pixelPos = (y * canvas.width + x) * 4;
            
            // Percorer para cima
            while (y-- >= 0 && colorsMatch(getPixelColor(x, y, pixelData), targetColor)) {
                pixelPos = (y * canvas.width + x) * 4;
            }
            
            y++;
            pixelPos = (y * canvas.width + x) * 4;
            
            let reachLeft = false;
            let reachRight = false;
            
            while (y++ < canvas.height - 1 && colorsMatch(getPixelColor(x, y, pixelData), targetColor)) {
                setPixelColor(x, y, fillColor, pixelData);
                
                if (x > 0) {
                    if (colorsMatch(getPixelColor(x - 1, y, pixelData), targetColor)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                
                if (x < canvas.width - 1) {
                    if (colorsMatch(getPixelColor(x + 1, y, pixelData), targetColor)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }
                
                pixelPos += canvas.width * 4;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        saveCanvasState();
    }

    // Funções auxiliares para flood fill
    function getPixelColor(x, y, pixelData) {
        const pixelPos = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        return {
            r: pixelData[pixelPos],
            g: pixelData[pixelPos + 1],
            b: pixelData[pixelPos + 2],
            a: pixelData[pixelPos + 3]
        };
    }
    
    function setPixelColor(x, y, color, pixelData) {
        const pixelPos = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        pixelData[pixelPos] = color.r;
        pixelData[pixelPos + 1] = color.g;
        pixelData[pixelPos + 2] = color.b;
        pixelData[pixelPos + 3] = color.a !== undefined ? color.a : 255;
    }
    
    function colorsMatch(color1, color2) {
        return color1.r === color2.r && 
               color1.g === color2.g && 
               color1.b === color2.b && 
               color1.a === color2.a;
    }
    
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    // Função para desenhar formas
    function drawShape(startX, startY, endX, endY) {
        const width = endX - startX;
        const height = endY - startY;
        
        ctx.beginPath();
        
        switch(currentShape) {
            case 'rectangle':
                ctx.rect(startX, startY, width, height);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
                ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                break;
            case 'triangle':
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.lineTo(startX * 2 - endX, endY);
                ctx.closePath();
                break;
            case 'line':
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                break;
        }
        
        if (currentTool === 'shapes') {
            ctx.stroke();
        }
        
        saveCanvasState();
    }

    // Event listeners para o canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Para dispositivos touch
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });

    // Ferramentas de desenho
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            toolButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Alterar ferramenta
            currentTool = button.getAttribute('data-tool');
            
            // Configurar contexto de acordo com a ferramenta
            switch(currentTool) {
                case 'pencil':
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = currentColor;
                    ctx.globalAlpha = opacity;
                    break;
                case 'brush':
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.lineWidth = lineWidth * 2;
                    ctx.strokeStyle = currentColor;
                    ctx.globalAlpha = opacity;
                    break;
                case 'marker':
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.lineWidth = lineWidth * 3;
                    ctx.strokeStyle = currentColor;
                    ctx.globalAlpha = 0.5;
                    break;
                case 'spray':
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.fillStyle = currentColor;
                    ctx.globalAlpha = opacity * 0.7;
                    break;
                case 'eraser':
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = lineWidth * 4;
                    ctx.globalAlpha = 0.7;
                    break;
                case 'fill':
                    ctx.globalCompositeOperation = 'source-over';
                    break;
                case 'shapes':
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = currentColor;
                    ctx.lineWidth = lineWidth;
                    ctx.globalAlpha = opacity;
                    break;
            }
        });
    });

    // Paleta de cores
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe ativa de todos os botões
            colorButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adicionar classe ativa ao botão clicado
            button.classList.add('active');
            
            // Alterar cor
            currentColor = button.getAttribute('data-color');
            ctx.strokeStyle = currentColor;
            ctx.fillStyle = currentColor;
            ctx.globalCompositeOperation = 'source-over';
        });
    });

    // Seletor de cor personalizado
    document.getElementById('color-picker').addEventListener('input', function(e) {
        currentColor = e.target.value;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        
        // Atualizar botão ativo na paleta
        colorButtons.forEach(btn => btn.classList.remove('active'));
    });

    // Controle de tamanho do pincel
    const brushSizeSlider = document.getElementById('brush-size');
    const brushSizeValue = document.getElementById('brush-size-value');
    
    brushSizeSlider.addEventListener('input', function() {
        lineWidth = this.value;
        brushSizeValue.textContent = `${lineWidth}px`;
        
        // Atualizar o contexto com o novo tamanho
        if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'shapes') {
            ctx.lineWidth = lineWidth;
        } else if (currentTool === 'marker') {
            ctx.lineWidth = lineWidth * 3;
        } else if (currentTool === 'eraser') {
            ctx.lineWidth = lineWidth * 4;
        }
    });

    // Controle de opacidade
    const opacitySlider = document.getElementById('opacity');
    const opacityValue = document.getElementById('opacity-value');
    
    opacitySlider.addEventListener('input', function() {
        opacity = this.value / 100;
        opacityValue.textContent = `${this.value}%`;
        ctx.globalAlpha = opacity;
    });

    // Limpar canvas
    document.getElementById('clear-canvas').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja limpar todo o desenho?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveCanvasState();
        }
    });

    // Reiniciar desenho
    document.getElementById('reset-drawing').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja começar um novo desenho? Seu progresso atual será perdido.')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawingHistory = [];
            historyIndex = -1;
            saveCanvasState();
            updateUndoRedoButtons();
        }
    });

    // Desfazer ação
    document.getElementById('undo-action').addEventListener('click', () => {
        if (historyIndex > 0) {
            historyIndex--;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateUndoRedoButtons();
        }
    });

    // Refazer ação
    document.getElementById('redo-action').addEventListener('click', () => {
        if (historyIndex < drawingHistory.length - 1) {
            historyIndex++;
            ctx.putImageData(drawingHistory[historyIndex], 0, 0);
            updateUndoRedoButtons();
        }
    });

    // Upload de imagem
    document.getElementById('upload-image').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // Limpar canvas e desenhar a imagem
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    saveCanvasState();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Enviar desenho
    document.getElementById('submit-drawing').addEventListener('click', function() {
        // Verificar se o canvas está vazio
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let isEmpty = true;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] !== 0) {
                isEmpty = false;
                break;
            }
        }
        
        if (isEmpty) {
            alert('Por favor, faça um desenho antes de enviar!');
            return;
        }
        
        // Simular envio (em uma implementação real, isso enviaria para um servidor)
        const drawingData = canvas.toDataURL('image/png');
        
        // Adicionar à galeria (simulação)
        addToGallery(drawingData, 'Você');
        
        // Mostrar mensagem de sucesso
        showNotification('Desenho enviado com sucesso! Boa sorte no desafio!');
        
        // Limpar canvas após envio
        setTimeout(() => {
            if (confirm('Deseja começar um novo desenho?')) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawingHistory = [];
                historyIndex = -1;
                saveCanvasState();
                updateUndoRedoButtons();
            }
        }, 1000);
    });

    // Função para adicionar desenho à galeria
    function addToGallery(imageData, author) {
        const emptyGallery = document.querySelector('.empty-gallery');
        if (emptyGallery) {
            emptyGallery.remove();
        }
        
        const submissionsContainer = document.getElementById('submissions-container');
        const submissionItem = document.createElement('div');
        submissionItem.className = 'submission-item';
        
        submissionItem.innerHTML = `
            <img src="${imageData}" alt="Desenho de ${author}" class="submission-img">
            <div class="submission-info">
                <div class="submission-author">Por: ${author}</div>
                <div class="submission-stats">
                    <span><i class="fas fa-heart"></i> 0</span>
                    <span><i class="fas fa-comment"></i> 0</span>
                </div>
            </div>
        `;
        
        submissionsContainer.prepend(submissionItem);
    }

    // Contador regressivo
    function updateCountdown() {
        // Definir data de término (5 dias a partir de agora)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 5);
        endDate.setHours(23, 59, 59, 999);
        
        function update() {
            const now = new Date();
            const timeRemaining = endDate - now;
            
            if (timeRemaining <= 0) {
                document.getElementById('countdown').innerHTML = 'Desafio encerrado!';
                return;
            }
            
            // Calcular dias, horas, minutos
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
        }
        
        // Atualizar a cada minuto
        update();
        setInterval(update, 60000);
    }
    
    updateCountdown();

    // Adicionar alguns desenhos de exemplo após um tempo (simulação)
    setTimeout(() => {
        // Simular alguns desenhos de exemplo na galeria
        const exampleImages = [
            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1515405295579-ba7b45403062?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80',
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
        ];
        
        const authors = ['Maria, 8 anos', 'João, 7 anos', 'Ana, 9 anos'];
        
        const emptyGallery = document.querySelector('.empty-gallery');
        if (emptyGallery) {
            emptyGallery.remove();
        }
        
        const submissionsContainer = document.getElementById('submissions-container');
        
        exampleImages.forEach((img, index) => {
            const submissionItem = document.createElement('div');
            submissionItem.className = 'submission-item';
            
            submissionItem.innerHTML = `
                <img src="${img}" alt="Desenho de ${authors[index]}" class="submission-img">
                <div class="submission-info">
                    <div class="submission-author">Por: ${authors[index]}</div>
                    <div class="submission-stats">
                        <span><i class="fas fa-heart"></i> ${Math.floor(Math.random() * 20) + 5}</span>
                        <span><i class="fas fa-comment"></i> ${Math.floor(Math.random() * 10)}</span>
                    </div>
                </div>
            `;
            
            submissionsContainer.appendChild(submissionItem);
        });
    }, 3000);

    // Função para mostrar notificações
    function showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(107, 47, 160, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
});