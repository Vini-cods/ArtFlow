// Configuração do jogo
const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
let cards = [...emojis, ...emojis];
let flippedCards = [];
let matchedCards = [];
let moves = 0;
let timer = null;
let seconds = 0;
let gameStarted = false;

// Elementos do DOM
const gameBoard = document.getElementById("game-board");
const movesElement = document.getElementById("moves");
const timeElement = document.getElementById("time");
const restartButton = document.getElementById("restart");
const winnerMessage = document.getElementById("winner-message");
const finalMovesElement = document.getElementById("final-moves");
const finalTimeElement = document.getElementById("final-time");
const playAgainButton = document.getElementById("play-again");

// Inicializar o jogo
function initGame() {
  // Embaralhar as cartas
  cards = shuffleArray([...emojis, ...emojis]);

  // Limpar o tabuleiro
  gameBoard.innerHTML = "";

  // Criar as cartas
  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.index = index;
    card.dataset.emoji = emoji;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.innerHTML = "?";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.innerHTML = emoji;

    card.appendChild(cardBack);
    card.appendChild(cardFront);

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  // Reiniciar variáveis do jogo
  flippedCards = [];
  matchedCards = [];
  moves = 0;
  seconds = 0;
  gameStarted = false;

  // Atualizar a interface
  movesElement.textContent = moves;
  timeElement.textContent = "00:00";

  // Esconder mensagem de vitória
  winnerMessage.classList.remove("active");

  // Parar o temporizador anterior se existir
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

// Embaralhar array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Virar uma carta
function flipCard(card) {
  // Não permitir virar se já tiver duas cartas viradas ou se a carta já estiver virada ou combinada
  if (
    flippedCards.length === 2 ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) {
    return;
  }

  // Iniciar o temporizador no primeiro movimento
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }

  // Virar a carta
  card.classList.add("flipped");
  flippedCards.push(card);

  // Verificar se duas cartas foram viradas
  if (flippedCards.length === 2) {
    moves++;
    movesElement.textContent = moves;

    // Verificar se as cartas são iguais
    setTimeout(checkMatch, 600);
  }
}

// Verificar se as cartas viradas são iguais
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Cartas combinam
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedCards.push(card1, card2);

    // Verificar se o jogo terminou
    if (matchedCards.length === cards.length) {
      endGame();
    }
  } else {
    // Cartas não combinam - virar de volta
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
  }

  // Limpar as cartas viradas
  flippedCards = [];
}

// Iniciar o temporizador
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeElement.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, 1000);
}

// Finalizar o jogo
function endGame() {
  clearInterval(timer);

  // Mostrar mensagem de vitória
  finalMovesElement.textContent = moves;
  finalTimeElement.textContent = timeElement.textContent;

  setTimeout(() => {
    winnerMessage.classList.add("active");

    // Criar efeito de confete
    createConfetti();
  }, 1000);
}

// Criar efeito de confete
function createConfetti() {
  const colors = [
    "#ffd700",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#f9c74f",
    "#f9844a",
    "#90be6d",
  ];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 5 + "s";
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(confetti);

    // Remover após a animação
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Criar bolinhas flutuantes interativas
function createFloatingShapes() {
  const container = document.querySelector(".floating-shapes");

  // Limpar shapes existentes
  container.innerHTML = "";

  // Criar diferentes tamanhos e cores de bolinhas
  const shapeConfigs = [
    { size: 60, color: "purple", count: 8 },
    { size: 40, color: "gold", count: 6 },
    { size: 80, color: "purple", count: 4 },
    { size: 25, color: "gold", count: 10 },
    { size: 15, color: "purple", count: 15 },
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
        shape.style.transform = "scale(1.2)";
        shape.style.opacity = "0.9";
      });

      shape.addEventListener("mouseout", () => {
        shape.style.transform = "scale(1)";
        shape.style.opacity = "0.6";
      });

      container.appendChild(shape);
    }
  });
}

// Event listeners
restartButton.addEventListener("click", initGame);
playAgainButton.addEventListener("click", initGame);

// Inicializar o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  initGame();
  createFloatingShapes();

  // Adicionar estilos para o confetti
  const style = document.createElement("style");
  style.textContent = `
        .confetti {
            position: fixed;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            animation: fall 5s linear forwards;
            z-index: 1000;
        }
        
        @keyframes fall {
            0% {
                transform: translateY(-10vh) rotate(0deg);
            }
            100% {
                transform: translateY(110vh) rotate(720deg);
            }
        }
    `;
  document.head.appendChild(style);
});
