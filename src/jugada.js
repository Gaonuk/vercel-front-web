
const jugada = {
  posicion_anterior: '',
  nueva_pos: '',
  gemas_recogidas: 0,
  items_recogidos: 0,
  items_gastados: 0,
  Muerte: false,
};

// numero del jugador, se usa para elegir posición inicial
var numJugador = 1;

// esta variable se usa para que no se haga más de una jugada or turno
var jugadas = 0;

// lista donde guardo numero del planeta elegido en cada celda
var imgs = [];

// lista por cada celda, 1 si es visible el planeta, 0 si no
var vis = [];

// lista con número del objeto elegido en cada celda
var objects = [];

// número de celda actual del jugador
var posicion_actual;

// posición anterior del jugador
var posicion_anterior;

// posición a la quiere moverse el jugador
var posicion_deseada;

// 1 si estamos en la grid de planetas, 0 si no
var on_map = 1;

// cantidad de objetos en la mochila
var num_objects = 0;

// cantidad de gemas del jugador
var gem_count = 0;

// variables de stats
var HP = 100;
var XP = 0;
var Attack = 10;
var Defense = 10;
var Special = 0;

// 1 si ya se usó un poder este turno, 0 si no
var used_special = 0;

// número de posición de objeto seleccionado en mochila (amarillo en frontend), -1 si ninguno
var sel_obj = -1;

// número de posición de objeto seleccionado en arsenal (amarillo en frontend), -1 si ninguno
var sel_ars = -1;

// 0 si ya atacaste este turno, 0 si no
var has_attacked = 0;

// variable de presencia de enemigos para cada planeta, 0 si no 1 si si
var has_enemy = [];

 // variable de presencia de objetos para cada planeta, 0 si no 1 si si
var has_object = [];

// dirección de imagenes de cada enemigo
var enemies = ['../assets/images/Personajes/Bazuca-k.png', '../assets/images/Personajes/Lolo.png',
'../assets/images/Personajes/Rocky.png'];

// dirección de imagenes de cada personaje
var characters = ['../assets/images/Personajes/Beef.png', '../assets/images/Personajes/Duncan.png',
'../assets/images/Personajes/Kike.png', '../assets/images/Personajes/Meep.png',
'../assets/images/Personajes/Ranger.png', '../assets/images/Personajes/Steve.png',
'../assets/images/Personajes/Tony.png', '../assets/images/Personajes/Vader.png'];


// habilidad de cada personaje (para mostrar al seleccionar)
var char_hab = [];

// Cargamos las habilidades con una solicitud GET al backend 
var cargarHabilidades = async id => {
  let url = `https://sheltered-basin-80918.herokuapp.com/personajes/${id}`
  await fetch(url)
    .then(response => {
      return response.json()
    })
    .then( data => {
      char_hab.push(data.especial)
    })
}

// Utilizamos la función 7 veces (número de personajes en el juego)
for (var i = 1; i < 8; i++) {
  cargarHabilidades(i);
}


// número de posición de personaje seleccionado (amarillo en frontend), -1 si ninguno
var sel_character = -1;

// numero de personaje en cada posición (hay 3 posiciones en frontend para personajes)
var team = [0, 1, 3];

// Stats de enemigos
var enemy_hp = [];
var enemy_at = [];
var enemy_df = [];

// Funcion que agrega las estadisticas iniciales de los enemigos a los array haciendo un GET al backend
var statsMonstruos = async id => {
  let url = `https://sheltered-basin-80918.herokuapp.com/monstruos/${id}`
  await fetch(url)
    .then(response => {
      return response.json()
    })
    .then(data => {
        enemy_hp.push(data.vida);
        enemy_at.push(data.ataque);
        enemy_df.push(data.defensa);
    })
}

// Hay sólo 3 monstruos en el juego
statsMonstruos(1)
statsMonstruos(2)
statsMonstruos(3)

// variable que muestra si se le bajo defensa al enemigo (por habilidad de personaje)
var df_less = 0;

 // lista con vida restante de cada enemigo por planeta (0 si no hay enemigo o está muerto)
var hp_left = [];

// dirección de imagenes de cada objeto
var allObjects = ['../assets/images/objects/sword.png',
'../assets/images/objects/blaster1.png', '../assets/images/objects/blaster2.png', 
'../assets/images/objects/learn.png', '../assets/images/objects/lightsaber.png', 
'../assets/images/objects/potion.png', '../assets/images/objects/shield.png',
'../assets/images/objects/star.png'];

