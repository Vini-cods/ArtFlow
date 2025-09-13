// Dados dos quizzes
const quizzes = {
    1: {
        title: "Aventura na Floresta",
        questions: [
            {
                question: "Quem são os personagens principais da história?",
                options: [
                    "Dois irmãos",
                    "Dois amigos",
                    "Um menino e seu cachorro",
                    "Uma menina e seu avô"
                ],
                correct: 1
            },
            {
                question: "O que os personagens encontram na floresta?",
                options: [
                    "Um tesouro escondido",
                    "Criaturas mágicas",
                    "Uma cidade perdida",
                    "Um dinossauro"
                ],
                correct: 1
            },
            {
                question: "Qual é a lição principal da história?",
                options: [
                    "A importância da coragem",
                    "O valor da amizade",
                    "A necessidade de preservar a natureza",
                    "Todos os anteriores"
                ],
                correct: 3
            },
            {
                question: "Que tipo de criatura mágica ajuda os personagens?",
                options: [
                    "Um dragão",
                    "Uma fada",
                    "Um unicórnio",
                    "Um elfo"
                ],
                correct: 1
            },
            {
                question: "Como a história termina?",
                options: [
                    "Os personagens voltam para casa com um tesouro",
                    "Os personagens decidem morar na floresta",
                    "Os personagens prometem proteger a floresta",
                    "Os personagens esquecem a aventura"
                ],
                correct: 2
            }
        ]
    },
    2: {
        title: "O Castelo Mágico",
        questions: [
            {
                question: "Quem é a protagonista da história?",
                options: [
                    "Uma princesa corajosa",
                    "Uma bruxa bondosa",
                    "Uma camponesa curiosa",
                    "Uma fada travessa"
                ],
                correct: 0
            },
            {
                question: "O que a protagonista descobre no castelo?",
                options: [
                    "Um espelho mágico",
                    "Um jardim secreto",
                    "Um livro de feitiços",
                    "Um baú de tesouros"
                ],
                correct: 1
            },
            {
                question: "Qual criatura habita o castelo?",
                options: [
                    "Um dragão",
                    "Um grifo",
                    "Uma fênix",
                    "Um lobisomem"
                ],
                correct: 2
            },
            {
                question: "Qual é o segredo do castelo?",
                options: [
                    "Ele se move durante a noite",
                    "Ele está encantado há séculos",
                    "Ele esconde um portal para outro mundo",
                    "Ele foi construído por gigantes"
                ],
                correct: 1
            },
            {
                question: "Como a história se resolve?",
                options: [
                    "A protagonista quebra o encanto",
                    "O castelo desaparece",
                    "A protagonista se torna a rainha",
                    "Todos vivem felizes para sempre"
                ],
                correct: 0
            }
        ]
    },
    3: {
        title: "Viagem ao Espaço",
        questions: [
            {
                question: "Qual é o nome da nave espacial?",
                options: [
                    "Exploradora",
                    "Estelar",
                    "Galáxia",
                    "Cosmos"
                ],
                correct: 0
            },
            {
                question: "Quantos planetas os personagens visitam?",
                options: [
                    "2 planetas",
                    "3 planetas",
                    "4 planetas",
                    "5 planetas"
                ],
                correct: 2
            },
            {
                question: "Que tipo de alienígenas eles encontram?",
                options: [
                    "Alienígenas hostis",
                    "Alienígenas robóticos",
                    "Alienígenas curiosos e amigáveis",
                    "Alienígenas invisíveis"
                ],
                correct: 2
            },
            {
                question: "Qual é o problema que enfrentam durante a missão?",
                options: [
                    "Falta de combustível",
                    "Uma tempestade espacial",
                    "Um meteoro em rota de colisão",
                    "Sistema de navegação defeituoso"
                ],
                correct: 1
            },
            {
                question: "O que os personagens aprendem com a viagem?",
                options: [
                    "A importância do trabalho em equipe",
                    "O valor da exploração científica",
                    "A diversidade do universo",
                    "Todos os anteriores"
                ],
                correct: 3
            }
        ]
    },
    4: {
        title: "O Tesouro Perdido",
        questions: [
            {
                question: "Quantos irmãos participam da caça ao tesouro?",
                options: [
                    "2 irmãos",
                    "3 irmãos",
                    "4 irmãos",
                    "5 irmãos"
                ],
                correct: 1
            },
            {
                question: "O que o mapa misterioso revela?",
                options: [
                    "A localização de um tesouro pirata",
                    "O caminho para uma cidade perdida",
                    "A entrada para uma caverna secreta",
                    "O esconderijo de um artefato antigo"
                ],
                correct: 0
            },
            {
                question: "Qual é o primeiro desafio que os irmãos enfrentam?",
                options: [
                    "Resolver um enigma",
                    "Cruzar um rio perigoso",
                    "Encontrar uma passagem secreta",
                    "Decifrar um código"
                ],
                correct: 0
            },
            {
                question: "O que os irmãos descobrem sobre o tesouro?",
                options: [
                    "É uma armadilha",
                    "Está protegido por uma maldição",
                    "Não é ouro, mas sim conhecimento",
                    "Já foi roubado"
                ],
                correct: 2
            },
            {
                question: "Qual é a verdadeira recompensa da aventura?",
                options: [
                    "O tesouro em si",
                    "A união da família",
                    "A fama e reconhecimento",
                    "A descoberta de um novo lugar"
                ],
                correct: 1
            }
        ]
    },
    5: {
        title: "O Pequeno Príncipe",
        questions: [
            {
                question: "De que planeta o Pequeno Príncipe vem?",
                options: [
                    "Asteroide B-612",
                    "Planeta Rosa",
                    "Estrela Cadente",
                    "Planeta do Rei"
                ],
                correct: 0
            },
            {
                question: "Qual a coisa mais importante que a raposa ensina ao Pequeno Príncipe?",
                options: [
                    "O valor da amizade",
                    "O que é cativar",
                    "A ver o que é invisível aos olhos",
                    "Todos os anteriores"
                ],
                correct: 3
            },
            {
                question: "O que o Pequeno Príncipe pede ao piloto que desenhe?",
                options: [
                    "Um carneiro",
                    "Uma caixa",
                    "Um elefante dentro de uma jiboia",
                    "Uma rosa"
                ],
                correct: 0
            },
            {
                question: "Por que o Pequeno Príncipe deixa seu planeta?",
                options: [
                    "Para explorar outros mundos",
                    "Por causa de uma discussão com sua rosa",
                    "Para encontrar o piloto",
                    "Para procurar amigos"
                ],
                correct: 1
            },
            {
                question: "Qual a frase mais famosa do livro?",
                options: [
                    "Tu te tornas eternamente responsável por aquilo que cativas",
                    "O essencial é invisível aos olhos",
                    "Só se vê bem com o coração",
                    "Todas as anteriores"
                ],
                correct: 3
            }
        ]
    },
    6: {
        title: "A Menina e o Dragão",
        questions: [
            {
                question: "Como a menina e o dragão se conhecem?",
                options: [
                    "A menina encontra o dragão ferido",
                    "O dragão salva a menina de perigo",
                    "Eles se encontram por acaso na floresta",
                    "A menina procura o dragão intencionalmente"
                ],
                correct: 0
            },
            {
                question: "Por que o dragão é rejeitado pelos outros?",
                options: [
                    "Porque ele é diferente",
                    "Porque ele não cospe fogo",
                    "Porque ele tem medo de altura",
                    "Porque ele prefere a companhia humana"
                ],
                correct: 1
            },
            {
                question: "O que a menina ensina ao dragão?",
                options: [
                    "A voar mais alto",
                    "A confiar em si mesmo",
                    "A cuspir fogo",
                    "A se esconder dos humanos"
                ],
                correct: 1
            },
            {
                question: "Como a comunidade reage à amizade deles?",
                options: [
                    "Com medo e desconfiança",
                    "Com alegria e aceitação",
                    "Com indiferença",
                    "Com curiosidade"
                ],
                correct: 0
            },
            {
                question: "Como a história demonstra o valor da amizade?",
                options: [
                    "Mostrando que as diferenças não importam",
                    "Destacando a importância da lealdade",
                    "Ensinando sobre aceitação e compreensão",
                    "Todos os anteriores"
                ],
                correct: 3
            }
        ]
    }
};

