// Criar bolinhas flutuantes reativas
function createFloatingShapes() {
  const background = document.querySelector(".background");
  const shapes = [];

  // Limpar shapes existentes
  const existingShapes = background.querySelectorAll(".floating-shape");
  existingShapes.forEach((shape) => shape.remove());

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
      shape.style.left = Math.random() * window.innerWidth + "px";
      shape.style.top = Math.random() * window.innerHeight + "px";
      shape.style.animationDelay = Math.random() * 8 + "s";
      shape.style.animation = `float ${
        8 + Math.random() * 4
      }s ease-in-out infinite`;

      background.appendChild(shape);
      shapes.push(shape);
    }
  });

  return shapes;
}

// Adicionar interatividade com mouse
function addMouseInteractivity(shapes) {
  function handleMouseMove(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    shapes.forEach((shape) => {
      const rect = shape.getBoundingClientRect();
      const shapeX = rect.left + rect.width / 2;
      const shapeY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(mouseX - shapeX, 2) + Math.pow(mouseY - shapeY, 2)
      );

      if (distance < 150) {
        const force = (150 - distance) / 150;
        const angle = Math.atan2(shapeY - mouseY, shapeX - mouseX);
        const moveX = Math.cos(angle) * force * 20;
        const moveY = Math.sin(angle) * force * 20;

        shape.style.transform = `translate(${moveX}px, ${moveY}px) scale(${
          1 + force * 0.3
        })`;
        shape.style.opacity = 0.8 + force * 0.2;
      } else {
        shape.style.transform = "translate(0px, 0px) scale(1)";
        shape.style.opacity = 0.6;
      }
    });
  }

  document.addEventListener("mousemove", handleMouseMove);
  return handleMouseMove;
}

// Adicionar efeito de clique
function addClickEffects(shapes) {
  shapes.forEach((shape) => {
    shape.addEventListener("click", () => {
      shape.style.transform = "scale(1.5)";
      shape.style.opacity = "1";

      setTimeout(() => {
        shape.style.transform = "scale(1)";
        shape.style.opacity = "0.6";
      }, 300);
    });
  });
}

// Função de validação de formulário
function validateForm() {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  let isValid = true;

  // Limpar mensagens de erro anteriores
  emailError.textContent = "";
  passwordError.textContent = "";

  // Validar email
  if (!email.value) {
    emailError.textContent = "Email é obrigatório";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.textContent = "Email inválido";
    isValid = false;
  }

  // Validar senha
  if (!password.value) {
    passwordError.textContent = "Senha é obrigatória";
    isValid = false;
  } else if (password.value.length < 6) {
    passwordError.textContent = "Senha deve ter pelo menos 6 caracteres";
    isValid = false;
  }

  return isValid;
}

// Função de transição completa
function startTransition() {
  const loginContainer = document.getElementById("loginContainer");
  const transitionScreen = document.getElementById("transitionScreen");
  const loginButton = document.getElementById("loginButton");
  const btnText = loginButton.querySelector(".btn-text");
  const btnSpinner = loginButton.querySelector(".btn-spinner");
  const progressFill = document.querySelector(".progress-fill");

  // Mostrar animação de carregamento no botão
  btnText.style.display = "none";
  btnSpinner.style.display = "flex";
  loginButton.disabled = true;

  // Esconder o container de login
  loginContainer.style.opacity = "0";

  // Mostrar a tela de transição após um pequeno atraso
  setTimeout(() => {
    transitionScreen.style.display = "flex";

    // Iniciar animação da barra de progresso
    progressFill.style.animation = "loading 3s ease-in-out forwards";

    // Redirecionar para a tela principal após o carregamento
    setTimeout(() => {
      window.location.href = "../TelaInicial/index.html";
    }, 3000);
  }, 800);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Criar e configurar formas flutuantes
  const shapes = createFloatingShapes();
  addMouseInteractivity(shapes);
  addClickEffects(shapes);

  // Adicionar evento de submit ao formulário
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      startTransition();
    }
  });

  // Adicionar validação em tempo real
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  emailInput.addEventListener("input", function () {
    if (this.value) {
      document.getElementById("email-error").textContent = "";
    }
  });

  passwordInput.addEventListener("input", function () {
    if (this.value) {
      document.getElementById("password-error").textContent = "";
    }
  });

  // Adicionar foco personalizado aos inputs
  const inputFields = document.querySelectorAll(".input-field");
  inputFields.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });

  // Redimensionar formas flutuantes quando a janela for redimensionada
  window.addEventListener("resize", function () {
    createFloatingShapes();
  });
});
