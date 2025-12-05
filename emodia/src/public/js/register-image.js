const input = document.getElementById("photoInput");
const preview = document.getElementById("preview");

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    preview.src = url;
    preview.style.display = "block";
});