// lista para direcciones de imagen de cada objeto en arsenal (inicialmente imagenes en blanco)
var arsenal = ['../assets/images/bbb.png', '../assets/images/bbb.png', '../assets/images/bbb.png'];

// id de objetos en cada posición del arsenal
var arsenal_id = [-1, -1, -1];

// cantidad de objetos en arsenal actualmente
var arsenal_cnt = 0;

// buff de ataque de cada objeto 0 si no suma al equipar
var attack_add = [10, 20, 30, 0, 15, 0, 0, 0];

// buff de defensa de cada objeto 0 si no suma al equipar
var defense_add = [0,  0,  0, 0,  0, 0, 10, 0];

// lista para direcciones de imagen de cada objeto en mochila (inicialmente imagenes en blanco)
var backpack = ['../assets/images/bbb.png', '../assets/images/bbb.png', '../assets/images/bbb.png', 
                '../assets/images/bbb.png', '../assets/images/bbb.png', '../assets/images/bbb.png', 
                '../assets/images/bbb.png', '../assets/images/bbb.png', '../assets/images/bbb.png'];

// id de objetos en cada posición de la mochila
var backpack_id = [-1, -1, -1, -1, -1, -1, -1, -1, -1];

// pesos para aparición de cada objeto (mas en proporcion implica mayor probabilidad)
var weights = [2, 2, 1, 2, 2, 3, 4, 3];

// suma de todos los pesos (para obtener proporciones)
var total_weights = 0;

// posicion de planeta base del jugador (depende del número del jugador)
var p_base;

const sesion = sessionStorage;
const local = localStorage;

