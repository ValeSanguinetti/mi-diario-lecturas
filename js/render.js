// ===================== RENDERIZADO =====================

function renderizarUltimosDosMeses() {
  listaLecturas.innerHTML = "";

  const libros = obtenerLibros();

  const librosTerminados = libros
    .map((libro, index) => ({ ...libro, index }))
    .filter((libro) => libro.fin && libro.fin.trim() !== "");

  if (librosTerminados.length === 0) {
    listaLecturas.innerHTML = "<p>📚 Todavía no registraste lecturas</p>";
    return;
  }

  // 1️⃣ Agrupar por mes
  const grupos = {};
  librosTerminados.forEach((libro) => {
    const resultado = obtenerMesYAnio(libro);
    if (!resultado) return;

    const { clave, label } = resultado;
    if (!grupos[clave]) grupos[clave] = { label, libros: [] };
    grupos[clave].libros.push(libro);
  });

  // 2️⃣ Ordenar meses (más recientes primero)
  const mesesOrdenados = Object.keys(grupos).sort((a, b) => b.localeCompare(a));

  // 3️⃣ Tomar SOLO los últimos 2 meses
  const ultimosDosMeses = mesesOrdenados.slice(0, 2);

  // 4️⃣ Renderizar
  ultimosDosMeses.forEach((clave) => {
    const bloqueMes = document.createElement("div");
    bloqueMes.classList.add("bloque-mes");

    bloqueMes.innerHTML = `<h2>📅 ${grupos[clave].label}</h2>`;

    grupos[clave].libros.forEach((libro) => {
      const libroDiv = document.createElement("div");
      libroDiv.classList.add("libro");
      libroDiv.dataset.id = libro.id; // ✅ Agregado data-id
      libroDiv.dataset.index = libro.index;

      libroDiv.addEventListener("click", (e) => {
        if (e.target.closest(".acciones")) return;
        abrirModalLibro(libro, libro.index);
      });

      libroDiv.innerHTML = `
        <div class="libro-header">
          <h3>📖 ${libro.titulo}</h3>
          <div class="acciones">
            <button class="favorito-libro" data-id="${libro.id}">
              ${libro.favorito ? "⭐" : "☆"}
            </button>
            <button class="btn-editar" data-index="${libro.index}">✏️</button>
            <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
          </div>
        </div>
        <p>✍️ ${libro.autor}</p>
        <p>🏷️ ${libro.genero}</p>
        <p>🗓 ${libro.inicio} → ${libro.fin}</p>
        <p>📝 ${libro.notas || "Sin notas"}</p>
      `;

      bloqueMes.appendChild(libroDiv);
    });

    listaLecturas.appendChild(bloqueMes);
  });
}

