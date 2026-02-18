function guardarLibro() {
    const libros = obtenerLibros();

    const libro = {
        id: indiceEditando !== null ? libros[indiceEditando].id : Date.now(),
        titulo: tituloInput.value,
        autor: autorInput.value,
        genero: GeneroInput.value,
        inicio: fechaInicioInput.value,
        fin: fechaFinInput.value,
        notas: notasInput.value,
         favorito: indiceEditando !== null
    ? libros[indiceEditando].favorito || false
    : false,
        notasLectura: indiceEditando !== null
            ? libros[indiceEditando].notasLectura || []
            : []   // 👈 nuevo libro inicia vacío
    };

    if (indiceEditando !== null) {
         libro.id = libros[indiceEditando].id;
        libros[indiceEditando] = libro;
        indiceEditando = null;
    } else {
        libros.push(libro);
    }

    guardarLibros(libros);
    formLibro.reset();
    formLibro.classList.remove("activo");
    document.getElementById("btnGuardar").textContent = "Guardar";
   
  cerrarModalForm();
    renderEstadisticas();
 renderLecturaActual();
    renderizarUltimosDosMeses();

    
}

function eliminarLibro(index) {
    const libros = obtenerLibros();
    libros.splice(index, 1);
    guardarLibros(libros);
    renderEstadisticas();
     renderLecturaActual();
    renderizarUltimosDosMeses();
    
}

function cargarLibroParaEditar(index) {
    const libros = obtenerLibros();
    const libro = libros[index];

    tituloInput.value = libro.titulo;
    autorInput.value= libro.autor;
    GeneroInput.value= libro.genero;
    fechaInicioInput.value = libro.inicio;
    fechaFinInput.value = libro.fin;
    notasInput.value = libro.notas;

    indiceEditando = index;
    document.getElementById("btnGuardar").textContent = "Actualizar";
    formLibro.classList.add("activo");

    abrirModalForm();
}

function obtenerGruposTerminados() {
    const libros = obtenerLibros();

    const librosTerminados = libros
        .map((libro, index) => ({ ...libro, index }))
        .filter(libro => libro.fin && libro.fin.trim() !== "");

    const grupos = {};

    librosTerminados.forEach((libro) => {
        const resultado = obtenerMesYAnio(libro);
        if (!resultado) return;

        const { clave, label } = resultado;

        if (!grupos[clave]) {
            grupos[clave] = { label, libros: [] };
        }

        grupos[clave].libros.push(libro);
    });

    return grupos;
}

function agregarNotaALibro(index, textoNota) {
    const libros = obtenerLibros();

    if (!libros[index].notasLectura) {
        libros[index].notasLectura = [];
    }

    libros[index].notasLectura.push(textoNota);

    guardarLibros(libros);
}

function obtenerPendientes() {
    const libros = obtenerLibros();

    return libros
        .map((libro, index) => ({ ...libro, index }))
        .filter(libro =>
            (!libro.inicio || libro.inicio.trim() === "") &&
            (!libro.fin || libro.fin.trim() === "")
        );
}
function obtenerLeyendo() {
    const libros = obtenerLibros();

    return libros
        .map((libro, index) => ({ ...libro, index }))
        .filter(libro =>
            libro.inicio && libro.inicio.trim() !== "" &&
            (!libro.fin || libro.fin.trim() === "")
        );
}