window.onload = function () {
  // same as window.addEventListener('load', (event) => {
  
  // Chequeamos si hay un usuario conectado, solo se puede jugar 
  // si uno esta conectado
  if (local.getItem('currentUser') === null) {
    alert('Debes iniciar sesion para jugar!')
    window.location.replace('../views')
  }

  document.getElementsByClassName('mapon')[0].style.display = 'none';

  // asigamos la base del jugador dependiendo del número del jugador
  if (numJugador == 1) p_base = 1;
  if (numJugador == 2) p_base = 7;
  if (numJugador == 3) p_base = 49;

  // Seteamos las imagenes dependiendo de personajes elegidos (los puse por default aca segun la lista 'team')
  var img = document.getElementById('t1');
  img.src = characters[team[0]];
  var img = document.getElementById('t2');
  img.src = characters[team[1]];
  var img = document.getElementById('t3');
  img.src = characters[team[2]];

  // seleccionamos planeta para cada posición al azar
  for (var i = 1; i <= 49; i++) {
    var randomNum = Math.floor(Math.random() * 89) + 2;
    var cell_visible = 0;
    if (i == p_base) {

      // si estamos en el planeta base pongo por default la imagen del planeta 1.
      randomNum = 1; 
      cell_visible = 1;
    }
    imgs.push(randomNum);
    vis.push(cell_visible);
  }

  // Hago visibles los planetas adjacentes revisando en cada dirección
  if (up(p_base) != -1) vis[up(p_base) - 1] = 1;
  if (down(p_base) != -1) vis[down(p_base) - 1] = 1;
  if (left(p_base) != -1) vis[left(p_base) - 1] = 1;
  if (right(p_base) != -1) vis[right(p_base) - 1] = 1;
  if (lu(p_base) != -1) vis[lu(p_base) - 1] = 1;
  if (ru(p_base) != -1) vis[ru(p_base) - 1] = 1;
  if (ld(p_base) != -1) vis[ld(p_base) - 1] = 1;
  if (rd(p_base) != -1) vis[rd(p_base) - 1] = 1;

  // Seteo imagen para planetas visibles
  for (var i = 1; i <= 49; i++) {
    var now = document.getElementById(i);
    if (vis[i - 1]) now.src = '../assets/images/Planets/' + imgs[i - 1] + '.png';
  }

  // sumo los pesos de probabilidad de aparicion de cada objeto
  for (var i = 0; i < 8; i++) total_weights += weights[i];

  // asigno enemigo o objeto a cada posición al azar
  for (var i = 1; i <= 49; i++) {

    // numero aleatorio entre 0 y 1
    var randomNum3 = Math.random(); 

    // 20% probabilidad elijo enemigo
    if (randomNum3 < 0.2)
    {
      // hay enemigo y no objeto
      has_enemy.push(1); has_object.push(0);
      var randomNum2 = Math.floor(Math.random() * 3);

      // asigno variables
      hp_left.push(enemy_hp[randomNum2]); objects.push(randomNum2);
    }
    // en otro caso pongo un objeto
    else 
    {
      // hay objeto y no enemigo
      has_enemy.push(0); has_object.push(1); hp_left.push(0);

      // numero aleatorio entre 0 y suma de pesos
      var randomNum2 = Math.floor(Math.random() * total_weights) + 1;
      var curr_sum = 0;

      // veo que objeto se asigna sumando los pesos hasta superar el valor aleatorio
      for (var j = 0; j < 8; j++) {
        curr_sum += weights[j];
        if (curr_sum >= randomNum2) {
          objects.push(j);
          break;
        }
      }
    }
  }

  // conecto funciones a botones y divs correspondientes
  document.querySelectorAll('#sessionButton').forEach((item) => {
    item.addEventListener('click', disconnect);
  });

  document.querySelectorAll('#mapid1').forEach((item) => {
    item.addEventListener('click', intentoMover);
  });

  document.querySelectorAll('#mochila').forEach((item) => {
    item.addEventListener('click', selectObj);
  });

  document.querySelectorAll('#team-imgs').forEach((item) => {
    item.addEventListener('click', selectChar);
  });

  document.querySelectorAll('#ars-element').forEach((item) => {
    item.addEventListener('click', selectArs);
  });

  document.querySelectorAll('#but1').forEach((item) => {
    item.addEventListener('click', atacar);
  });

  document.querySelectorAll('#but2').forEach((item) => {
    item.addEventListener('click', recoger);
  });

  document.querySelectorAll('#but3').forEach((item) => {
    item.addEventListener('click', special);
  });

  document.querySelectorAll('#but4').forEach((item) => {
    item.addEventListener('click', base);
  });

  document.querySelectorAll('#butUt').forEach((item) => {
    item.addEventListener('click', utilizar);
  });

  document.querySelectorAll('#butEl').forEach((item) => {
    item.addEventListener('click', eliminar);
  });

  document.querySelectorAll('#butDes').forEach((item) => {
    item.addEventListener('click', desequipar);
  });

  document.querySelectorAll('#butSend').forEach((item) => {
    item.addEventListener('click', enviarJugada);
  });

  // posición inicial es planeta base
  posicion_actual = p_base;
  var obj = document.getElementById('00' + posicion_actual);

  // destaco en amarillo posición actual
  obj.classList.add('sel');

  var equipo = {
    posicion_anterior: '',
    posicion: posicion_actual,
    personajes: {
      personaje1: {
        clase: 0,
        vida: 0,
        ataque: 0,
        defensa: 0,
        magia: 0,
        habilidades: {},
      },
      personaje2: {
        clase: 0,
        vida: 0,
        ataque: 0,
        defensa: 0,
        magia: 0,
        habilidades: {},
      },
      personaje3: {
        clase: 0,
        vida: 0,
        ataque: 0,
        defensa: 0,
        magia: 0,
        habilidades: {},
      },
    },
    mochila: [],
    gemas: 0,
  };
  var turnoEquipo = async id => {
    let url = `https://sheltered-basin-80918.herokuapp.com/turnos/${id}`
    await fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        equipo = data[`equipo${numJugador}`]
      })
  }

  /*
  var turnos = []
  var chequearTurno = async id => {
    let url = 'https://sheltered-basin-80918.herokuapp.com/turno/'
    await fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        turnos = data
      })
  }
  if (chequearTurno.length === 0){
    (async id => {
      let url = `https://sheltered-basin-80918.herokuapp.com/turno/new`
    })
  }
  /*
  // turnoEquipo(jugadas)
  */
};

function disconnect() {
  local.removeItem('currentUser')
  location.reload()
}

