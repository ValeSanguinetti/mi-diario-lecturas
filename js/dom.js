const btnAgregarLibro = document.getElementById("btnAgregarLibro");
const formLibro = document.getElementById("formLibro");
const tituloInput = document.getElementById("titulo");
const autorInput = document.getElementById("autor");
const GeneroInput = document.getElementById("genero");
const fechaInicioInput = document.getElementById("fechaInicio");
const fechaFinInput = document.getElementById("fechaFin");
const notasInput = document.getElementById("notas");
const listaLecturas = document.getElementById("listaLecturas");
const filtroAnio = document.getElementById("filtroAnio");
const filtroMes = document.getElementById("filtroMes");

let indiceEditando = null;
