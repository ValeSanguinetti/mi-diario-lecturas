function calcularEstadisticas() {
    const libros = obtenerLibros();

    const terminados = libros.filter(
        (libro) => libro.fin && libro.fin.trim() !== ""
    );

    const totalLeidos = terminados.length;

    // 📅 Libros leídos este año
    const anioActual = new Date().getFullYear();

    const leidosEsteAnio = terminados.filter((libro) => {
        const anioFin = new Date(libro.fin).getFullYear();
        return anioFin === anioActual;
    }).length;

    // 📆 Mes con más lecturas
    const lecturasPorMes = {};

    terminados.forEach((libro) => {
        const fecha = new Date(libro.fin);
        const clave = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;

        lecturasPorMes[clave] = (lecturasPorMes[clave] || 0) + 1;
    });

    let mesTop = "Ninguno";
    let maxLecturas = 0;

    Object.entries(lecturasPorMes).forEach(([mes, cantidad]) => {
        if (cantidad > maxLecturas) {
            maxLecturas = cantidad;
            mesTop = mes;
        }
    });

    // 🏷️ Género más leído
    const generos = {};

    terminados.forEach((libro) => {
        if (!libro.genero) return;
        generos[libro.genero] = (generos[libro.genero] || 0) + 1;
    });

    let generoTop = "Sin datos";
    let maxGenero = 0;

    Object.entries(generos).forEach(([genero, cantidad]) => {
        if (cantidad > maxGenero) {
            maxGenero = cantidad;
            generoTop = genero;
        }
    });

    return {
        totalLeidos,
        leidosEsteAnio,
        mesTop,
        generoTop,
    };
}