// funciones que calculan celdas adjacentes
function up(i) {
  if (i > 7) return i - 7;
  return -1;
}
function down(i) {
  if (i < 43) return i + 7;
  return -1;
}
function left(i) {
  if (i % 7 != 1) return i - 1;
  return -1;
}
function right(i) {
  if (i % 7 != 0) return i + 1;
  return -1;
}
function lu(i) {
  if (i % 7 != 1 && i > 7) return i - 8;
  return -1;
}
function ru(i) {
  if (i % 7 != 0 && i > 7) return i - 6;
  return -1;
}
function ld(i) {
  if (i % 7 != 1 && i < 43) return i + 6;
  return -1;
}
function rd(i) {
  if (i % 7 != 0 && i < 43) return i + 8;
  return -1;
}

// función de número aleatorio (no la usé mucho oops)
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/*
 * función de inteno mover (se activa al apretar un planeta)
 * event aca es el div cliqueado
 */
function intentoMover(event) {
  // si ya jugaste no puedes jugar denuevo
  if (jugadas != 0) { 
    alert('Ya hiciste una jugada!');
  } else {

    // vemos posición leyendo id del div apretado
    posicion_deseada = parseInt(event.target.id);

    // vemos si es adjacente a posición actual, si no lo es no se puede apretar
    if (posicion_deseada != posicion_actual && up(posicion_deseada) != posicion_actual && down(posicion_deseada) != posicion_actual &&
        left(posicion_deseada) != posicion_actual && right(posicion_deseada) != posicion_actual && lu(posicion_deseada) != posicion_actual && 
        ru(posicion_deseada) != posicion_actual && ld(posicion_deseada) != posicion_actual && rd(posicion_deseada) != posicion_actual)
    {
      alert('Esta celda no es adjacente a tu posición actual, intenta nuevamente');
      return;
    }

    alert('Haz declarado tu jugada!');

    jugada['posicion_anterior'] = posicion_actual;
    jugada['nueva_pos'] = posicion_deseada;

    // movemos seleccion en amarillo de celda anterior a celda seleccionada
    var obj = document.getElementById('00' + posicion_actual);
    obj.classList.remove('sel');
    var obj = document.getElementById('00' + posicion_deseada);
    obj.classList.add('sel');
    
    posicion_actual = posicion_deseada;

    // pongo imagenes de fondo correspondiente al planeta y objeto o enemigo según corresponda
    var img = document.getElementById('mapon-img');
    var obj = document.getElementById('mapon-obj');
    img.src = '../assets/images/Planets-bg/' + imgs[posicion_deseada - 1] + '.png';

    // solo pongo enemigo si hay en la posicion
    if (has_enemy[posicion_deseada - 1] == 1)
    {
      obj.src = enemies[objects[posicion_deseada - 1]];
      var line = document.getElementById('E');

      // muestro vida del enemigo
      line.textContent = 'Enemy HP: ' + hp_left[posicion_deseada - 1];
    }

    // solo pongo objeto si hay en la posicion
    else if (has_object[posicion_deseada - 1] == 1)
    {
      obj.src = allObjects[objects[posicion_deseada - 1]];
    }
    else
    {
      obj.src = '../assets/images/bbb.png';
    }

    // cambio a vista de planeta en zoom
    document.getElementsByClassName('mapon')[0].style.display = 'grid';
    document.getElementsByClassName('map')[0].style.display = 'none';
    on_map = 0;

    // asigno que ya jugué
    jugadas = 1;
  }
}