// Variáveis globais
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;

// Elementos do DOM
const quizModal = document.getElementById('quizModal');
const resultModal = document.getElementById('resultModal');
const quizTitle = document.getElementById('quizTitle');
const currentQuestionElement = document.getElementById('currentQuestion');
const totalQuestionsElement = document.getElementById('totalQuestions');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const scoreElement = document.getElementById('score');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');
const finalScoreElement = document.getElementById('finalScore');
const resultMessageElement = document.getElementById('resultMessage');
const restartQuizBtn = document.getElementById('restartQuizBtn');
const backToQuizzesBtn = document.getElementById('backToQuizzesBtn');

// Inicializar a página de quizzes
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar event listeners aos botões de iniciar quiz
    const startButtons = document.querySelectorAll('.start-quiz-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', function() {
            const quizId = this.getAttribute('data-quiz');
            startQuiz(quizId);
        });
    });

    // Configurar botões do modal de resultado
    restartQuizBtn.addEventListener('click', function() {
        resultModal.classList.remove('active');
        startQuiz(currentQuiz);
    });

    backToQuizzesBtn.addEventListener('click', function() {
        resultModal.classList.remove('active');
    });

    // Configurar botão de próxima pergunta
    nextQuestionBtn.addEventListener('click', nextQuestion);
});

