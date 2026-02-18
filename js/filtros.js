function llenarFiltroAnios(grupos) {
    filtroAnio.innerHTML = `<option value="">Año</option>`;

    const anios = [...new Set(
        Object.keys(grupos).map(clave => clave.split("-")[0])
    )].sort((a, b) => b - a);

    anios.forEach((anio) => {
        const option = document.createElement("option");
        option.value = anio;
        option.textContent = anio;
        filtroAnio.appendChild(option);
    });
}