// función de terminar jugada, se activa cuando se aprieta el boto arria en el frontend
function enviarJugada() {

  // cambiamos de vista de planeta a vista de grilla
  document.getElementsByClassName('mapon')[0].style.display = 'none';
  document.getElementsByClassName('map')[0].style.display = 'grid';

  // quito vida de enemigo si habia
  var line = document.getElementById('E'); line.textContent = '';

  // hago visibles celdas adjacentes a actual nueva
  if (up(posicion_actual) != -1) vis[up(posicion_actual) - 1] = 1;
  if (down(posicion_actual) != -1) vis[down(posicion_actual) - 1] = 1;
  if (left(posicion_actual) != -1) vis[left(posicion_actual) - 1] = 1;
  if (right(posicion_actual) != -1) vis[right(posicion_actual) - 1] = 1;
  if (lu(posicion_actual) != -1) vis[lu(posicion_actual) - 1] = 1;
  if (ru(posicion_actual) != -1) vis[ru(posicion_actual) - 1] = 1;
  if (ld(posicion_actual) != -1) vis[ld(posicion_actual) - 1] = 1;
  if (rd(posicion_actual) != -1) vis[rd(posicion_actual) - 1] = 1;

  // pongo imagenes a planetas visibles
  for (var i = 1; i <= 49; i++) { 
    var now = document.getElementById(i);
    if (vis[i - 1]) now.src = '../assets/images/Planets/' + imgs[i - 1] + '.png';
  }

  // ahora vemos la grilla
  on_map = 1;

  // termino el turno así que para el proximo no hemos atacado
  has_attacked = 0;

  // si estamos en la base recuperamos vida
  if (posicion_actual == p_base)
  {
    var line = document.getElementById('H');
    HP = Math.min(100, HP + 10);
    line.textContent = 'HP: ' + HP;
  }

  // si tenemos 5 gemas ya ganamos
  if (gem_count == 5)
  {
    alert('Has ganado el juego!');
  }

  // desactivamos poderes especiales activados (si no activamos no hace nada)
  special_off();

  // seteamos a 0 ara el proximo turno
  jugadas = 0;

  // falta conectar y mandar info aca

  // const miStorage = localStorage;
  // let jugadaJson = JSON.stringify(jugada);
  // miStorage.setItem('jugada', jugadaJson);

  // posicion_deseada = document.getElementsByClassName(jugada['nueva_pos'])[0]
  //   .classList;
  // posicion_actual = document.getElementsByClassName(
  //   jugada['posicion_anterior']
  // )[0].classList;
  // posicion_actual.remove('equipo');
  // posicion_deseada.add('equipo');

  // const miStorage = localStorage;
  // myObj = { name: 'John', age: 31, city: 'New York' };
  // myJSON = JSON.stringify(myObj);
  // miStorage.setItem('testJSON', myJSON);
}

// función de recoger objeto (se activa al apretar el boton recoger)
function recoger()
{
  // sólo podemos recoger si estamos en un planeta
  if (on_map == 1)
  {
    alert('Debes estar en un planeta para recoger objetos!');
    return;
  }

  // sólo podemos recoger si hay objetos en el planeta actual
  if (has_object[posicion_actual - 1] == 0)
  {
    alert('No hay objetos por recoger :(');
    return;
  }

  // si la mochila esta llena no se puede recoger
  if (num_objects == 9)
  {
    alert('Tienes muchos objetos en la mochila!');
    return;
  }

  // quitamos objeto del mapa y de lista de objetos en planetas
  has_object[posicion_actual - 1] = 0;
  var obj = document.getElementById('mapon-obj');
  obj.src = '../assets/images/bbb.png';

  // si es una estrella sumamos XP
  if (objects[posicion_deseada - 1] == 7)
  {
    var line = document.getElementById('X');

    XP += 50;
    line.textContent = 'XP: ' + XP;
  }
  // si es una pergamino sumamos habilidad especial
  else if (objects[posicion_deseada - 1] == 3)
  {
    var line = document.getElementById('S');

    Special += 1;
    line.textContent = 'Special: ' + Special;
  }
  // en otro caso agregamos a la mochila
  else
  {
    num_objects += 1;
    var img = document.getElementById('m' + num_objects);
    img.src = allObjects[objects[posicion_deseada - 1]];
    backpack[num_objects - 1] = allObjects[objects[posicion_deseada - 1]];
    backpack_id[num_objects - 1] = objects[posicion_deseada - 1];
  }
}

// función de atacar (se activa cuando presionan el boton atacar)
function atacar()
{
   // solo podemos atacar en un planeta
  if (on_map == 1)
  {
    alert('Debes estar en un planeta para atacar!');
    return;
  }
  // solo si hay enemigo en el planeta actual
  if (has_enemy[posicion_actual - 1] == 0)
  {
    alert('No hay enemigos a la vista');
    return;
  }
  // solo si no hemos atacado este turno
  if (has_attacked == 1)
  {
    alert('No puedes atacar más de una vez por turno.');
    return;
  }

  // seteamos hemos atacado a 1
  has_attacked = 1;

  // recalculamos vida dependiendo de ataques y defensas
  hp_left[posicion_actual - 1] -= calcular_dano(Attack, enemy_df[objects[posicion_actual - 1]] - df_less);
  HP -= calcular_dano(enemy_at[objects[posicion_actual - 1]], Defense);

  // update a vida de enemigo
  var line = document.getElementById('E');
  line.textContent = 'Enemy HP: ' + hp_left[posicion_deseada - 1];

  //update a nuestra vida
  var line = document.getElementById('H');
  line.textContent = 'HP: ' + HP;

  // si enemigo tiene vida 0 muere y desaparece y gano una gema
  if (hp_left[posicion_actual - 1] <= 0)
  {
    has_enemy[posicion_actual - 1] = 0;
    var obj = document.getElementById('mapon-obj');
    obj.src = '../assets/images/bbb.png';

    gem_count++;
    var obj = document.getElementById('gem' + gem_count);
    obj.src = '../assets/images/g' + gem_count + '.png';
  }

  // si yo muero pierdo el juego (falta conectar aca)
  if (HP <= 0)
  {
    alert('Fin del Juego.');
  }
}