function renderLecturaActual() {
  const contenedor = document.getElementById("lecturaActual");
  const libros = obtenerLibros();
  contenedor.innerHTML = "";

  const lecturasActuales = libros
    .map((libro, index) => ({ ...libro, index }))
    .filter(
      (libro) =>
        libro.inicio && libro.inicio.trim() !== "" &&
        (!libro.fin || libro.fin.trim() === "")
    );

  if (lecturasActuales.length === 0) {
    contenedor.innerHTML = `<div class="lectura-actual vacio">📖 No tenés lecturas en curso</div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  lecturasActuales.forEach((libro) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-actual");
    tarjeta.dataset.id = libro.id; // ✅ data-id
    tarjeta.dataset.index = libro.index;

    tarjeta.innerHTML = `
      <div class="tarjeta-header">
        <h3>📖 ${libro.titulo}</h3>
        <div class="acciones">
          <button class="favorito-libro" data-id="${libro.id}">
            ${libro.favorito ? "⭐" : "☆"}
          </button>
          <button class="btn-editar" data-index="${libro.index}">✏️</button>
          <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
        </div>
      </div>
      <p>✍️ ${libro.autor || "Autor desconocido"}</p>
      <p>🏷️ ${libro.genero || "Sin género"}</p>
      <p>🗓 Desde ${libro.inicio}</p>
      <p>💭 ${libro.notas || "Sin notas"}</p>
    `;

    tarjeta.addEventListener("click", (e) => {
      if (e.target.closest(".acciones")) return;
      abrirModalLibro(libro, libro.index);
    });

    grid.appendChild(tarjeta);
  });

  contenedor.innerHTML = `<h2>📚 Leyendo ahora (${lecturasActuales.length})</h2>`;
  contenedor.appendChild(grid);
}

function renderMesEspecifico(clave) {
  listaLecturas.innerHTML = "";
  const grupos = obtenerGruposTerminados();
  const grupo = grupos[clave];
  if (!grupo) return;

  const bloqueMes = document.createElement("div");
  bloqueMes.classList.add("bloque-mes");
  bloqueMes.innerHTML = `<h2>📅 ${grupo.label}</h2>`;

  grupo.libros.forEach((libro) => {
    const libroDiv = document.createElement("div");
    libroDiv.classList.add("libro");
    libroDiv.dataset.id = libro.id; // ✅ data-id
    libroDiv.dataset.index = libro.index;

    libroDiv.addEventListener("click", (e) => {
      if (e.target.closest(".acciones")) return;
      abrirModalLibro(libro, libro.index);
    });

    libroDiv.innerHTML = `
      <div class="libro-header">
        <h3>📖 ${libro.titulo}</h3>
        <div class="acciones">
          <button class="favorito-libro" data-id="${libro.id}">
            ${libro.favorito ? "⭐" : "☆"}
          </button>
          <button class="btn-editar" data-index="${libro.index}">✏️</button>
          <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
        </div>
      </div>
      <p>✍️ ${libro.autor}</p>
      <p>🏷️ ${libro.genero}</p>
      <p>🗓 ${libro.inicio} → ${libro.fin}</p>
      <p>📝 ${libro.notas || "Sin notas"}</p>
    `;

    bloqueMes.appendChild(libroDiv);
  });

  listaLecturas.appendChild(bloqueMes);
}

function renderPendientes() {
  const contenedor = document.getElementById("pendientes");
  const pendientes = obtenerPendientes();

  contenedor.innerHTML = "";
  if (!pendientes.length) return;

  const grid = document.createElement("div");
  grid.classList.add("lecturas-actuales-grid");

  pendientes.forEach((libro) => {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta-actual");
    tarjeta.dataset.id = libro.id; // ✅ data-id
    tarjeta.dataset.index = libro.index;

    tarjeta.innerHTML = `
      <div class="tarjeta-header">
        <h3>📖 ${libro.titulo}</h3>
        <div class="acciones">
          <button class="favorito-libro" data-id="${libro.id}">
            ${libro.favorito ? "⭐" : "☆"}
          </button>
          <button class="btn-editar" data-index="${libro.index}">✏️</button>
          <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
        </div>
      </div>
      <p>✍️ ${libro.autor || "Autor desconocido"}</p>
      <p>🏷️ ${libro.genero || "Sin género"}</p>
      <p>🗓 Desde ${libro.inicio}</p>
      <p>💭 ${libro.notas || "Sin notas"}</p>
    `;

    tarjeta.addEventListener("click", (e) => {
      if (e.target.closest(".acciones")) return;
      abrirModalLibro(libro, libro.index);
    });

    grid.appendChild(tarjeta);
  });

  contenedor.innerHTML = `<h2>📚 Pendientes (${pendientes.length})</h2>`;
  contenedor.appendChild(grid);
}

// ===================== FAVORITOS =====================

document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("favorito-libro")) return;

  console.log("Click en botón de favorito detectado");

  const boton = e.target;
  const tarjeta = boton.closest(".tarjeta-actual, .libro");
  if (!tarjeta) {
    console.log("No se encontró la tarjeta padre");
    return;
  }

  console.log("Tarjeta encontrada:", tarjeta);

  const id = Number(tarjeta.dataset.id);
  console.log("ID extraído del data-id:", id);

  const libros = obtenerLibros();
  const libro = libros.find((l) => l.id === id);

  if (!libro) {
    console.log("No se encontró el libro con ese id");
    return;
  }

  console.log("Libro encontrado:", libro);

  libro.favorito = !libro.favorito;
  guardarLibros(libros);

  boton.textContent = libro.favorito ? "⭐" : "☆";
  console.log("Botón actualizado a:", boton.textContent);
});

/*estadisticas*/

function renderEstadisticas() {
    const contenedor = document.querySelector(".estadisticas");
    if (!contenedor) return;
    const stats = calcularEstadisticas();

    const {
        totalLeidos,
        leidosEsteAnio,
        mesTop,
        generoTop
    } = stats;
 const mesMasLectorTexto = mesTop
        ? formatearMesAnio(mesTop)
        : "—";
    contenedor.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <span>📚</span>
                <p>Total leídos</p>
                <strong>${stats.totalLeidos}</strong>
            </div>

            <div class="stat-card">
                <span>📅</span>
                <p>Leídos este año</p>
                <strong>${stats.leidosEsteAnio}</strong>
            </div>

            <div class="stat-card">
                <span>🏆</span>
                <p>Mes más lector</p>
                <strong>${mesMasLectorTexto}</strong>
            </div>

            <div class="stat-card">
                <span>🏷️</span>
                <p>Género mas leido</p>
                <strong>${stats.generoTop || "—"}</strong>
            </div>
        </div>
    `;
}

function renderNotasLectura(notas) {
  listaNotasLectura.innerHTML = "";

  notas.forEach((nota, i) => {
    const li = document.createElement("li");
    li.textContent = nota;
    listaNotasLectura.appendChild(li);
  });
}


function renderPendientes() {
    const contenedor = document.getElementById("pendientes");
    const pendientes = obtenerPendientes();

    if (!pendientes.length) {
        contenedor.innerHTML = "";
        return;
    }

    pendientes.forEach(libro => {
        
        const tarjetas = pendientes
        .map(
            (libro) => `
            <div class="tarjeta-actual"  data-id="${libro.id}">
            <div class="tarjeta-header">
    <h3>📖 ${libro.titulo}</h3>
                <div class="acciones">
                  <button class="favorito-libro" data-id="${libro.id}">
              ${libro.favorito ? "⭐" : "☆"}
            </button>
                        <button class="btn-editar" data-index="${libro.index}">✏️</button>
                        <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
                    </div>
                    </div>
                <p>✍️ ${libro.autor || "Autor desconocido"}</p>
                <p>🏷️ ${libro.genero || "Sin género"}</p>
                <p>🗓 Desde ${libro.inicio}</p>
                <p>💭 ${libro.notas || "Sin notas"}</p>
            </div>
        `
        )
        .join("");

    contenedor.innerHTML = `
        <div class="lectura-actual">
          <h2>📚 Pendientes (${pendientes.length})</h2>
            <div class="lecturas-actuales-grid">
                ${tarjetas}
            </div>
        </div>
    `;

    });
 
}
function renderLibrosFiltrados(lista) {
    const contenedor = document.getElementById("lecturaActual");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron resultados 😢</p>";
        return;
    }

    const grid = document.createElement("div");
    grid.classList.add("lecturas-actuales-grid");

    lista.forEach((libro) => {
        grid.appendChild(crearTarjetaLibro(libro));
    });

    contenedor.appendChild(grid);
}
function crearTarjetaLibro(libro) {
    const div = document.createElement("div");
    div.classList.add("tarjeta-actual");
    div.dataset.index = libro.index;
    div.dataset.id = libro.id;

    div.innerHTML = `
        <div class="tarjeta-header">
            <h3>📖 ${libro.titulo}</h3>
            <div class="acciones">
                   <button class="favorito-libro" data-id="${libro.id}">
              ${libro.favorito ? "⭐" : "☆"}
            </button>
                <button class="btn-editar" data-index="${libro.index}">✏️</button>
                <button class="btn-eliminar" data-index="${libro.index}">🗑️</button>
            </div>
        </div>
        <p>✍️ ${libro.autor || "Autor desconocido"}</p>
        <p>🏷️ ${libro.genero || "Sin género"}</p>
        ${libro.inicio ? `<p>🗓 Desde ${libro.inicio}</p>` : ""}
        ${libro.fin ? `<p>✔ Finalizado: ${libro.fin}</p>` : ""}
        <p>💭 ${libro.notas || "Sin notas"}</p>
    `;

    div.addEventListener("click", (e) => {
        if (e.target.closest(".acciones")) return;
        abrirModalLibro(libro, libro.index);
    });

    return div;
}