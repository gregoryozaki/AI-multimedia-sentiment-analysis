document.getElementById("togglePassword").addEventListener("click", function () {
    const input = document.getElementById("password");
    const isPassword = input.type === "password";

    input.type = isPassword ? "text" : "password";

    // Alterna ícone minimalista
    this.textContent = isPassword ? "visibility_off" : "visibility";
});
