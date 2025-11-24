"use strict";
// En móviles:

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("Formulario");
  const campos = ["nombre", "email", "mensaje"];
  const captchaContainer = document.getElementById("captchaContainer");
  const captchaTexto = document.getElementById("captchaTexto");
  const captchaInput = document.getElementById("captchaInput");
  const captchaResultado = document.getElementById("captchaResultado");
  const btnValidarCaptcha = document.getElementById("btnValidarCaptcha");
  const btnGenerarCaptcha = document.getElementById("btnGenerarCaptcha");
  const btnEnviar = document.getElementById("btnEnviar");



  
  let captchaActual = "";

  // Generar captcha aleatorio
  function generarCaptcha() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    captchaActual = Array.from({ length: 6 }, () =>
      caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    ).join("");
    captchaTexto.textContent = captchaActual;
    captchaInput.value = "";
  }

  // Mostrar captcha cuando todos los campos estén completos
  campos.forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      const todosCompletos = campos.every(id => document.getElementById(id).value.trim() !== "");
      if (todosCompletos && captchaContainer.classList.contains("hidden")) {
        captchaContainer.classList.remove("hidden");
        generarCaptcha();
      }
    });
  });

  // Validar captcha
  btnValidarCaptcha.addEventListener("click", () => {
    const ingreso = captchaInput.value.trim();

    if (ingreso === "") {
      captchaResultado.textContent = "⚠️ Ingrese el texto del captcha.";
      captchaResultado.className = "error";
      btnEnviar.disabled = true;
      return;
    }

    if (ingreso === captchaActual) {
      captchaResultado.textContent = "✅ Captcha válido. Puede enviar el formulario.";
      captchaResultado.className = "ok";
      btnEnviar.disabled = false;
    } else {
      captchaResultado.textContent = "❌ Captcha incorrecto. Se generará uno nuevo.";
      captchaResultado.className = "error";
      btnEnviar.disabled = true;

      // Espera 3 segundo antes de generar el captcha nuevo para que el usuario vea el mensaje de error
      setTimeout(() => {
        generarCaptcha();
        captchaResultado.textContent = ""; // limpia mensaje tras regenerar
      }, 3000);
    }
  });

  // Generar otro captcha manualmente
  btnGenerarCaptcha.addEventListener("click", () => {
    generarCaptcha();
    captchaResultado.textContent = "";
  });

  // Evitar envío sin captcha válido
  formulario.addEventListener("submit", (e) => {
    if (btnEnviar.disabled) {
      e.preventDefault();
      captchaResultado.textContent = "⚠️ Debe validar el captcha antes de enviar.";
      captchaResultado.className = "error";
    }
  });
});


let form = document.querySelector('#Formulario');
form.addEventListener('submit', agregar);

function agregar(e) {
   e.preventDefault();

   alert('Formulario completado con exito.');
   form.reset();
}