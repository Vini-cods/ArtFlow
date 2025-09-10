// Interatividade da sidebar
const sidebarIcons = document.querySelectorAll(".sidebar-icon");
sidebarIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
        sidebarIcons.forEach((i) => i.classList.remove("active"));
        icon.classList.add("active");
    });
});

// Navegação entre abas
const tabs = document.querySelectorAll(".tab");
const tabPanes = document.querySelectorAll(".tab-pane");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        // Remover classe ativa de todas as abas
        tabs.forEach((t) => t.classList.remove("active"));
        tabPanes.forEach((pane) => pane.classList.remove("active"));

        // Adicionar classe ativa à aba clicada
        tab.classList.add("active");

        // Mostrar o conteúdo correspondente
        const tabId = tab.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// Filtros de favoritos
const filterTabs = document.querySelectorAll(".filter-tab");
const favoriteItems = document.querySelectorAll(".favorite-item");

filterTabs.forEach((filter) => {
    filter.addEventListener("click", () => {
        filterTabs.forEach((f) => f.classList.remove("active"));
        filter.classList.add("active");

        const filterType = filter.getAttribute("data-filter");

        favoriteItems.forEach((item) => {
            if (filterType === "all" || item.getAttribute("data-type") === filterType) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

// Botão de seguir/deixar de seguir
const unfollowButtons = document.querySelectorAll(".unfollow-btn");
unfollowButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
        e.stopPropagation();
        if (this.textContent === "Seguindo") {
            this.textContent = "Seguir";
            this.style.background = "transparent";
            this.style.borderColor = "rgba(255, 215, 0, 0.5)";
        } else {
            this.textContent = "Seguindo";
            this.style.background = "rgba(255, 215, 0, 0.2)";
        }
    });
});

// Botões de favorito
const favoriteButtons = document.querySelectorAll(".favorite-btn");
favoriteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
        e.stopPropagation();
        const icon = this.querySelector("i");

        if (this.classList.contains("active")) {
            this.classList.remove("active");
            this.style.background = "rgba(255, 255, 255, 0.2)";
            showNotification("Removido dos favoritos");
        } else {
            this.classList.add("active");
            this.style.background = "#ff4757";
            showNotification("Adicionado aos favoritos");
        }
    });
});

// Função para mostrar notificações
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;

    // Estilos para a notificação
    notification.style.position = "fixed";
    notification.style.top = "20px";
    notification.style.right = "20px";
    notification.style.background = "rgba(45, 21, 84, 0.9)";
    notification.style.color = "white";
    notification.style.padding = "15px 20px";
    notification.style.borderRadius = "10px";
    notification.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
    notification.style.zIndex = "1000";
    notification.style.backdropFilter = "blur(10px)";
    notification.style.border = "1px solid rgba(255, 215, 0, 0.3)";
    notification.style.transform = "translateX(100px)";
    notification.style.opacity = "0";
    notification.style.transition = "all 0.3s ease";

    // Adicionar ao corpo do documento
    document.body.appendChild(notification);

    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
        notification.style.opacity = "1";
    }, 10);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.style.transform = "translateX(100px)";
        notification.style.opacity = "0";

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Criar bolinhas flutuantes interativas
function createFloatingShapes() {
    const container = document.querySelector(".floating-shapes");
    container.innerHTML = "";

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

// Inicializar quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
    createFloatingShapes();

    // Adicionar evento ao botão de editar perfil
    const editProfileBtn = document.querySelector(".edit-profile-btn");
    if (editProfileBtn) {
        editProfileBtn.addEventListener("click", function () {
            showNotification("Modo de edição de perfil ativado");
            // Aqui você implementaria a lógica de edição de perfil
        });
    }

    // Adicionar evento ao botão de continuar leitura
    const continueReadingBtn = document.querySelector(".continue-reading-btn");
    if (continueReadingBtn) {
        continueReadingBtn.addEventListener("click", function () {
            showNotification("Continuando a leitura...");
            // Redirecionar para a página de leitura
            window.location.href = "../../Telainicial/aventura-na-floresta/aventura.html";
        });
    }
});