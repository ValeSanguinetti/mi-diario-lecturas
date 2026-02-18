function obtenerLibros() {
    const libros = localStorage.getItem("libros");
    return libros ? JSON.parse(libros) : [];
}

function guardarLibros(libros) {
    localStorage.setItem("libros", JSON.stringify(libros));
}
