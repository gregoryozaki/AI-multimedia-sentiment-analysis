/* ================================
   ELEMENTOS
=================================== */

const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm");
const birthInput = document.getElementById("birthdate");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirm = document.getElementById("toggleConfirm");

const openTerms = document.getElementById("open-terms");
const modalTerms = document.getElementById("modal-terms");
const closeTerms = document.getElementById("close-terms");

const modalAge = document.getElementById("modal-age");
const closeAge = document.getElementById("close-age");

const form = document.getElementById("signup-form");

/* ================================
   MOSTRAR / ESCONDER SENHA
=================================== */

togglePassword.onclick = () => {
    const show = password.type === "password";
    password.type = show ? "text" : "password";
    togglePassword.textContent = show ? "visibility_off" : "visibility";
};

/* ================================
   MOSTRAR / ESCONDER CONFIRMAR SENHA
=================================== */

toggleConfirm.onclick = () => {
    const show = confirmPassword.type === "password";
    confirmPassword.type = show ? "text" : "password";
    toggleConfirm.textContent = show ? "visibility_off" : "visibility";
};

/* ================================
   MODAL - TERMOS
=================================== */

openTerms.onclick = (e) => {
    e.preventDefault();
    modalTerms.classList.add("open");
};

closeTerms.onclick = () => modalTerms.classList.remove("open");

/* botão extra dentro do include, caso exista */
const closeTerms2 = document.getElementById("close-terms-2");
if (closeTerms2) {
    closeTerms2.onclick = () => modalTerms.classList.remove("open");
}

/* ================================
   REGRAS DA SENHA
=================================== */

const rules = {
    rule1: /.{8,}/,
    rule2: /[A-Z]/,
    rule3: /[a-z]/,
    rule4: /[0-9]/,
    rule5: /[@#$%&*!?]/,
};

password.addEventListener("input", () => {
    Object.entries(rules).forEach(([id, regex]) => {
        const li = document.getElementById(id);
        const ok = regex.test(password.value);
        li.classList.toggle("valid", ok);
    });
});

/* ================================
   VALIDAÇÃO 18+
=================================== */
function isAdult(date) {
    const birth = new Date(date);
    const now = new Date();

    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;

    return age >= 18;
}

closeAge.onclick = () => modalAge.classList.remove("open");

/* ================================
   SUBMIT FINAL
=================================== */

form.addEventListener("submit", (e) => {

    // 1 — Idade mínima
    if (!isAdult(birthInput.value)) {
        e.preventDefault();
        modalAge.classList.add("open");
        return;
    }

    // 2 — Senhas iguais
    if (password.value !== confirmPassword.value) {
        e.preventDefault();
        alert("As senhas não coincidem.");
        return;
    }

    // 3 — Regras atendidas
    for (const regex of Object.values(rules)) {
        if (!regex.test(password.value)) {
            e.preventDefault();
            alert("Sua senha não atende todos os requisitos.");
            return;
        }
    }
});
