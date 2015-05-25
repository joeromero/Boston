'use strict'
/*==============================================================================
VARIABLES GLOBALES
==============================================================================*/
var bonus = [30, 15, 0], dados = [1, 1, 1], tur = [1], imgDados = ["images/dado0.png", "images/dado1.png", "images/dado2.png", "images/dado3.png", "images/dado4.png", "images/dado5.png", "images/dado6.png"]

function jugador(x_nombre, x_puntaje, x_turno, x_tiro){
  var nombre  = x_nombre;
  var puntaje = x_puntaje;
  var turno   = x_turno;
  var tiro    = x_tiro;

  return {
    getNombre : function(){ return nombre },
    getDatos  : function(){ return `${nombre} >>>> ${puntaje}`},
    getPuntaje: function(){ return puntaje },
    addPuntaje: function(n_puntaje){ puntaje += n_puntaje },
    setTurno  : function(){ turno = true; dados = [1, 1, 1]; tiro = 0 },
    getTurno  : function(){ return turno },
    endTurno  : function(){ turno = !turno },
    setTiro   : function(n_tiro){ tiro = n_tiro },
    getTiro   : function(){ return tiro },
    addTiro   : function(){ tiro++ }
  }
}

var ordenador = new jugador("Ordenador", 0, false, 0)
var persona   = new jugador("Persona"  , 0, false, 0)

document.querySelector("#btnSorteo").addEventListener("click", sortearTurno)
document.querySelector("#mano1").addEventListener("click", turnoPersona)

/*==============================================================================
FUNCIONES: MOTOR DE JUEGOS
==============================================================================*/
function jugar(tiro, jugador){
  tirarDados(dados)
  muestraDados(jugador)

  if(validaBonus(dados) && tiro < 2) {
    jugador.addPuntaje(bonus[tiro])
  }
  else {
    dados.sort()
    jugador.addPuntaje(dados[dados.length - 1])
  }
  addResultadoLista(jugador)
  validaGanador()
  dados.pop()
}

function tirarDados(elementos){
  for(var i=0; i<elementos.length; i++){
    elementos[i] = 1 + Math.floor((Math.random() * 6))
  }
}

function validaBonus(elementos){
  var valido = true

  for(var i=0; i<elementos.length - 1; i++)
    if(elementos[0] != elementos[i+1])
      valido = false

  return valido
}

function validaGanador(){
  if (ordenador.getPuntaje() >= 100){
    swal({ title: "LOL!", text: `Gana el ${ordenador.getNombre()}`, imageUrl: "images/bender-aplause.png" });
    mensaje(`Ganador ${ordenador.getNombre()}!`)
  }
  else if (persona.getPuntaje() >= 100) {
    swal({ title: "Yeah!", text: `Gana el ${persona.getNombre()}`, imageUrl: "images/fry-yeah.jpg" });
    mensaje(`Ganador ${persona.getNombre()}!`)
  }
}

/*==============================================================================
FUNCIONES: INTERACCIÓN INTERFAZ
==============================================================================*/
function startGame(){
  if(persona.getTurno()){
    mensaje(`Turno ${persona.getNombre()}`)
    classie.remove(document.getElementById("mano1"), "disabled")
  }
  else if(ordenador.getTurno()){
    mensaje(`Turno ${ordenador.getNombre()}`)
    classie.add(document.getElementById("mano1"), "disabled")
    turnoMaquina()
  }
}

function turnoPersona(){
  jugar(persona.getTiro(), persona)
  document.getElementById("puntaje-1").innerHTML = persona.getPuntaje()
  persona.addTiro()
  if(persona.getTiro() >= 3){
    persona.endTurno()
    ordenador.setTurno()
    startGame()
  }
}

function turnoMaquina(){
  setTimeout(function(){
    jugar(0, ordenador)
    document.getElementById("puntaje-2").innerHTML = ordenador.getPuntaje()
    setTimeout(function(){
      jugar(1, ordenador)
      document.getElementById("puntaje-2").innerHTML = ordenador.getPuntaje()
      setTimeout(function(){
        jugar(2, ordenador)
        document.getElementById("puntaje-2").innerHTML = ordenador.getPuntaje()
        ordenador.endTurno()
        persona.setTurno()
        startGame()
      },1500)
    },1500)
  }, 1500)
}

function sortearTurno(){
  tirarDados(tur)
  var jug1 = tur[0]
  tirarDados(tur)
  var jug2 = tur[0]

  document.getElementById("dado-sorteo-1").src = imgDados[jug1]
  document.getElementById("dado-sorteo-2").src = imgDados[jug2]
  ocultaPanelSorteo()

  if(jug1 > jug2) {
    persona.setTurno(true)
    startGame()
  }
  else if(jug1 < jug2) {
    ordenador.setTurno(true)
    startGame()
  }
  else {
    mensaje("Empate, vuelva a tirar.")
  }
}

/*==============================================================================
FUNCIONES: CONTROL INTERFAZ
==============================================================================*/
function muestraDados(){
  ocultaDados()
  for(var i=0; i<dados.length; i++){
    document.getElementById(`app-dado-${i}`).src = imgDados[dados[i]]
    classie.remove(document.getElementById(`app-dado-${i}`), "hidden")
  }
}

function ocultaDados(){
  for(var i=0; i<3; i++)
    classie.add(document.getElementById(`app-dado-${i}`), "hidden")
}

function addResultadoLista(jugador){
  var li = document.createElement("li")
  li.innerHTML = `${dados.toString()} >> Acumulado: ${jugador.getPuntaje()}`
  classie.add(li, "list-group-item")
  document.getElementById(`puntajes-${jugador.getNombre()}`).appendChild(li)
}

function ocultaPanelSorteo(){
  setTimeout(function(){
    classie.add(document.getElementById("app-panel-sorteo"), "hidden")
    classie.remove(document.getElementById("panel-dados"), "hidden")
    },
    2500
  )
}

function mensaje(contenido){
  document.getElementById("mensaje").innerHTML = contenido
}
