const input = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const previewImg = document.getElementById("previewImg");

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    previewImg.src = URL.createObjectURL(file);
    previewContainer.classList.remove("hidden");
});
