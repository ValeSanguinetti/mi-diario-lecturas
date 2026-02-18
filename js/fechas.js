function parseFechaLocal(fechaStr) {
    const [anio, mes, dia] = fechaStr.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
}

function obtenerMesYAnio(libro) {
    const fechaBase =
        libro.fin && libro.fin.trim() !== ""
            ? libro.fin
            : libro.inicio;

    const date = parseFechaLocal(fechaBase);
    if (isNaN(date)) return null;

    const mesTexto = date.toLocaleString("es-ES", { month: "long" });
    const anio = date.getFullYear();
    const mesNumero = String(date.getMonth() + 1).padStart(2, "0");

    return {
        clave: `${anio}-${mesNumero}`,
        label: `${mesTexto} ${anio}`
    };
}


function formatearMesAnio(clave) {
    const [anio, mes] = clave.split("-");
    const fecha = new Date(anio, mes - 1);

    const mesTexto = fecha.toLocaleString("es-ES", { month: "long" });

    return `${mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1)} ${anio}`;
}
