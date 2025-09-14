// Validações específicas para o formulário de cadastro

function validateSignupForm() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const terms = document.getElementById("terms");

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const confirmPasswordError = document.getElementById(
    "confirm-password-error"
  );

  let isValid = true;

  // Limpar mensagens de erro anteriores
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  // Validar nome
  if (!name.value) {
    nameError.textContent = "Nome é obrigatório";
    isValid = false;
  } else if (name.value.length < 3) {
    nameError.textContent = "Nome deve ter pelo menos 3 caracteres";
    isValid = false;
  }

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

  // Validar confirmação de senha
  if (!confirmPassword.value) {
    confirmPasswordError.textContent = "Confirmação de senha é obrigatória";
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.textContent = "As senhas não coincidem";
    isValid = false;
  }

  // Validar termos
  if (!terms.checked) {
    alert("Você deve aceitar os termos e condições para se cadastrar");
    isValid = false;
  }

  return isValid;
}

// Função de transição para cadastro (igual à da tela de login)
function startTransition() {
  const signupContainer = document.getElementById("signupContainer");
  const transitionScreen = document.getElementById("transitionScreen");
  const signupButton = document.getElementById("signupButton");
  const btnText = signupButton.querySelector(".btn-text");
  const btnSpinner = signupButton.querySelector(".btn-spinner");
  const progressFill = document.querySelector(".progress-fill");

  // Mostrar animação de carregamento no botão
  btnText.style.display = "none";
  btnSpinner.style.display = "flex";
  signupButton.disabled = true;

  // Esconder o container de cadastro
  signupContainer.style.opacity = "0";

  // Mostrar a tela de transição após um pequeno atraso
  setTimeout(() => {
    transitionScreen.style.display = "flex";

    // Inicializar o gerenciador de loading
    if (typeof LoadingManager !== "undefined") {
      const loadingManager = new LoadingManager();
      loadingManager.init();
    }

    // Iniciar animação da barra de progresso
    progressFill.style.animation = "loading 3s ease-in-out forwards";

    // Redirecionar para a tela de login após o carregamento COMPLETO
    // (igual ao tempo da animação da barra de progresso)
    setTimeout(() => {
      // Adicionar uma pequena animação de fade out na tela de transição
      transitionScreen.style.opacity = "0";
      transitionScreen.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 500);
    }, 3000); // Tempo total da animação da barra de progresso
  }, 800);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Criar e configurar formas flutuantes (usando a função do script principal)
  if (typeof createFloatingShapes === "function") {
    const shapes = createFloatingShapes();

    // Adicionar interatividade se as funções existirem
    if (typeof addMouseInteractivity === "function") {
      addMouseInteractivity(shapes);
    }

    if (typeof addClickEffects === "function") {
      addClickEffects(shapes);
    }
  }

  // Adicionar evento de submit ao formulário
  const signupForm = document.getElementById("signupForm");
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateSignupForm()) {
      startTransition();
    }
  });

  // Adicionar validação em tempo real
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  nameInput.addEventListener("input", function () {
    if (this.value) {
      document.getElementById("name-error").textContent = "";
    }
  });

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

  confirmPasswordInput.addEventListener("input", function () {
    if (this.value) {
      document.getElementById("confirm-password-error").textContent = "";
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
});