// función que calcula daño dependiendo de ataque del atacante y defensa del defensor
function calcular_dano(attack, defense)
{
  return Math.floor( (attack * attack) / (attack + defense) );
}

// función para selección de objetos (se activa al apretar un objeto en la mochila)
function selectObj(event)
{
  // si habia uno seleccionado antes lo deseleccionamos primero
  if (sel_obj != -1)
  {
    var obj = document.getElementById('d' + sel_obj);
    obj.classList.remove('sel');
  }

  num_obj = parseInt(event.target.id[1]);
  var obj = document.getElementById('d' + num_obj);

  // destacamos objeto elegido
  obj.classList.add('sel');

  // variable apunta a id de objeto seleccionado
  sel_obj = num_obj;
}

// función para selección de objetos (se activa al apretar un objeto en arsenal)
function selectArs(event)
{
  // si habia uno seleccionado antes lo deseleccionamos primero
  if (sel_ars != -1)
  {
    var obj = document.getElementById('ars' + sel_ars);
    obj.classList.remove('sel');
  }

  num_obj = parseInt((event.target.id).slice(3));
  var obj = document.getElementById('ars' + num_obj);

  // destacamos objeto elegido
  obj.classList.add('sel');

  // variable apunta a id de objeto seleccionado
  sel_ars = num_obj;
}

// función para utilizar objeto seleccionado en mochila (se activa con el boton en mochila)
function utilizar()
{
  // sólo si seleccionamos una celda con un objeto en ella
  if (sel_obj == -1 || sel_obj > num_objects)
  {
    alert('Primero seleccione un objeto.');
    return;
  }
  // si el objeto seleccionado es una poción updateamos la vida
  if (backpack_id[sel_obj - 1] == 5)
  {
    var line = document.getElementById('H');
    HP = Math.min(100, HP + 30);
    line.textContent = 'HP: ' + HP;
  }
  // si tenemos lleno el arsenal no podemos equiparlo
  else if (arsenal_cnt == 3)
  {
    alert('No hay espacio en arsenal.');
    return;
  }
  else
  {
    // aumentan objetos en arsenal
    arsenal_cnt += 1;

    // asignamos imagenes e ids a posición nueva del arsenal
    var img = document.getElementById('ars' + arsenal_cnt);
    img.src = backpack[sel_obj - 1]; arsenal[arsenal_cnt - 1] = backpack[sel_obj - 1];
    arsenal_id[arsenal_cnt - 1] = backpack_id[sel_obj - 1];

    // updateamos ataque y defensa dependiendo de objeto equipado
    var line1 = document.getElementById('D');
    Defense += 2 * defense_add[arsenal_id[arsenal_cnt - 1]];
    line1.textContent = 'Defensa: ' + Defense;

    var line2 = document.getElementById('A');
    Attack += 2 * attack_add[arsenal_id[arsenal_cnt - 1]];
    line2.textContent = 'Ataque: ' + Attack;
  }

  // llamamos función que quita elemento de la mochila
  eliminar();
}

