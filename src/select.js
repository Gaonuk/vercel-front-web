const local = localStorage;
const currentUser = JSON.parse(local.getItem("currentUser"));

window.onload = function () {
  const boton1 = document.querySelector("#ingreso");

  if (local.getItem("currentUser") != null) {
    boton1.innerHTML = "Desconectarse";
    boton1.href = "#";
    boton1.addEventListener("click", desconectarse);
  }

  if (local.getItem("currentUser") == null) {
    alert("Debes conectarte para crear un equipo!");
    window.location.replace("../views");
  }
  checkEquipo();

  document.getElementById("addDuncan").addEventListener("click", addDuncan);
  document.getElementById("addBeef").addEventListener("click", addBeef);
  document.getElementById("addSteve").addEventListener("click", addSteve);
  document.getElementById("addVader").addEventListener("click", addVader);
  document.getElementById("addKike").addEventListener("click", addKike);
  document.getElementById("addRanger").addEventListener("click", addRanger);
  document.getElementById("addTony").addEventListener("click", addTony);
  document.getElementById("addMeep").addEventListener("click", addMeep);
  document.getElementById("confirmar").addEventListener("click", confirmEquipo);
};

const equipo = {
  1: "",
  2: "",
  3: "",
};

function desconectarse() {
  local.removeItem("currentUser");
  location.reload();
}

function addDuncan() {
  if (equipo[1] === "") {
    equipo[1] = "Duncan";
    alert("Has agregado a Duncan a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Duncan";
    alert("Has agregado a Duncan a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Duncan";
    alert("Has agregado a Duncan a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addDuncan").disabled = true;
}

function addBeef() {
  if (equipo[1] === "") {
    equipo[1] = "Beef";
    alert("Has agregado a Beef a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Beef";
    alert("Has agregado a Beef a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Beef";
    alert("Has agregado a Beef a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addBeef").disabled = true;
}

function addSteve() {
  if (equipo[1] === "") {
    equipo[1] = "Steve";
    alert("Has agregado a Steve a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Steve";
    alert("Has agregado a Steve a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Steve";
    alert("Has agregado a Steve a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addSteve").disabled = true;
}

function addTony() {
  if (equipo[1] === "") {
    equipo[1] = "Tony";
    alert("Has agregado a Tony a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Tony";
    alert("Has agregado a Tony a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Tony";
    alert("Has agregado a Tony a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addTony").disabled = true;
}

function addKike() {
  if (equipo[1] === "") {
    equipo[1] = "Kike";
    alert("Has agregado a Kike a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Kike";
    alert("Has agregado a Kike a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Kike";
    alert("Has agregado a Kike a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addKike").disabled = true;
}

function addVader() {
  if (equipo[1] === "") {
    equipo[1] = "Vader";
    alert("Has agregado a Vader a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Vader";
    alert("Has agregado a Vader a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Vader";
    alert("Has agregado a Vader a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addVader").disabled = true;
}

function addRanger() {
  if (equipo[1] === "") {
    equipo[1] = "Ranger";
    alert("Has agregado a Ranger a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Ranger";
    alert("Has agregado a Ranger a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Ranger";
    alert("Has agregado a Ranger a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addRanger").disabled = true;
}

function addMeep() {
  if (equipo[1] === "") {
    equipo[1] = "Meep";
    alert("Has agregado a Meep a tu equipo!");
    alert("Te quedan 2 personajes por elegir!");
  } else if (equipo[2] === "") {
    equipo[2] = "Meep";
    alert("Has agregado a Meep a tu equipo!");
    alert("Te queda 1 personaje por elegir!");
  } else if (equipo[3] === "") {
    equipo[3] = "Meep";
    alert("Has agregado a Meep a tu equipo!");
    alert("Tu equipo esta completo!");
  } else {
    alert("Tu equipo ya esta completo");
  }
  document.getElementById("addMeep").disabled = true;
}

function confirmEquipo() {
  local.setItem('currentEquipo', JSON.stringify(equipo))
  alert('Gracias por crear tu equipo! Ahora puedes ir a jugar!')
  window.location.replace("./views/juego.html")
}

function checkEquipo() {
  const urlGet = `https://sheltered-basin-80918.herokuapp.com/equipos/${currentUser["id"]}`;
  const Data = {
    uid: currentUser["id"]
  }
  fetch(urlGet, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(Data),
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res["equipo"] != null) {
        alert("Ya tienes un equipo!");
        window.location.replace("../views");
      } else {
        alert("Crea tu equipo para jugar!")
      }
    })
    .catch((error) => console.log(error));
}
