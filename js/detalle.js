const API_URL = 'https://68f6aac16b852b1d6f17649a.mockapi.io/Comercio';
let currentIdComercio = null; // Variable para guardar el ID actual

document.addEventListener('DOMContentLoaded', () => {
    //Obtener ID del comercio de la URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if(id) {
        currentIdComercio = id; 
        cargarDetalle(id);
    }
    
    //Menú Hamburguesa
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const menu = document.getElementById('menu');
            if (menu) menu.classList.toggle('open');
        });
    }

    //Botón Ver Productos
    const btnProductos = document.getElementById('btn-ver-productos');
    if (btnProductos) {
        btnProductos.addEventListener('click', () => {
            if (currentIdComercio) {
                // AHORA USAMOS 'idcomercio' EN LA URL
                window.location.href = `productos.html?idcomercio=${currentIdComercio}`;
            } else {
                alert("Error: No se ha identificado el comercio.");
            }
        });
    }
});

async function cargarDetalle(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if(!res.ok) throw new Error();
        const data = await res.json();

        document.title = data.nombre;
        document.getElementById('nombre-comercio').innerText = data.nombre;

        const imgEl = document.getElementById('img-detalle');
        const imgBase = './assets/img/base.png';
        const imgSrc = (data.imagen && data.imagen.trim() !== '') ? data.imagen : imgBase;
        
        imgEl.src = imgSrc;
        imgEl.style.display = 'block';
        imgEl.onerror = function() { this.src = imgBase; };

        const setText = (elementId, val) => {
            const el = document.getElementById(elementId);
            if(el) el.innerText = val || '-';
        };

        setText('dato-direccion', data.direccion);
        setText('dato-telefono', data.telefono);
        setText('dato-email', data.email);
        setText('dato-horarios', data.horarios);
        setText('dato-instagram', data.instagram);

    } catch (error) {
        console.error(error);
        const titulo = document.getElementById('nombre-comercio');
        if(titulo) titulo.innerText = "Comercio no encontrado";
        
        const tabla = document.querySelector('.comercio-tabla');
        if(tabla) tabla.style.display = 'none';

        const btnProductos = document.getElementById('btn-ver-productos');
        if(btnProductos) btnProductos.style.display = 'none';
    }
}