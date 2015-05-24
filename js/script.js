// --- Valores de referencia ---




// --- REFERENCIAS A ELEMENTOS ---

// Referencia al panel de mensajes
var pnlMensajes = document.getElementById("mensajes");

// Referencia al panel izquierdo
var pnlIzq = document.getElementById("panel_izq");

// Referencia al nombre del jugador izquierdo
var nombreIzq = document.getElementById("nombre_izq");

// Referencia a los puntos del jugador izquierdo
var puntosIzq = document.getElementById("puntos_izq");

// Referencia al panel derecho
var pnlDer = document.getElementById("panel_der");

// Referencia al nombre del jugador derecho
var nombreDer = document.getElementById("nombre_der");

// Referencia a los puntos del jugador derecho
var puntosDer = document.getElementById("puntos_der");

// Referencia al panel de tirada 1
var pnlTir1 = document.getElementById("panel_tirada_1");

// Referencia a la etiqueta de tirada 1
var lblTir1 = document.getElementById("tirada_1");

// Referencia a los dados de la tirada 1
var dado11 = document.getElementById("dado_11");
var dado12 = document.getElementById("dado_12");
var dado13 = document.getElementById("dado_13");

// Referencia a los puntos de tirada 1
var puntosTir1 = document.getElementById("puntos_tirada_1");

// Referencia al panel de tirada 2
var pnlTir2 = document.getElementById("panel_tirada_2");

// Referencia a la etiqueta de tirada 2
var lblTir2 = document.getElementById("tirada_2");

// Referencia a los dados de la tirada 2
var dado21 = document.getElementById("dado_21");
var dado22 = document.getElementById("dado_22");
var dado23 = document.getElementById("dado_23");

// Referencia a los puntos de tirada 2
var puntosTir2 = document.getElementById("puntos_tirada_2");

// Referencia al panel de tirada 3
var pnlTir3 = document.getElementById("panel_tirada_3");

// Referencia a la etiqueta de tirada 3
var lblTir3 = document.getElementById("tirada_3");

// Referencia a los dados de la tirada 3
var dado31 = document.getElementById("dado_31");
var dado32 = document.getElementById("dado_32");
var dado33 = document.getElementById("dado_33");

// Referencia a los puntos de tirada 3
var puntosTir3 = document.getElementById("puntos_tirada_3");

// Referencia al panel de botón
var pnlBoton = document.getElementById("controles");

// Referencia al botón
var btnTirar = document.getElementById("boton");

// --- Semáforos y maniobra ---

// Semáforo de elección de orden de tirar
var sorteoJugadoresOK = false;



// --- Referencias a recursos ---




// --- Objetos ---
var d11 = new Dado(dado11);
var d12 = new Dado(dado12);
var d13 = new Dado(dado13);
var d21 = new Dado(dado21);
var d22 = new Dado(dado22);
var d23 = new Dado(dado23);
var d31 = new Dado(dado31);
var d32 = new Dado(dado32);
var d33 = new Dado(dado33);



// --- Constructores ---

// Encapsula una clase de números aleatorios
function Aleatorio(min, max) {
  // Uso estricto
  "use strict";

  // Valor actual del numero
  var valor = 0;

  // Muestra popup con valor actual
  this.mostrarValor = function () {
    window.alert("Valor: " + valor);
  };

  // Actualiza el número aleatorio
  this.regenerarValor = function () {
    // Número entre 0.0 y el rango sin llegar
    var numero = Math.random() * (max - min + 1);

    // Devuelve la parte entera más el mínimo
    valor = Math.floor(numero) + min;
  };

  // Obtener el valor actual
  this.getValor = function () {
    return valor;
  };

  // Establecer nuevo valor
  this.setValor = function (v) {
    valor = v;
  };

  // Inicialización del objeto
  this.regenerarValor();
}

