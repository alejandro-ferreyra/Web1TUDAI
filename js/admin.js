const API_ADMIN = 'https://68f6aac16b852b1d6f17649a.mockapi.io/Comercio';

// Referencias DOM
const form = document.getElementById('form-comercio');
const lista = document.getElementById('lista-comercios');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');
const btnSubmit = document.getElementById('btn-submit');
const idField = document.getElementById('id-comercio');

document.addEventListener('DOMContentLoaded', () => {
    obtenerComerciosAdmin();
    
    if(form) form.addEventListener('submit', guardarComercioHandler);
    if(btnCancelar) btnCancelar.addEventListener('click', limpiarFormularioAdmin);
    
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            document.getElementById('menu').classList.toggle('active');
        });
    }
});

//Obtener Lista
async function obtenerComerciosAdmin() {
    lista.innerHTML = '<p style="text-align:center;">Cargando...</p>';
    try {
        const res = await fetch(API_ADMIN, { cache: 'no-store' });
        if (!res.ok) throw new Error("Error al obtener datos");
        const datos = await res.json();
        renderizarListaAdmin(datos);
    } catch (error) {
        console.error(error);
        lista.innerHTML = '<p style="text-align:center; color:red;">Error de conexión.</p>';
    }
}

function renderizarListaAdmin(datos) {
    lista.innerHTML = '';
    if (datos.length === 0) {
        lista.innerHTML = '<p style="text-align:center;">No hay comercios.</p>';
        return;
    }

    datos.forEach(comercio => {
        const item = document.createElement('div');
        item.classList.add('item-lista');
        
        const imgBase = '../assets/img/base.png';
        const imgSrc = (comercio.imagen && comercio.imagen.trim() !== '') ? comercio.imagen : imgBase;
        const idMostrado = comercio.id ? comercio.id : 'N/A';

        item.innerHTML = `
            <div style="display:flex; align-items:center;">
                <img src="${imgSrc}" style="width:40px; height:40px; object-fit:cover; border-radius:50%; margin-right:10px;" onerror="this.src='${imgBase}'">
                <div>
                    <strong>${comercio.nombre}</strong><br>
                    <small style="color:#aaa;">ID: ${idMostrado}</small>
                </div>
            </div>
            <div class="acciones">
                <button class="btn-editar" type="button" onclick="cargarParaEditar('${comercio.id}')">Editar</button>
                <button class="btn-borrar" type="button" onclick="borrarComercio('${comercio.id}')">Borrar</button>
            </div>
        `;
        lista.appendChild(item);
    });
}

//Guardar (Crear o Editar)
async function guardarComercioHandler(e) {
    if(e) e.preventDefault();
    
    const id = idField.value;
    
    if(!document.getElementById('nombre').value || !document.getElementById('direccion').value) {
        alert("Nombre y Dirección son obligatorios.");
        return;
    }
    
    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        direccion: document.getElementById('direccion').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        horarios: document.getElementById('horarios').value.trim(),
        instagram: document.getElementById('instagram').value.trim(),
        imagen: document.getElementById('imagen').value.trim()
    };

    btnSubmit.disabled = true;
    const textoOriginal = btnSubmit.innerText;
    btnSubmit.innerText = "Procesando...";

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_ADMIN}/${id}` : API_ADMIN;
        
        const res = await fetch(url, { 
            method: method, 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(datos)
        });

        if(res.ok) {
            limpiarFormularioAdmin();
            await obtenerComerciosAdmin();
        } else {
            alert("Error al guardar.");
        }
        
    } catch (error) {
        console.error(error);
        alert("Error de conexión al guardar.");
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerText = textoOriginal;
    }
}

//Cargar para Editar
window.cargarParaEditar = async (id) => {
    try {
        const res = await fetch(`${API_ADMIN}/${id}`);
        const data = await res.json();
        
        idField.value = data.id;
        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('direccion').value = data.direccion || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('horarios').value = data.horarios || '';
        document.getElementById('instagram').value = data.instagram || '';
        document.getElementById('imagen').value = data.imagen || '';

        formTitulo.innerText = "Editar Comercio";
        btnSubmit.innerText = "Actualizar Datos";
        btnCancelar.style.display = "inline-block";
        
        window.scrollTo({top:0, behavior:'smooth'});
    } catch (e) { console.error(e); }
};

//Borrar Comercio Completo - CON CONFIRMACIÓN
window.borrarComercio = async (id) => {
    
    if(!confirm("¿Seguro que deseas eliminar este comercio?")) return;

    try {
        const res = await fetch(`${API_ADMIN}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            lista.innerHTML = '<p style="text-align:center;">Actualizando...</p>';
            await obtenerComerciosAdmin();
        } else { 
            alert("Error al eliminar (API)."); 
        }
    } catch (error) { 
        console.error(error);
        alert("Error de conexión al eliminar."); 
    }
};

function limpiarFormularioAdmin() {
    form.reset();
    idField.value = '';
    formTitulo.innerText = "Nuevo Comercio";
    btnSubmit.innerText = "Guardar Comercio";
    btnCancelar.style.display = "none";
}