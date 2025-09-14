// loading.js - Gerenciamento dos loaders

class LoadingManager {
  constructor() {
    this.currentStage = 0;
    this.stages = document.querySelectorAll(".loader-stage");
    this.progressFill = document.querySelector(".progress-fill");
    this.totalStages = this.stages.length;
    this.stageDuration = 3000 / this.totalStages; // Dividir 3 segundos entre os estágios
  }

  init() {
    // Iniciar com o primeiro estágio
    this.showStage(0);

    // Iniciar a transição automática entre os loaders
    this.startAutoTransition();

    // Iniciar a barra de progresso
    this.startProgressBar();
  }

  showStage(index) {
    // Esconder todos os estágios
    this.stages.forEach((stage) => {
      stage.classList.remove("active", "fade-in");
      stage.classList.add("fade-out");
    });

    // Mostrar o estágio atual após um pequeno delay
    setTimeout(() => {
      this.stages.forEach((stage) => (stage.style.display = "none"));
      this.stages[index].style.display = "block";

      setTimeout(() => {
        this.stages[index].classList.remove("fade-out");
        this.stages[index].classList.add("active", "fade-in");
      }, 50);
    }, 500);
  }

  startAutoTransition() {
    let stageIndex = 0;

    this.transitionInterval = setInterval(() => {
      stageIndex = (stageIndex + 1) % this.totalStages;
      this.showStage(stageIndex);
    }, this.stageDuration);
  }

  startProgressBar() {
    this.progressFill.style.animation = "loading 3s ease-in-out forwards";
  }

  cleanup() {
    // Limpar intervalos quando não forem mais necessários
    if (this.transitionInterval) {
      clearInterval(this.transitionInterval);
    }
  }
}

// Inicializar quando a tela de transição for exibida
document.addEventListener("DOMContentLoaded", function () {
  // Verificar se estamos na tela de transição
  const transitionScreen = document.getElementById("transitionScreen");

  if (transitionScreen && transitionScreen.style.display === "flex") {
    const loadingManager = new LoadingManager();
    loadingManager.init();

    // Limpar ao sair da página
    window.addEventListener("beforeunload", () => {
      loadingManager.cleanup();
    });
  }
});
