const local = localStorage;

window.onload = function () {
  const boton1 = document.querySelector("#ingreso");

  if (local.getItem("currentUser") != null) {
    boton1.innerHTML = "Desconectarse";
    boton1.href = "#"
    boton1.addEventListener("click", desconectarse)
  }

  function desconectarse() {
    local.removeItem('currentUser')
    location.reload()
  }
};


