window.onload = function () {
  document.getElementById("buttonLogin").addEventListener("click", createUser)
}

function createUser() {
  const url = "https://sheltered-basin-80918.herokuapp.com/users/signup";
  const local = localStorage;
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const username = document.getElementById("username").value
  const Data = {
    username: username,
    email: email,
    password: password,
  };
  fetch(url, {
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
      let created = JSON.parse(res.created);
      if (created) {
        alert(res.message);
        // console.log(res.usuario)
        local.setItem('currentUser', JSON.stringify(res.user))
        window.location.replace("./views/personajes.html");
      } else {
        alert(res.message);
      };
    })
    .catch((error) => console.log(error));
}