function desequipar()
{
  // solo podemos quitar de arsenal si seleccionamos una celda válida
  if (sel_ars == -1 || sel_ars > arsenal_cnt)
  {
    alert('Primero seleccione un objeto.');
    return;
  }
  // sólo podemos desequipar se tenemos espacio en mochila
  if (num_objects == 9)
  {
    alert('Tienes muchos objetos en la mochila!');
    return;
  }

  // nuevo objeto en mochila
  num_objects += 1;
  var img = document.getElementById('m' + num_objects);
  img.src = arsenal[sel_ars - 1]; backpack[num_objects - 1] = arsenal[sel_ars - 1];
  backpack_id[num_objects - 1] = arsenal_id[sel_ars - 1];

  // quitamos ataque y defensa según objeto desequipado
  var line1 = document.getElementById('D');
  Defense -= defense_add[arsenal_id[sel_ars - 1]];
  line1.textContent = 'Defensa: ' + Defense;

  var line2 = document.getElementById('A');
  Attack -= attack_add[arsenal_id[sel_ars - 1]];
  line2.textContent = 'Ataque: ' + Attack;

  // movemos imagenes y variables del arsenar para reacomodar los restantes
  arsenal_cnt -= 1;
  for (var i = sel_ars; i < 3; i++)
  {
    var img1 = document.getElementById('ars' + i);
    arsenal[i - 1] = arsenal[i];
    arsenal_id[i - 1] = arsenal_id[i];
    img1.src = arsenal[i];
  }
  var img = document.getElementById('ars' + 3);
  arsenal[3] = '../assets/images/bbb.png';
  arsenal_id[8] = -1;
  img.src = '../assets/images/bbb.png';

  // deseleccionamos celda del arsenal seleccionada
  var obj = document.getElementById('ars' + sel_ars);
  obj.classList.remove('sel'); sel_ars = -1;
}

function eliminar()
{
  // sólo podemos eliminar un objeto si hay uno válido seleccionado
  if (sel_obj == -1 || sel_obj > num_objects)  
  {
    alert('Primero seleccione un objeto.');
    return;
  }

  // cambiamos ataque y defensa según objeto eliminado
  var line1 = document.getElementById('D');
  Defense -= defense_add[backpack_id[sel_obj - 1]];
  line1.textContent = 'Defensa: ' + Defense;

  var line2 = document.getElementById('A');
  Attack -= attack_add[backpack_id[sel_obj - 1]];
  line2.textContent = 'Ataque: ' + Attack;

  // movemos variables para reacomodar objetos restantes en mochila
  num_objects -= 1;
  for (var i = sel_obj; i < 9; i++)
  {
    var img1 = document.getElementById('m' + i);
    backpack[i - 1] = backpack[i];
    backpack_id[i - 1] = backpack_id[i];
    img1.src = backpack[i];
  }
  var img = document.getElementById('m' + 9);
  backpack[8] = '../assets/images/bbb.png';
  backpack_id[8] = -1;
  img.src = '../assets/images/bbb.png';

  // deseleccionamos celda de objeto seleccionada
  var obj = document.getElementById('d' + sel_obj);
  obj.classList.remove('sel'); sel_obj = -1;
}

// función que teletransporta a la base (activada con el botón 'base')
function base()
{
  // sólo si no hemos jugado
  if (jugadas != 0) {  
    alert('Ya hiciste una jugada!');
    
    // movemos a base del jugador
  } else {  
    if (numJugador == 1) posicion_deseada = 1;
    if (numJugador == 2) posicion_deseada = 5;
    if (numJugador == 3) posicion_deseada = 25;

    alert('Haz declarado tu jugada!');

    jugada['posicion_anterior'] = posicion_actual;
    jugada['nueva_pos'] = posicion_deseada;

    // cambiamos planeta destacado a nueva posición
    var obj = document.getElementById('00' + posicion_actual);
    obj.classList.remove('sel');
    var obj = document.getElementById('00' + posicion_deseada);
    obj.classList.add('sel');
    
    posicion_actual = posicion_deseada;

    // nos movemos a vista planeta
    var img = document.getElementById('mapon-img');
    var obj = document.getElementById('mapon-obj');
    img.src = '../assets/images/Planets-bg/' + imgs[posicion_deseada - 1] + '.png';
    if (has_enemy[posicion_deseada - 1] == 1)
    {
      obj.src = enemies[objects[posicion_deseada - 1]];
      var line = document.getElementById('E');
      line.textContent = 'Enemy HP: ' + hp_left[posicion_deseada - 1];
    }
    else if (has_object[posicion_deseada - 1] == 1)
    {
      obj.src = allObjects[objects[posicion_deseada - 1]];
    }
    else
    {
      obj.src = '../assets/images/bbb.png';
    }


    document.getElementsByClassName('mapon')[0].style.display = 'grid';
    document.getElementsByClassName('map')[0].style.display = 'none';
    on_map = 0;

    jugadas = 1;
  }
}

/*
 * función que selecciona un personaje (se activa al cliquear un personaje en frontend)
 * event es el div cliqueado
 */