// Iniciar um quiz
function startQuiz(quizId) {
    currentQuiz = quizId;
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;

    // Atualizar o modal com as informações do quiz
    quizTitle.textContent = quizzes[quizId].title;
    totalQuestionsElement.textContent = quizzes[quizId].questions.length;
    scoreElement.textContent = score;

    // Mostrar a primeira pergunta
    showQuestion();

    // Abrir o modal
    quizModal.classList.add('active');
}

// Mostrar a pergunta atual
function showQuestion() {
    const quiz = quizzes[currentQuiz];
    const question = quiz.questions[currentQuestionIndex];

    // Atualizar o progresso
    currentQuestionElement.textContent = currentQuestionIndex + 1;

    // Exibir a pergunta
    questionText.textContent = question.question;

    // Limpar opções anteriores
    optionsContainer.innerHTML = '';

    // Adicionar as novas opções
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.setAttribute('data-index', index);
        
        optionElement.addEventListener('click', function() {
            selectOption(this);
        });
        
        optionsContainer.appendChild(optionElement);
    });

    // Resetar o botão de próxima pergunta
    nextQuestionBtn.disabled = true;
    nextQuestionBtn.textContent = 'Próxima Pergunta';
    
    // Se for a última pergunta, mudar o texto do botão
    if (currentQuestionIndex === quiz.questions.length - 1) {
        nextQuestionBtn.textContent = 'Finalizar Quiz';
    }
}

// Selecionar uma opção
function selectOption(optionElement) {
    // Remover seleção anterior
    const previouslySelected = document.querySelector('.option.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Marcar a nova opção como selecionada
    optionElement.classList.add('selected');
    selectedOption = parseInt(optionElement.getAttribute('data-index'));
    
    // Habilitar o botão de próxima pergunta
    nextQuestionBtn.disabled = false;
}

// Avançar para a próxima pergunta ou finalizar o quiz
function nextQuestion() {
    const quiz = quizzes[currentQuiz];
    const question = quiz.questions[currentQuestionIndex];
    
    // Verificar se a resposta está correta
    const isCorrect = selectedOption === question.correct;
    
    if (isCorrect) {
        score += 10;
        scoreElement.textContent = score;
    }
    
    // Marcar visualmente a resposta correta e incorreta
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        const optionIndex = parseInt(option.getAttribute('data-index'));
        
        if (optionIndex === question.correct) {
            option.classList.add('correct');
        } else if (optionIndex === selectedOption && !isCorrect) {
            option.classList.add('incorrect');
        }
        
        // Desabilitar cliques nas opções
        option.style.pointerEvents = 'none';
    });
    
    // Preparar para a próxima pergunta após um breve delay
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quiz.questions.length) {
            showQuestion();
        } else {
            // Quiz finalizado
            finishQuiz();
        }
    }, 1500);
}

// Finalizar o quiz e mostrar resultados
function finishQuiz() {
    const quiz = quizzes[currentQuiz];
    const totalQuestions = quiz.questions.length;
    const maxScore = totalQuestions * 10;
    const percentage = (score / maxScore) * 100;
    
    // Atualizar o modal de resultado
    finalScoreElement.textContent = score;
    
    // Definir mensagem com base no desempenho
    let message = '';
    if (percentage >= 80) {
        message = 'Parabéns! Você é um expert nesta história!';
    } else if (percentage >= 60) {
        message = 'Muito bom! Você conhece bem esta história.';
    } else if (percentage >= 40) {
        message = 'Bom trabalho! Continue lendo para melhorar.';
    } else {
        message = 'Que tal reler a história e tentar novamente?';
    }
    
    resultMessageElement.textContent = message;
    
    // Fechar o modal do quiz e abrir o modal de resultado
    quizModal.classList.remove('active');
    resultModal.classList.add('active');
}