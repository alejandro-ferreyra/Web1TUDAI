
const API_URL = 'https://68f6aac16b852b1d6f17649a.mockapi.io/Comercio';

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('menu').classList.toggle('active');
        });
    }
    cargarComercios();
});

async function cargarComercios() {
    const contenedor = document.getElementById('contenedor-tarjetas');
    contenedor.innerHTML = '<p style="width:100%; text-align:center;">Cargando comercios...</p>';

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("API Error");
        const datos = await res.json();
        
        contenedor.innerHTML = '';
        if (datos.length === 0) {
            contenedor.innerHTML = '<p style="width:100%; text-align:center;">No hay comercios.</p>';
            return;
        }

        datos.forEach(comercio => {
            const card = document.createElement('div');
            card.className = 'tarjeta';
            
            const imgBase = './assets/img/base.png';
            const imgSrc = (comercio.imagen && comercio.imagen.trim() !== '') ? comercio.imagen : imgBase;

            card.innerHTML = `
                <div class="imagen">
                    <img src="${imgSrc}" alt="${comercio.nombre}" 
                         onerror="this.onerror=null;this.src='${imgBase}';"
                         style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="rating">
                    <span class="valor">5.0</span>
                    <span class="estrellas">★★★★★</span>
                </div>
                <div class="nombre-comercio">${comercio.nombre}</div>
                <button class="btn-ir" onclick="window.location.href='ver-comercio.html?id=${comercio.id}'">
                    Ir al comercio
                </button>
            `;
            contenedor.appendChild(card);
        });
    } catch (error) {
        contenedor.innerHTML = '<p style="text-align:center;">Error al cargar datos.</p>';
    }
}