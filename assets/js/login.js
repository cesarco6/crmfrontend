<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const role = document.getElementById("role").value

    // Simple validation
    if (!email || !password || !role) {
      alert("Por favor complete todos los campos")
      return
    }

    // Store user role in sessionStorage
    sessionStorage.setItem("userRole", role)
    sessionStorage.setItem("userEmail", email)

    // Redirect based on role
    if (role === "director") {
      window.location.href = "director.html"
    } else if (role === "agente") {
      window.location.href = "agente.html"
    }
  })
})
=======
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const role = document.getElementById("role").value

    // Simple validation
    if (!email || !password || !role) {
      alert("Por favor complete todos los campos")
      return
    }

    // Store user role in sessionStorage
    sessionStorage.setItem("userRole", role)
    sessionStorage.setItem("userEmail", email)

    // Redirect based on role
    if (role === "director") {
      window.location.href = "director.html"
    } else if (role === "agente") {
      window.location.href = "agente.html"
    }
  })
})
>>>>>>> 3036f607c4ad5fec9c712b3e9a5b6a5ae1bcfc2c
