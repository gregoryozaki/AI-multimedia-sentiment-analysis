const emojis = document.querySelectorAll(".emoji-option");
const inputMood = document.getElementById("selectedMood");

emojis.forEach(emoji => {
    emoji.addEventListener("click", () => {

        // Remove seleção anterior
        emojis.forEach(e => e.classList.remove("emoji-selected"));

        // Marca selecionado
        emoji.classList.add("emoji-selected");

        // Salva valor no hidden input
        inputMood.value = emoji.dataset.value;
    });
});
