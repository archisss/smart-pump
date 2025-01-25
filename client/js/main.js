const { use } = require("../../api/users");

// Código para manejar el login
document
  .getElementById("loginForm")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.message) {
          alert(user.message);
        } else {
          localStorage.setItem("user", JSON.stringify(user));
          window.location.href = "/profile.html";
        }
      })
      .catch((err) => alert("Login failed"));
  });

// Código para mostrar el perfil del usuario
window.onload = function () {
  // Obtenemos el usuario almacenado en el localStorage (esto se hace si el usuario ya está autenticado)
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if (user) {
    // Actualizamos la imagen del perfil con la URL que tenemos en la propiedad 'picture'
    document.getElementById("profilePicture").src = user.picture;

    // Actualizamos el nombre del usuario
    document.getElementById(
      "name"
    ).textContent = `${user.name.first} ${user.name.last}`;

    // Habilitamos el botón de balance solo si el usuario está activo
    if (user.isActive) {
      document.getElementById("balanceBtn").disabled = false;
      document
        .getElementById("balanceBtn")
        .addEventListener("click", function () {
          alert(`Your balance: ${user.balance}`);
        });
    }

    // Agregamos el evento para redirigir a la página de edición
    document.getElementById("editBtn").addEventListener("click", function () {
      window.location.href = "/edit.html";
    });
  } else {
    // Si no hay usuario en localStorage, redirigimos al login
    window.location.href = "/";
  }
};
