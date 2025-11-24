"use strict";
// En móviles: redirigir con botones

document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".btn-ir");

  botones.forEach((boton) => {
    boton.addEventListener("click", () => {
      const destino = boton.getAttribute("data-url");
      if (destino) window.location.href = destino;
    });
  });
});



// navbar
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  toggleButton.addEventListener("click", () => {
    menu.classList.toggle("open");

    // Cambiar ícono entre ☰ y <
  toggleButton.textContent = menu.classList.contains("open") ? "⬅" : "☰";
  });

  // Cierra el menú al hacer clic en un enlace
  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggleButton.textContent = "☰";
    });
  });
});





