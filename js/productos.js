const API_URL_PRODUCTOS = 'https://68f6aac16b852b1d6f17649a.mockapi.io/Productos';
const API_URL_COMERCIO = 'https://68f6aac16b852b1d6f17649a.mockapi.io/Comercio';

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let idComercio = null; 

// Referencias del DOM
const form = document.getElementById('form-productos');
const tablaBody = document.getElementById('tabla-body');
const btnSubmit = document.getElementById('btn-submit');
const btnCancelar = document.getElementById('btn-cancelar');
const formTitulo = document.getElementById('form-titulo');

// Inputs
const inputId = document.getElementById('id-producto');
const inputNombre = document.getElementById('nombre');
const inputMarca = document.getElementById('marca');
const inputPrecio = document.getElementById('precio');

// Paginación DOM
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageInfo = document.getElementById('page-info');

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    idComercio = params.get('idcomercio');

    if (!idComercio) {
        alert("No se ha especificado un comercio. Se mostrarán todos los productos.");
    } else {
        cargarNombreComercio(idComercio);
    }

    fetchProductos();
});

// --- CARGAR NOMBRE COMERCIO ---
async function cargarNombreComercio(id) {
    try {
        const response = await fetch(`${API_URL_COMERCIO}/${id}`);
        if (response.ok) {
            const data = await response.json();
            document.querySelector('header h1').innerText = `Productos de ${data.nombre}`;
            document.title = `Productos - ${data.nombre}`;
        }
    } catch (error) {
        console.error("No se pudo cargar el nombre del comercio", error);
    }
}

// --- FUNCIONES API---

//OBTENER (GET)
async function fetchProductos() {
    tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Cargando...</td></tr>';
    
    const url = new URL(API_URL_PRODUCTOS);
    url.searchParams.append('page', currentPage);
    url.searchParams.append('limit', ITEMS_PER_PAGE);
    
    if (idComercio) {
        url.searchParams.append('idcomercio', idComercio);
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la petición");
        
        const productos = await response.json();
        
        if (typeof productos === 'string') {
             renderTabla([]);
             actualizarBotonesPaginacion(0);
        } else {
            renderTabla(productos);
            actualizarBotonesPaginacion(productos.length);
        }
        
    } catch (error) {
        console.error(error);
        tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No hay productos registrados.</td></tr>';
    }
}

//GUARDAR (POST / PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!idComercio) {
        alert("Error: No se puede crear un producto sin un comercio asignado.");
        return;
    }

    const id = inputId.value;
    const datosProducto = {
        nombre: inputNombre.value,
        marca: inputMarca.value,
        precio: inputPrecio.value,
        idcomercio: idComercio 
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL_PRODUCTOS}/${id}` : API_URL_PRODUCTOS;

    try {
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Procesando...";

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosProducto)
        });

        if (response.ok) {
            resetForm();      // Limpia formulario
            fetchProductos(); // Recarga tabla
        } else {
            alert('Error al guardar');
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = id ? "Guardar Cambios" : "Guardar Producto";
    }
});

//ELIMINAR (DELETE) - 
async function eliminarProducto(id) {
 
    
    try {
        const response = await fetch(`${API_URL_PRODUCTOS}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchProductos(); // Recarga tabla
        } else {
            alert("No se pudo eliminar"); // Solo muestra mensaje si falla
        }
    } catch (error) {
        console.error(error);
    }
}

// --- RENDERIZADO Y UI TABLA ---

function renderTabla(productos) {
    tablaBody.innerHTML = '';

    if (!productos || productos.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Sin resultados.</td></tr>';
        return;
    }

    productos.forEach(prod => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${prod.nombre}</td>
            <td>${prod.marca}</td>
            <td>$${prod.precio}</td>
            <td style="text-align: center;">
                <div class="acciones">
                    <button class="btn-editar" data-id="${prod.id}" data-nombre="${prod.nombre}" data-marca="${prod.marca}" data-precio="${prod.precio}">Editar</button>
                    <button class="btn-borrar" data-id="${prod.id}">Eliminar</button>
                </div>
            </td>
        `;
        tablaBody.appendChild(row);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => cargarDatosEdicion(e.target.dataset));
    });

    document.querySelectorAll('.btn-borrar').forEach(btn => {
        btn.addEventListener('click', (e) => eliminarProducto(e.target.dataset.id));
    });
}

function cargarDatosEdicion(dataset) {
    inputId.value = dataset.id;
    inputNombre.value = dataset.nombre;
    inputMarca.value = dataset.marca;
    inputPrecio.value = dataset.precio;

    formTitulo.textContent = "Editar Producto";
    btnSubmit.textContent = "Actualizar";
    btnCancelar.style.display = "inline-block";

    document.querySelector('.admin-container').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    form.reset();
    inputId.value = '';
    formTitulo.textContent = "Nuevo Producto";
    btnSubmit.textContent = "Guardar Producto";
    btnCancelar.style.display = "none";
}

btnCancelar.addEventListener('click', resetForm);

// --- PAGINACIÓN ---

function actualizarBotonesPaginacion(cantidadItems) {
    pageInfo.textContent = `Página ${currentPage}`;
    btnPrev.disabled = (currentPage === 1);
    btnNext.disabled = (cantidadItems < ITEMS_PER_PAGE);
}

btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchProductos();
    }
});

btnNext.addEventListener('click', () => {
    currentPage++;
    fetchProductos();
});