// Comportamiento de un dado
function Dado(refImg) {
  // Uso estricto
  "use strict";

  // Valores minimo y maximo del dado
  const VALOR_MIN = 1;
  const VALOR_MAX = 6;

  // Retardo del temporizador - ms
  const RETARDO = 100;

  // Cambios del dado al echar a rodar
  const LIMITE_CAMBIOS = 20;

  // Dado estable/en movimiento
  var dadoEstableOK = true;

  // Contador cambios
  var contadorCambios = 0;

  // Referencia del temporizador
  var timer;

  // Rutas de los ficheros gráficos
  var imagen = [
    "img/0.png", // Valor indefinido
    "img/1.png",
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png"];

  // Instancia un objeto aleatorio
  var bombo = new Aleatorio(VALOR_MIN, VALOR_MAX);

  // Seleccionar imagen
  var seleccionarImagen = function (numero) {
    if (numero >= VALOR_MIN && numero <= VALOR_MAX) {
      // Carga la imagen seleccionada
      refImg.src = imagen[numero];
    } else {
      // Carga la imagen predeterminada
      refImg.src = imagen[0];
    }
  };

  // Cambio aleatorio de imagen
  // --- Duda ---
  // Este método se llama desde dentro del Timer.
  // En ese contexto la referencia this se refiere 
  // al objeto window en los navegadores no a Dado.
  // --- Duda ---
  var rodarDado = function () {
    // Analiza el número de cambios que lleva el dado
    if (contadorCambios > LIMITE_CAMBIOS) {
      // Desactiva el temporizador
      clearInterval(timer);

      // Reinicializa el contador de cambios
      contadorCambios = 0;

      // Crea un nuevo evento 'lanzamiento'
      var event = new Event('lanzamiento');

      // Dispara el evento sobre el dado
      refImg.dispatchEvent(event);
    } else {
      // Genere número aleatorio para el cambio actual
      bombo.regenerarValor();

      // Realizar el cambio
      seleccionarImagen(bombo.getValor());

      // Actualiza el contador de cambios
      contadorCambios++;
    }
  };

  // Tira un dado
  this.lanzarDado = function () {
    timer = setInterval(rodarDado, RETARDO);
  };

  // Obtener el valor del dado
  this.getValor = function () {
    return bombo.getValor();
  };

  // Obtener el estado del dado
  this.isEstable = function () {
    return contadorCambios === 0;
  }
}

// --- Funciones ---

// Procesar botón de acción
function procesarAccion() {
  // Uso estricto
  "use strict";

  if (!sorteoJugadoresOK) {
    // Cambia el semáforo
    sorteoJugadoresOK = true;

    // Realizar sorteo
    realizarSorteo();
  }
}

function realizarSorteo() {
  // Mensaje de actividad
  pnlMensajes.innerHTML = "Sorteando jugadores ...";

  // Esconde el botón
  btnTirar.style.visibility = "Hidden";

  // Lanzar dados
  d11.lanzarDado();
  d13.lanzarDado();
}

function procesarEvento() {
  if (d11.isEstable() && d13.isEstable) {
    var v1 = d11.getValor();
    var v2 = d13.getValor();
    if (v1 > v2) {
      pnlMensajes.innerHTML = "Ganador: Humano";
    } else if (v1 < v2) {
      pnlMensajes.innerHTML = "Ganador: Máquina";
    } else {
      pnlMensajes.innerHTML = "Ganador: EMPATE";
    }
  }
}

function procesarDado11() {
  procesarEvento();
}

function procesarDado13() {
  procesarEvento();
}

// Registrar listeners de eventos
function registrarListeners() {
  // Uso estricto
  "use strict";

  // Listener de click en boton acción
  btnTirar.addEventListener("click", procesarAccion);

  // Listener de 'lanzamiento" sobre dado11
  dado11.addEventListener("lanzamiento", procesarDado11);

  // Listener de 'lanzamiento" sobre dado12
  //  dado13.addEventListener("lanzamiento", procesarDado12);

  // Listener de 'lanzamiento" sobre dado13
  dado13.addEventListener("lanzamiento", procesarDado13);
}

// Aspecto del interfaz para realizar el sorteo
function establecerInterfazSorteo() {
  // Uso estricto
  "use strict";

  // --- Mensaje ---
  pnlMensajes.innerHTML = "Pulsar el botón para sortear los jugadores";

  // --- Botón ---
  btnTirar.value = "Sortear jugadores";

  // --- VISIBILIDAD ---
  pnlTir1.style.visibility = "hidden";
  pnlTir2.style.visibility = "hidden";
  pnlTir3.style.visibility = "hidden";
  dado11.style.visibility = "visible";
  dado13.style.visibility = "visible";
}

// Aspecto del interfaz durante la tirada 1
function establecerInterfazTirada1() {
  // Uso estricto
  "use strict";

  // --- Mensaje ---
  pnlMensajes.innerHTML = "Tirada 1";

  // --- Botón ---
  btnTirar.value = "Tirar dados";

  // --- VISIBILIDAD ---
  pnlTir1.style.visibility = "visible";
}

// Aspecto del interfaz durante la tirada 2
function establecerInterfazTirada2() {
  // Uso estricto
  "use strict";

  // --- Mensaje ---
  pnlMensajes.innerHTML = "Tirada 2";

  // --- Botón ---
  btnTirar.value = "Tirar dados";

  // --- VISIBILIDAD ---
  pnlTir2.style.visibility = "visible";
}

// Aspecto del interfaz durante la tirada 1
function establecerInterfazTirada3() {
  // Uso estricto
  "use strict";

  // --- Mensaje ---
  pnlMensajes.innerHTML = "Tirada 3";

  // --- Botón ---
  btnTirar.value = "Tirar dados";

  // --- VISIBILIDAD ---
  pnlTir3.style.visibility = "visible";
}

// Inicialización de la aplicación
function iniciarAplicacion() {
  // Uso estricto
  "use strict";

  // Iniciar interfaz de usuario
  establecerInterfazSorteo();

  // Registrar listeners de eventos
  registrarListeners();
}

// Inicializa la página - Zepto
window.addEventListener("load", iniciarAplicacion);