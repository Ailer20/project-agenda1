document.addEventListener("DOMContentLoaded", function () {
    const loginContainer = document.querySelector(".right-side");
    const loginButton = document.querySelector(".login-button");
    const floatingShapes = document.querySelectorAll(".floating-shape");

    // Animação de entrada
    loginContainer.style.opacity = "0";
    loginContainer.style.transform = "translateX(50px)";
    setTimeout(() => {
        loginContainer.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        loginContainer.style.opacity = "1";
        loginContainer.style.transform = "translateX(0)";
    }, 300);

    // Efeito no botão ao passar o mouse
    loginButton.addEventListener("mouseenter", function () {
        this.style.transform = "scale(1.05)";
        this.style.transition = "transform 0.2s ease-in-out";
    });

    loginButton.addEventListener("mouseleave", function () {
        this.style.transform = "scale(1)";
    });

    // Movimentação dos elementos decorativos (se houver)
    floatingShapes.forEach((shape) => {
        let randomX = Math.random() * 20 - 10;
        let randomY = Math.random() * 20 - 10;
        shape.style.transform = `translate(${randomX}px, ${randomY}px)`;
        shape.style.transition = "transform 3s ease-in-out infinite alternate";
    });
});
