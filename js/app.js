btnAgregarLibro.addEventListener("click", () => {
    formLibro.classList.toggle("activo");
});

formLibro.addEventListener("submit", (e) => {
    e.preventDefault();
    guardarLibro();
});

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-eliminar")) {
        eliminarLibro(e.target.dataset.index);
    }
    if (e.target.classList.contains("btn-editar")) {
        cargarLibroParaEditar(e.target.dataset.index);
    }
});

notasInput.addEventListener("input", () => {
    notasInput.style.height = "auto";
    notasInput.style.height = notasInput.scrollHeight + "px";
});
filtroAnio.addEventListener("change", () => {
    const anioSeleccionado = filtroAnio.value;

    filtroMes.innerHTML = `<option value="">Mes</option>`;
    filtroMes.disabled = true;

    if (!anioSeleccionado) {
        // volver al estado normal
        renderizarLibros();
        return;
    }

    const grupos = obtenerGruposTerminados(); // la creamos abajo

    const mesesDelAnio = Object.keys(grupos)
        .filter(clave => clave.startsWith(anioSeleccionado))
        .sort((a, b) => b.localeCompare(a));

    mesesDelAnio.forEach((clave) => {
        const option = document.createElement("option");
        option.value = clave;
        option.textContent = grupos[clave].label.split(" ")[0]; // mes
        filtroMes.appendChild(option);
    });

    filtroMes.disabled = false;
});
filtroMes.addEventListener("change", () => {
    const clave = filtroMes.value;

    if (!clave) {
        renderizarLibros();
        return;
    }

    renderMesEspecifico(clave);
});
const gruposIniciales = obtenerGruposTerminados();
function actualizarIconoModo() {
  if (document.body.classList.contains("dark")) {
    btnDark.textContent = "☀️"; 
  } else {
    btnDark.textContent = "🌙"; 
  }
}

const btnDark = document.getElementById("toggleDark");
btnDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const modoOscuro = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", modoOscuro);

  actualizarIconoModo(); 
});

// cargar preferencia al iniciar
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

const btnScrollTop = document.getElementById("btnScrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    btnScrollTop.classList.add("visible");
  } else {
    btnScrollTop.classList.remove("visible");
  }
});

btnScrollTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
listaNotasLectura.addEventListener("click", (e) => {
  const libros = obtenerLibros();
  const libro = libros[libroActivoIndex];

  // 🗑 ELIMINAR
  if (e.target.classList.contains("eliminar-nota")) {
    const i = e.target.dataset.index;
    libro.notasLectura.splice(i, 1);
    guardarLibros(libros);
    abrirModalLibro(libro, libroActivoIndex);
  }
});

document.getElementById("btnPendientes").addEventListener("click", renderPendientes);
document.getElementById("btnFavoritos").addEventListener("click", renderFavoritos);

document.getElementById("buscadorLibros").addEventListener("input", filtrarLibros);
function filtrarLibros(e) {
    const texto = e.target.value.toLowerCase().trim();
    const libros = obtenerLibros();

    // 🟣 si está vacío → restaurar vista normal
    if (texto === "") {
        renderLecturaActual();
        renderizarUltimosDosMeses();
        return;
    }

      const filtrados = obtenerLibros()
        .map((libro, index) => ({ ...libro, index })) // 👈 CLAVE
        .filter(libro =>
            libro.titulo.toLowerCase().includes(texto) ||
            libro.autor.toLowerCase().includes(texto) ||
            libro.genero.toLowerCase().includes(texto) ||
            (libro.notas && libro.notas.toLowerCase().includes(texto))
        );

    renderLibrosFiltrados(filtrados);
}

actualizarIconoModo(); 
llenarFiltroAnios(gruposIniciales);
renderLecturaActual();
renderizarUltimosDosMeses();
renderEstadisticas();