function selectChar(event)  
{
  // si había un personaje seleccionado antes, deseleccionamos primero
  if (sel_character != -1)  
  {
    var obj = document.getElementById('t' + sel_character);
    obj.classList.remove('sel');
  }

  num_obj = parseInt(event.target.id[1]);
  var obj = document.getElementById('t' + num_obj);
  
  // añadimos destaque amarillo
  obj.classList.add('sel'); 

  // mostramos habilidad de personaje seleccionado
  alert(char_hab[team[num_obj - 1]]);  

  sel_character = num_obj;
}

// función que aplica habilidad especial (activada con el boton 'special')
function special()
{
  // sólo si tengo habilidades a usar disponibles (depende de pergaminos)
  if (Special == 0) 
  {
    alert('No tienes habilidades especiales disponibles :(');
    return;
  }
  // primero debes haber seleccionado un personaje
  if (sel_character == -1) 
  {
    alert('Primero selecciona a un personaje');
    return;
  }

  // numero de personaje en celda elegida
  var num_sel =  team[num_obj - 1];  

  // acá aplico los efectos dependiendo del personaje elejido
  if (num_sel == 0)
  {
    Attack += 80;
  }
  if (num_sel == 1)
  {
    Attack += 60;
    Defense += 20;
  }
  if (num_sel == 2)
  {
    Defense += 80;
  }
  // este es el que genera un objeto al azar para la mochila
  if (num_sel == 3)  
  {
    if (num_objects == 9)
    {
      alert('Tienes muchos objetos en la mochila!');
      return;
    }

    var obj_sel = 7;
    while (obj_sel == 7 || obj_sel == 3)
    {
      obj_sel = Math.floor(Math.random() * 8);
    }

    num_objects += 1;
    var img = document.getElementById('m' + num_objects);
    img.src = allObjects[obj_sel];
    backpack[num_objects - 1] = allObjects[obj_sel];
    backpack_id[num_objects - 1] = obj_sel;
  }
  if (num_sel == 4)
  {
    Attack += 40;
    Defense += 40;
  }
  // este es el que baja la defensa del oponente
  if (num_sel == 5)  
  {
    if (on_map == 1)
    {
      alert('Debes estar en un planeta para usar esta habilidad');
      return;
    }
    if (has_enemy[posicion_actual - 1] == 0)
    {
      alert('No hay enemigos a la vista');
      return;
    }
    df_less = 10;
  }
  // este es el que da vida
  if (num_sel == 6)  
  {
    HP = Math.min(100, HP + 50);
  }
  if (num_sel == 7)
  {
    Attack += 30;
    Defense += 50;
  }

  // cambiamos stats según corresponda
  var line1 = document.getElementById('A');
  line1.textContent = 'Ataque: ' + Attack;
  var line2 = document.getElementById('D');
  line2.textContent = 'Defensa: ' + Defense;
  var line3 = document.getElementById('H');
  line3.textContent = 'HP: ' + HP;

  used_special = 1; Special--;
  var line = document.getElementById('S');
  line.textContent = 'Special: ' + Special;
}

// función que quita efectos de habilidades especiales de un turno (se llama al final de cada turno)
function special_off()
{
  // si no habia usado habilidad no hago nada
  if (used_special == 0)
  {
    return;
  }
  used_special == 0;

  var num_sel =  team[num_obj - 1];

  // aca quito los efectos de la habilidad aplicada (si duraba un turno)
  if (num_sel == 0)
  {
    Attack -= 80;
  }
  if (num_sel == 1)
  {
    Attack -= 60;
    Defense -= 20;
  }
  if (num_sel == 2)
  {
    Defense -= 80;
  }
  if (num_sel == 4)
  {
    Attack -= 40;
    Defense -= 40;
  }
  if (num_sel == 5)
  {
    df_less = 0;
  }
  if (num_sel == 7)
  {
    Attack -= 30;
    Defense -= 50;
  }

  // update de stats según corresponda
  var line1 = document.getElementById('A');
  line1.textContent = 'Ataque: ' + Attack;
  var line2 = document.getElementById('D');
  line2.textContent = 'Defensa: ' + Defense;
  var line3 = document.getElementById('H');
  line3.textContent = 'HP: ' + HP;

  num_obj = sel_character;
  var obj = document.getElementById('t' + num_obj);
  obj.classList.remove('sel'); sel_character = -1;
}