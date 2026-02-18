const modal = document.getElementById("modalLibro");
const cerrarModalBtn = document.getElementById("cerrarModal");

const modalTitulo = document.getElementById("modalTitulo");
const modalAutor = document.getElementById("modalAutor");
const modalGenero = document.getElementById("modalGenero");
const modalFechas = document.getElementById("modalFechas");
const modalNotas = document.getElementById("modalNotas");
const listaNotasLectura = document.getElementById("listaNotasLectura");

const nuevaNotaInput = document.getElementById("nuevaNota");
const btnAgregarNota = document.getElementById("btnAgregarNota");

let libroActivoIndex = null;
let notaEditandoIndex = null;
function abrirModalLibro(libro, index) {
  libroActivoIndex = index;

  modalTitulo.textContent = libro.titulo;
  modalAutor.textContent = `${libro.autor}`;
  modalGenero.textContent = `${libro.genero}`;
  modalFechas.textContent = `${libro.inicio} → ${libro.fin || "En progreso"}`;

  modalNotas.textContent = libro.notas || "Sin reflexión final.";
const notas = libro.notasLectura || [];

const notasHTML = notas.length
  ? notas
      .map(
        (nota, i) => `
        <li class="nota-item">
          <div class="nota-texto">
            ${nota.texto}
            <small>📅 ${nota.fecha}</small>
          </div>
          <div class="nota-acciones">
            <button class="editar-nota" data-index="${i}">✏️</button>
            <button class="eliminar-nota" data-index="${i}">🗑️</button>
          </div>
        </li>
      `
      )
      .join("")
  : "<li>Sin notas aún</li>";

listaNotasLectura.innerHTML = notasHTML;
// 🎯 eventos editar / eliminar
document.querySelectorAll(".editar-nota").forEach(btn => {
  btn.addEventListener("click", () => {
    const index = btn.dataset.index;
    const libros = obtenerLibros();
    const libro = libros[libroActivoIndex];
    const nota = libro.notasLectura[index];

    nuevaNotaInput.value = nota.texto;   
    nuevaNotaInput.focus();

    notaEditandoIndex = index;           
    btnAgregarNota.textContent = "Guardar edición";
  });
});

  modal.classList.remove("hidden");
}

cerrarModalBtn.addEventListener("click", cerrarModalSuave);

function cerrarModalSuave() {
  modal.classList.add("cerrando");

  setTimeout(() => {
    modal.classList.remove("cerrando");
    modal.classList.add("hidden");

    // reset edición
    notaEditandoIndex = null;
    btnAgregarNota.textContent = "Agregar nota";
    nuevaNotaInput.value = "";
  }, 250);
}
btnAgregarNota.addEventListener("click", () => {
  const texto = nuevaNotaInput.value.trim();
  if (!texto) return;

  const libros = obtenerLibros();
  const libro = libros[libroActivoIndex];

  if (!libro.notasLectura) {
    libro.notasLectura = [];
  }

  // 🟣 MODO EDICIÓN
  if (notaEditandoIndex !== null) {
    libro.notasLectura[notaEditandoIndex].texto = texto;
    notaEditandoIndex = null;
    btnAgregarNota.textContent = "Agregar nota";
  } else {
    // 🟢 MODO NUEVA NOTA
    libro.notasLectura.push({
      texto,
      fecha: new Date().toISOString().split("T")[0]
    });
  }

  guardarLibros(libros);

  nuevaNotaInput.value = "";
  abrirModalLibro(libro, libroActivoIndex); // refresca modal
});

// =====================
// MODAL FORM LIBRO
// =====================

const modalForm = document.getElementById("modalForm");
const btnAbrirForm = document.getElementById("btnAgregarLibro");
const cerrarFormBtn = document.getElementById("cerrar");
function abrirModalForm() {
  // 🔥 limpiar estados anteriores
  modalForm.classList.remove("hidden", "cerrando");

  // 🔥 forzar reflow para reiniciar animación
  void modalForm.offsetWidth;

  modalForm.classList.remove("hidden");
}
function cerrarModalForm() {
  modalForm.classList.add("cerrando");

  setTimeout(() => {
    modalForm.classList.remove("cerrando");
    modalForm.classList.add("hidden");

    // opcional: limpiar form
    document.getElementById("formLibro").reset();
  }, 250);
}

// abrir
btnAbrirForm.addEventListener("click", abrirModalForm);

// cerrar con X
cerrarFormBtn.addEventListener("click", cerrarModalForm);

// cerrar clic fuera
window.addEventListener("click", (e) => {
  if (e.target === modalForm) cerrarModalForm();
});